import firebase from 'firebase'
import _ from 'lodash'

import getRoomID from './util/getRoomID'
import { PROFESSIONS, SKILLS } from './util/professions'


var config = {
  apiKey: "AIzaSyBQhxIPIgzp236kPKFRt6AqrB69tE9I3YM",
  authDomain: "hit-game.firebaseapp.com",
  databaseURL: "https://hit-game.firebaseio.com",
  projectId: "hit-game",
  storageBucket: "hit-game.appspot.com",
  messagingSenderId: "529926024736"
};
firebase.initializeApp(config)


// window.addEventListener("beforeunload", function(event) {
//   const roomID = getRoomID()
//   if (roomID) {
//     fb('rooms', getRoomID()).remove()
//   }
// });

const possibleCharacters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.split('')
function create4CharacterID () {
  return _.times(4, _.partial(_.sample, possibleCharacters)).join('')
}
function fb (/* args */) {
  return firebase.database().ref('rooms/' + getRoomID() + '/' + _.toArray(arguments).join('/'))
}

async function addPlayer (payload) {
  const {name} = payload
  const playerId = create4CharacterID()

  await fb('players', playerId, 'name').set(name)
  return playerId
}

async function joinGame (name) {
  return await addPlayer({name})
}

async function queueSkill (payload) {
  const {player, target, skill} = payload
  const currentTurn = (await fb('turns/currentTurn').once('value')).val()

  await fb('meta/turn/playersChosenSkill').transaction((playersChosenSkill) => {
    return _.isNumber(playersChosenSkill) ? playersChosenSkill + 1 : 0
  })

  await fb('turns', 'turn' + currentTurn).push({
    player,
    target,
    skill
  })

  const {playersAlive, playersChosenSkill} = (await fb('meta/turn').once('value')).val()
  if (playersAlive === playersChosenSkill) {
    performAllSkills()
  }
  
}

async function performAllSkills () {
  const currentTurn = (await fb('turns/currentTurn').once('value')).val()
  const queuedSkills = (await fb('turns', 'turn' + currentTurn).once('value')).val()
  
  const skillsByPriority = _.chain(queuedSkills)
    .values()
    .sortBy((skillObj) => SKILLS[skillObj.skill].priority)
    .valueOf()

  const oldPlayersState = (await fb('players').once('value')).val()
  const newPlayersState = _.cloneDeep(oldPlayersState)

  _.forEach(skillsByPriority, (skillObj) => {
    SKILLS[skillObj.skill].doSkill(newPlayersState, skillObj)
  })
  await fb('players').update(newPlayersState)

  _.map(newPlayersState, (newPlayerObj, playerId) => {
    if (newPlayerObj.health <= 0 && oldPlayersState[playerId].health > 0) {
      fb('meta/turn/playersAlive').transaction((playersAlive) => (playersAlive - 1))
    }
  })


  await fb('status').set('REVIEW_TURN')
}
global.performAllSkills = performAllSkills


async function moveToNextTurn () {
  await fb('meta/turn').update({playersChosenSkill: 0, playersReviewedTurn: 0})

  const currentTurn = (await fb('turns/currentTurn').once('value')).val()

  // remove moves from current term to keep payload small
  fb('turns', 'turn' + currentTurn).remove() // no need to await

  await fb('turns/currentTurn').transaction((currentTurn) => {
    return _.isNumber(currentTurn) ? currentTurn + 1 : 0
  })
  await fb('status').set('CHOOSE_SKILL')
}

async function createNewGame () {
  const newRoomID = create4CharacterID()
  window.location.hash = 'room=' + newRoomID //+ '&first=true';
  window.location.reload();
}

function onGameStateChange (callback) {
  fb().on('value', (snapshot) => {
    callback(snapshot.val())
  })
}

global.fb = fb

async function startGame () {
  const playersState = (await fb('players').once('value')).val()

  // assigning a profession to each player
  const shuffledProfessionKeys = _.chain(PROFESSIONS).keys().shuffle().valueOf()
  let index = 0
  _.forEach(playersState, (playerObj, playerId) => {
    const playerProfessionKey = shuffledProfessionKeys[index++]
    playerObj.profession = playerProfessionKey
    playerObj.maxHealth = PROFESSIONS[playerProfessionKey].startingHealth
    playerObj.health = PROFESSIONS[playerProfessionKey].startingHealth
  })

  await fb('meta/turn').set({
    playersAlive: _.size(playersState),
    playersChosenSkill: 0,
    playersReviewedTurn: 0
  })

  await fb('turns/currentTurn').set(1)

  await fb('players').update(playersState)
  await fb('status').set('CHOOSE_SKILL')
}

async function readyForNextTurn () {
  await fb('meta/turn/playersReviewedTurn').transaction((playersReviewedTurn) => {
    return _.isNumber(playersReviewedTurn) ? playersReviewedTurn + 1 : 0
  })

  const {playersAlive, playersReviewedTurn} = (await fb('meta/turn').once('value')).val()
  if (playersAlive === playersReviewedTurn) {
    moveToNextTurn()
  }
}

const gameState = {
  meta: {
    turn: {
      playersAlive: 10,
      playersChosenSkill: 0,
      playersReviewedTurn: 0
    }
  },
  status: 'CHOOSE_SKILL|REVIEW_TURN',
  players: {
    a123: {
      name: 'player 1',
      health: 5,
      profession: 'TANK_LIFE',
      team: 'bad|good|renegade'
    },
    b234: {}
  },
  turns: {
    currentTurn: 1,
    turn1: [
      {
        player: 'player 1',
        skillId: 'ASSASSIN_HIT',
        target: 'player 2'
      },
      {}
    ],
    turn2: {}
  }
}

// {
//   room_id_123: gameState,
//   // room_id_234: anotherGameState
// }

export default {
  createNewGame,
  joinGame,
  onGameStateChange,
  startGame,
  queueSkill,
  readyForNextTurn
}
