import _ from 'lodash'
import Brng from 'brng'

import fb from './fb'
import determineTeamSizes from './determineTeamSizes'
import { PROFESSIONS } from '../util/professions'

// writes to playersState
function assignTeamsAndProfessions (playersState) {

  const numberOfPlayers = _.size(playersState)

  const {
    numberOnGoodTeam,
    numberOnBadTeam,
    numberOfHeretics
  } = determineTeamSizes(numberOfPlayers)

  const assignedTeams = _.shuffle(
    _.times(numberOnBadTeam, _.constant('BAD'))
      .concat(_.times(numberOnGoodTeam, _.constant('GOOD')))
      .concat(_.times(numberOfHeretics, _.constant('HERETIC')))
  )

  // filter professions based on number of players
  const filteredProfessions = _.pickBy(PROFESSIONS, (professionObj) => {
    if (professionObj.minimumNumberOfPlayers) {
      return professionObj.minimumNumberOfPlayers <= numberOfPlayers
    }
    else {
      return true
    }
  })

  // setup profession pickers
  const defaultConfig = {repeatTolerance: 0, bias: 2}
  const defaultProfessionTypeProportions = {TANK: 3, ASSASSIN: 3, SUPPORT: 3, SPECIAL: 1}
  const badProfessionTypePicker = new Brng(defaultProfessionTypeProportions, defaultConfig)
  const goodProfessionTypePicker = new Brng(defaultProfessionTypeProportions, defaultConfig)
  const hereticProfessionTypePicker = new Brng(defaultProfessionTypeProportions, defaultConfig)

  const return1 = _.constant(1)
  const tankProfessionPicker = new Brng(
    _.chain(filteredProfessions).pickBy({type: 'TANK'}).mapValues(return1).valueOf(),
    defaultConfig
  )
  const assassinProfessionPicker = new Brng(
    _.chain(filteredProfessions).pickBy({type: 'ASSASSIN'}).mapValues(return1).valueOf(),
    defaultConfig
  )
  const supportProfessionPicker = new Brng(
    _.chain(filteredProfessions).pickBy({type: 'SUPPORT'}).mapValues(return1).valueOf(),
    defaultConfig
  )
  const specialProfessionPicker = new Brng(
    _.chain(filteredProfessions).pickBy({type: 'SPECIAL'}).mapValues(return1).valueOf(),
    defaultConfig
  )
  const professionTypeMapping = {
    TANK: tankProfessionPicker,
    ASSASSIN: assassinProfessionPicker,
    SUPPORT: supportProfessionPicker,
    SPECIAL: specialProfessionPicker
  }

  // pre-emptively populate the profession choices
  const goodTeamProfessionChoices = _.times(numberOnGoodTeam * 2,
    () => professionTypeMapping[goodProfessionTypePicker.pick()].pick())
  const badTeamProfessionChoices = _.times(numberOnBadTeam * 2,
    () => professionTypeMapping[badProfessionTypePicker.pick()].pick())
  const hereticTeamProfessionChoices = _.times(numberOfHeretics * 2,
    () => professionTypeMapping[hereticProfessionTypePicker.pick()].pick())

  // assign a team and profession choices to each player
  let index = -1
  _.forEach(playersState, (playerObj, playerId) => {
    index++

    const playerTeam = assignedTeams[index]
    let playerProfessionChoices
    if (playerTeam === 'BAD') {
      playerProfessionChoices = _.times(2, () => badTeamProfessionChoices.pop())
    }
    else if (playerTeam === 'GOOD') {
      playerProfessionChoices = _.times(2, () => goodTeamProfessionChoices.pop())
    }
    else if (playerTeam === 'HERETIC') {
      playerProfessionChoices = _.times(2, () => hereticTeamProfessionChoices.pop())
    }

    playerObj.team = playerTeam
    playerObj.professionChoices = playerProfessionChoices
  })
  return playersState
}

export default async function startGame () {
  const playersState = (await fb('players').once('value')).val()

  assignTeamsAndProfessions(playersState) // write to playersState

  await Promise.all([
    fb('meta').set({
      turn: {
        playersAlive: _.size(playersState),
        playersChosenSkill: 0,
        playersReviewedTurn: 0,
        playersChosenProfession: 0
      },
      time: {
        start: (new Date()).toString()
      }
    }),

    fb('detectives/cost').set({
      health: 30,
      intent: 38,
      profession: 30,
      money: 20,
      team: 150
    }),

    fb('turns/currentTurn').set(1),
    fb('players').update(playersState)
  ])

  await fb('status').set('CHOOSE_PROFESSION')
}