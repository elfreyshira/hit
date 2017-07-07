import _ from 'lodash'

import { PROFESSIONS, SKILLS, HIT_FILTERS, POST_TURN_STEPS } from '../util/professions'

import fb from './fb'

export default async function performAllSkills () {
  const currentTurn = (await fb('turns/currentTurn').once('value')).val()
  const queuedSkills = (await fb('turns', 'turn' + currentTurn).once('value')).val()

  const oldPlayersState = (await fb('players').once('value')).val()
  const newPlayersState = _.cloneDeep(oldPlayersState)

  ////// PERFORM HIT SKILLS ///////
  const hitSkills = _.chain(queuedSkills)
    .values()
    .filter((skillObj) => (SKILLS[skillObj.skill].step === 'HIT'))
    .valueOf()

  _.forEach(hitSkills, (skillObj) => {
    SKILLS[skillObj.skill].doSkill(newPlayersState, skillObj) // write to newPlayersState
  })

  ////// PERFORM PROTECT SKILLS ///////
  const protect1Skills = _.chain(queuedSkills)
    .values()
    .filter((skillObj) => (SKILLS[skillObj.skill].step === 'PROTECT_1'))
    .valueOf()

  _.forEach(protect1Skills, (skillObj) => {
    SKILLS[skillObj.skill].doSkill(oldPlayersState, newPlayersState, skillObj) // write to newPlayersState
  })
  const protect2Skills = _.chain(queuedSkills)
    .values()
    .filter((skillObj) => (SKILLS[skillObj.skill].step === 'PROTECT_2'))
    .valueOf()

  _.forEach(protect2Skills, (skillObj) => {
    SKILLS[skillObj.skill].doSkill(oldPlayersState, newPlayersState, skillObj) // write to newPlayersState
  })

  ////// PERFORM HIT FILTERS ///////
  _.forEach(oldPlayersState, (playerObj, playerId) => {
    const hitFilterId = PROFESSIONS[playerObj.profession].hitFilter
    if (hitFilterId) {
      HIT_FILTERS[hitFilterId](oldPlayersState, newPlayersState, playerId) // write to newPlayersState
    }
  })

  ////// PERFORM HEAL SKILLS ///////
  const healSkills = _.chain(queuedSkills)
    .values()
    .filter((skillObj) => (SKILLS[skillObj.skill].step === 'HEAL'))
    .valueOf()

  _.forEach(healSkills, (skillObj) => {
    SKILLS[skillObj.skill].doSkill(newPlayersState, skillObj) // write to newPlayersState
  })

  ////// PERFORM NO_TARGET SKILLS ///////
  const targetlessSkills = _.chain(queuedSkills)
    .values()
    .filter((skillObj) => (SKILLS[skillObj.skill].step === 'NO_TARGET'))
    .valueOf()

  _.forEach(targetlessSkills, (skillObj) => {
    SKILLS[skillObj.skill].doSkill(newPlayersState, skillObj) // write to newPlayersState
  })

  ////// PERFORM POST TURN CALCULATIONS ///////
  _.forEach(oldPlayersState, (playerObj, playerId) => {
    const postTurnStepId = PROFESSIONS[playerObj.profession].postTurnStep
    if (postTurnStepId) {
      POST_TURN_STEPS[postTurnStepId](newPlayersState, playerId) // write to newPlayersState
    }
  })

  ////// ANYBODY WHO IS DEAD STAYS DEAD ///////
  _.forEach(oldPlayersState, (playerObj, playerId) => {
    if (playerObj.health <= 0) {
      newPlayersState[playerId].health = 0
    }
  })

  await fb('players').update(newPlayersState)

  ////// CHECK IF ANYBODY HAS DIED //////
  _.map(newPlayersState, (newPlayerObj, playerId) => {
    if (newPlayerObj.health <= 0 && oldPlayersState[playerId].health > 0) {
      fb('meta/turn/playersAlive').transaction((playersAlive) => (playersAlive - 1))
    }
  })

  ////// CHECK IF A TEAM HAS WON //////
  const playersStateValues = _.values(newPlayersState)
  const badTeam = _.filter(playersStateValues, {team: 'BAD'})
  const goodTeam = _.filter(playersStateValues, {team: 'GOOD'})
  const hereticTeam = _.filter(playersStateValues, {team: 'HERETIC'})

  const isBadTeamAllDead = badTeam.length === _.filter(badTeam, (playerObj) => playerObj.health <= 0).length
  const isGoodTeamAllDead = goodTeam.length === _.filter(goodTeam, (playerObj) => playerObj.health <= 0).length
  const isHereticAlive = hereticTeam.length === _.filter(hereticTeam, (playerObj) => playerObj.health > 0).length

  const goodTeamVictory = !isGoodTeamAllDead && isBadTeamAllDead && !isHereticAlive
  const badTeamVictory = isGoodTeamAllDead && !isBadTeamAllDead && !isHereticAlive
  const hereticVictory = isGoodTeamAllDead && isBadTeamAllDead && isHereticAlive
  const tieGame = isGoodTeamAllDead && isBadTeamAllDead && !isHereticAlive

  if (goodTeamVictory || badTeamVictory || hereticVictory || tieGame) { // GAME OVER
    fb('meta/time/end').set((new Date()).toString()) // log when the game ends
    if (goodTeamVictory) {
      fb('status').set('GOOD_VICTORY')
    }
    else if (badTeamVictory) {
      fb('status').set('BAD_VICTORY')
    }
    else if (hereticVictory) {
      fb('status').set('HERETIC_VICTORY')
    }
    else if (tieGame) {
      fb('status').set('TIE_VICTORY')
    }
  }
  else {
    // move on if no team has won yet
    fb('status').set('REVIEW_TURN')
  }
}
