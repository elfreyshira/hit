import _ from 'lodash'

import fb from './fb'
import { PROFESSIONS } from '../util/professions'

export default async function startGame () {
  const playersState = (await fb('players').once('value')).val()

  // assigning a team to each player
  const numberOfPlayers = _.size(playersState)
  const numberOnBadTeam = Math.round(numberOfPlayers/3)
  const numberOnGoodTeam = numberOfPlayers - numberOnBadTeam
  const assignedTeams = _.shuffle(
    _.times(numberOnBadTeam, _.constant('BAD'))
      .concat(_.times(numberOnGoodTeam, _.constant('GOOD')))
  )

  // assigning a profession to each player
  const shuffledProfessionKeys = _.chain(PROFESSIONS).keys().shuffle().valueOf()
  let index = -1
  _.forEach(playersState, (playerObj, playerId) => {
    index++
    const playerProfessionKey = shuffledProfessionKeys[index]
    playerObj.profession = playerProfessionKey
    playerObj.team = assignedTeams[index]
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