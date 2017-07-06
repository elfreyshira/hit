import firebase from 'firebase'
import _ from 'lodash'

import getRoomID from '../util/getRoomID'
import { PROFESSIONS } from '../util/professions'

import fb from './fb'
import startGame from './startGame'
import performAllSkills from './performAllSkills'

// var config = {
//   apiKey: "AIzaSyBQhxIPIgzp236kPKFRt6AqrB69tE9I3YM",
//   authDomain: "hit-game.firebaseapp.com",
//   databaseURL: "https://hit-game.firebaseio.com",
//   projectId: "hit-game",
//   storageBucket: "hit-game.appspot.com",
//   messagingSenderId: "529926024736"
// }
var config = {
  apiKey: "AIzaSyDrkXOwfrRJ_K6UyAOzfGyVnbgAVwP9RPE",
  authDomain: "thinkfast-41d88.firebaseapp.com",
  databaseURL: "https://thinkfast-41d88.firebaseio.com",
  projectId: "thinkfast-41d88",
  storageBucket: "thinkfast-41d88.appspot.com",
  messagingSenderId: "251919933131"
}
firebase.initializeApp(config)


// window.addEventListener("beforeunload", function(event) {
//   const roomID = getRoomID()
//   if (roomID) {
//     fb('rooms', getRoomID()).remove()
//   }
// })

const possibleCharacters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.split('')
const getRandomChar = _.partial(_.sample, possibleCharacters)
function createSimpleID (numberOfCharacters) {
  return _.times(numberOfCharacters || 4, getRandomChar).join('')
}

async function addPlayer (payload) {
  const {name} = payload
  const playerId = createSimpleID(4)

  await fb('players', playerId).set({
    name,
    id: playerId
  })
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

  const skillObj = {player, skill}
  if (target) {
    skillObj.target = target
  }
  await fb('turns', 'turn' + currentTurn).push(skillObj)

  const {playersAlive, playersChosenSkill} = (await fb('meta/turn').once('value')).val()
  if (playersAlive === playersChosenSkill) {
    performAllSkills()
  }
  
}

async function moveToNextTurn (playersAlive) {
  await fb('meta/turn').update({playersChosenSkill: 0, playersReviewedTurn: 0})

  const currentTurn = (await fb('turns/currentTurn').once('value')).val()

  // keep the most recent turn history. but remove the previous one to keep data storage small.
  fb('turns', 'turn' + (currentTurn-1)).remove() // no need to await

  ///// ADJUST DETECTIVE COSTS and remove history for the turn
  const detectiveObj = (await fb('detectives').once('value')).val()
  const detectiveCount = _.countBy(detectiveObj.hiredForTheTurn, 'detective')
  const detectiveCosts = detectiveObj.cost
  _.forEach(detectiveCosts, (cost, detectiveKey) => {
    const percentageHired = (detectiveCount[detectiveKey] || 0) / playersAlive * 50 // half the percentage
    detectiveCosts[detectiveKey] = Math.max(cost - 8 + Math.round(percentageHired), 8) // always cost at least 8
  })
  fb('detectives/cost').update(detectiveCosts) // no need to await
  fb('detectives/hiredForTheTurn').remove() // no need to await


  // increment turn
  await fb('turns/currentTurn').transaction((currentTurn) => {
    return _.isNumber(currentTurn) ? currentTurn + 1 : 0
  })
  await fb('status').set('CHOOSE_SKILL')
}

async function createNewGame () {
  const newRoomID = createSimpleID(4)
  window.location.search = 'room=' + newRoomID //+ '&first=true';
}

function onGameStateChange (callback) {
  fb().on('value', (snapshot) => {
    callback(snapshot.val())
  })
}

global.fb = fb

async function readyForNextTurn () {
  await fb('meta/turn/playersReviewedTurn').transaction((playersReviewedTurn) => {
    return _.isNumber(playersReviewedTurn) ? playersReviewedTurn + 1 : 0
  })

  const {playersAlive, playersReviewedTurn} = (await fb('meta/turn').once('value')).val()
  if (playersAlive === playersReviewedTurn) {
    moveToNextTurn(playersAlive)
  }
}

async function hireDetective (payload) {
  const {player, detective, target, cost} = payload
  fb('detectives/hiredForTheTurn', player).set({detective, target, cost})
  fb('players', player, 'money').transaction((playerMoney) => {
    return playerMoney - cost
  })
}

async function chooseProfession (payload) {
  const {player, profession} = payload

  await fb('players', player, 'professionChoices').remove()
  const playerObj = {
    profession,
    health: PROFESSIONS[profession].startingHealth,
    maxHealth: PROFESSIONS[profession].startingHealth,
    money: PROFESSIONS[profession].startingMoney || 100, // default starting money of 100
  }
  await fb('players', player).update(playerObj)

  await fb('meta/turn/playersChosenProfession').transaction((playersChosenProfession) => {
    return _.isNumber(playersChosenProfession) ? playersChosenProfession + 1 : 0
  })

  const {playersAlive, playersChosenProfession} = (await fb('meta/turn').once('value')).val()
  if (playersAlive === playersChosenProfession) {
    await fb('status').set('CHOOSE_SKILL')
  }
}

async function sendMessage (payload) {
  const {player, target, message, turn} = payload
  fb('messages').push({player, target, message, turn})
  fb('players', player, 'money').transaction((playerMoney) => {
    return playerMoney - 20
  })
}

const gameState = {
  meta: {
    turn: {
      playersAlive: 10,
      playersChosenSkill: 0,
      playersReviewedTurn: 0,
      playersChosenProfession: 0
    }
  },
  status: 'CHOOSE_SKILL|REVIEW_TURN',
  players: {
    a123: {
      name: 'player 1',
      health: 5,
      profession: 'TANK_LIFE',
      team: 'BAD|GOOD|RENEGADE'
    },
    b234: {}
  },
  detectives: {
    cost: {
      health: 30,
      intent: 30,
      profession: 30,
      money: 20,
      team: 150
    },
    hiredForTheTurn: { // removed after every turn
      '3NIZ': {
        detective: 'health',
        target: '39LK',
        cost: 22
      }
    }
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
  readyForNextTurn,
  hireDetective,
  chooseProfession,
  sendMessage
}
