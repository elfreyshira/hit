import firebase from 'firebase'
import _ from 'lodash'

import getRoomID from './util/getRoomID'

var config = {
  apiKey: "AIzaSyBQhxIPIgzp236kPKFRt6AqrB69tE9I3YM",
  authDomain: "hit-game.firebaseapp.com",
  databaseURL: "https://hit-game.firebaseio.com",
  projectId: "hit-game",
  storageBucket: "hit-game.appspot.com",
  messagingSenderId: "529926024736"
};
firebase.initializeApp(config)

global.firebase = firebase

// window.addEventListener("beforeunload", function(event) {
//   const roomID = getRoomID()
//   if (roomID) {
//     fb('rooms', getRoomID()).remove()
//   }
// });


function create4CharacterID () {
  return _.random(46656, 1679615).toString(36).toUpperCase().replace('I', 'X')
}
function fb (/* args */) {
  return firebase.database().ref(_.toArray(arguments).join('/'))
}

// health ranges from 10 - 20, depending on power of profession action
// hit filter: hits are checked to adjust damage to the player
// turn filter: events that happen after all actions are performed
const PROFESSIONS = {
  TANK_HEALTH: {
    startingHealth: 20,
    possibleActions: ['HIT_2']
  },
  TANK_ARMOR: {
    startingHealth: 14,
    possibleActions: ['HIT_2'],
    hitFilter: 'NO_MORE_THAN_2'
  },
  TANK_SQUISHY: {
    startingHealth: 10,
    possibleActions: ['HIT_2'],
    hitFilter: 'NO_DAMAGE_IF_2_OR_LESS'
  },
  TANK_AUTO_HEAL: {
    startingHealth: 12,
    possibleActions: ['HIT_2'],
    turnFilter: 'HEAL_BY_1'
  },
  ASSASSIN_NORMAL_LOW: {
    startingHealth: 13,
    possibleActions: ['HIT_2', 'HIT_3']
  },
  ASSASSIN_NORMAL_HIGH: {
    startingHealth: 10,
    possibleActions: ['HIT_2', 'HIT_4']
  },
  SUPPORT_HEAL_NORMAL_LOW: {
    startingHealth: 16,
    possibleActions: ['HIT_2', 'HEAL_2']
  },
  SUPPORT_HEAL_NORMAL_MED: {
    startingHealth: 13,
    possibleActions: ['HIT_2', 'HEAL_3']
  },
  SUPPORT_HEAL_NORMAL_HIGH: {
    startingHealth: 10,
    possibleActions: ['HIT_2', 'HEAL_4']
  }
}

const ACTIONS = {
  HIT_2: {
    priority: 2,
    doAction (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - 2
    }
  },
  HIT_3: {
    priority: 2,
    doAction (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - 3
    }
  },
  HIT_4: {
    priority: 2,
    doAction (playersState, payload) {
      const {player, target} = payload
      playersState[target].health = playersState[target].health - 4
    }
  },
  HEAL_2: {
    priority: 3,
    doAction (playersState, payload) {
      const {player, target} = payload
      const healedHealth = playersState[target].health + 2
      const maxHealth = playersState[target].maxHealth
      playersState[target].health = Math.min(healedHealth, maxHealth)
    }
  },
  HEAL_3: {
    priority: 3,
    doAction (playersState, payload) {
      const {player, target} = payload
      const healedHealth = playersState[target].health + 3
      const maxHealth = playersState[target].maxHealth
      playersState[target].health = Math.min(healedHealth, maxHealth)
    }
  },
  HEAL_4: {
    priority: 3,
    doAction (playersState, payload) {
      const {player, target} = payload
      const healedHealth = playersState[target].health + 4
      const maxHealth = playersState[target].maxHealth
      playersState[target].health = Math.min(healedHealth, maxHealth)
    }
  }
}

async function addPlayer (payload) {
  const {name} = payload
  const playerId = create4CharacterID()

  await fb('rooms', getRoomID(), 'players', playerId, 'name').set(name)
  return playerId
}
global.addPlayer = addPlayer

async function setupPlayer (payload) {
  const {playerId, profession, team} = payload
  const startingHealth = PROFESSIONS[profession].startingHealth

  await fb('rooms', getRoomID(), 'players', playerId).update({
    health: startingHealth,
    maxHealth: startingHealth,
    profession,
    team
  })
}
global.setupPlayer = setupPlayer

async function joinGame (name) {
  return await addPlayer({name})
}

async function queueAction (payload) {
  const {player, target, actionName} = payload
  const roomID = getRoomID()
  const currentTurn = (await fb('rooms', roomID, 'turns', 'currentTurn').once('value')).val()
  // const currentTurn = currentTurnSnapshot.val()

  await fb('rooms', roomID, 'turns', 'turn' + currentTurn).push({
    player,
    target,
    actionName
  })
}
global.queueAction = queueAction

async function performAllActions () {
  const roomID = getRoomID()
  const currentTurn = (await fb('rooms', roomID, 'turns', 'currentTurn').once('value')).val()
  const allActions = (await fb('rooms', roomID, 'turns', 'turn' + currentTurn).once('value')).val()
  
  const actionsByPriority = _.chain(allActions)
    .values()
    .sortBy((action) => ACTIONS[action.actionName].priority)
    .valueOf()

  const playersState = (await fb('rooms', roomID, 'players').once('value')).val()

  _.forEach(actionsByPriority, (action) => {
    ACTIONS[action.actionName].doAction(playersState, action)
  })

  fb('rooms', roomID, 'players').update(playersState)
}
global.performAllActions = performAllActions


async function nextTurn () {
  await fb('rooms', getRoomID(), 'turns', 'currentTurn').transaction((currentTurn) => {
    if (currentTurn) {
      return currentTurn + 1
    }
    else {
      return 1
    }
  })
}
global.nextTurn = nextTurn

async function createNewGame () {
  const newRoomID = create4CharacterID()
  window.location.hash = 'room=' + newRoomID //+ '&first=true';
  window.location.reload();
}

const gameState = {
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
        actionName: 'ASSASSIN_HIT',
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
  joinGame
}
