import _ from 'lodash'

import fb from './fb'
import { PROFESSIONS } from '../util/professions'

// write to playersState
function assignTeamsAndProfessions (playersState) {

  // shuffle team assignments
  const numberOfPlayers = _.size(playersState)
  const numberOnBadTeam = Math.round(numberOfPlayers/3)
  const numberOnGoodTeam = numberOfPlayers - numberOnBadTeam
  const assignedTeams = _.shuffle(
    _.times(numberOnBadTeam, _.constant('BAD'))
      .concat(_.times(numberOnGoodTeam, _.constant('GOOD')))
  )

  // split up the professions by type
  const tankProfessions = _.chain(PROFESSIONS).pickBy({type: 'TANK'}).keys().shuffle().valueOf()
  const assassinProfessions = _.chain(PROFESSIONS).pickBy({type: 'ASSASSIN'}).keys().shuffle().valueOf()
  const supportProfessions = _.chain(PROFESSIONS).pickBy({type: 'SUPPORT'}).keys().shuffle().valueOf()
  const professionTypeMapping = {
    TANK: tankProfessions,
    ASSASSIN: assassinProfessions,
    SUPPORT: supportProfessions
  }

  // profession types to cycle through for each team
  let badTeamProfessionTypes = _.shuffle(['TANK', 'ASSASSIN', 'SUPPORT'])
  let goodTeamProfessionTypes = _.shuffle(['TANK', 'ASSASSIN', 'SUPPORT'])


  // loop through each player and assign them a team and profession
  let index = -1
  _.forEach(playersState, (playerObj, playerId) => {
    index++

    const playerTeam = assignedTeams[index]

    // cycle through the profession types by team
    let playerProfessionType
    if (playerTeam === 'BAD') {
      playerProfessionType = badTeamProfessionTypes.pop()
      badTeamProfessionTypes = badTeamProfessionTypes.length
        ? badTeamProfessionTypes : _.shuffle(['TANK', 'ASSASSIN', 'SUPPORT'])
    }
    else if (playerTeam === 'GOOD') {
      playerProfessionType = goodTeamProfessionTypes.pop()
      goodTeamProfessionTypes = goodTeamProfessionTypes.length
        ? goodTeamProfessionTypes : _.shuffle(['TANK', 'ASSASSIN', 'SUPPORT'])
    }
    const playerProfessionKey = professionTypeMapping[playerProfessionType].pop()

    playerObj.profession = playerProfessionKey
    playerObj.team = playerTeam

    playerObj.maxHealth = PROFESSIONS[playerProfessionKey].startingHealth
    playerObj.health = PROFESSIONS[playerProfessionKey].startingHealth
  })

  return playersState
}


export default async function startGame () {
  const playersState = (await fb('players').once('value')).val()

  assignTeamsAndProfessions(playersState) // write to playersState

  await fb('meta/turn').set({
    playersAlive: _.size(playersState),
    playersChosenSkill: 0,
    playersReviewedTurn: 0
  })

  await fb('turns/currentTurn').set(1)

  await fb('players').update(playersState)
  await fb('status').set('CHOOSE_SKILL')
}