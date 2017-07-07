import queryString from 'query-string'
import _ from 'lodash'

function determineTeamSizes (numberOfPlayers) {
  const {good, bad, heretic} = _.mapValues(queryString.parse(window.location.search), parseInt)

  let numberOnBadTeam
  let numberOnGoodTeam
  let numberOfHeretics

  ////// GRAB TEAM NUMBERS FROM URL //////
  if (good > 0 || bad > 0 || heretic >= 0)  {
    if (heretic === 0 && !_.isNumber(good) && !_.isNumber(bad)) {
      numberOnBadTeam = Math.round(numberOfPlayers * 0.41)
      numberOnGoodTeam = numberOfPlayers - numberOnBadTeam
      numberOfHeretics = 0
    }
    else if (good > 0 && !_.isNumber(bad)) {
      numberOnGoodTeam = good
      numberOnBadTeam = numberOfPlayers - numberOnGoodTeam
      numberOfHeretics = 0
    }
    else if (bad > 0 && !_.isNumber(good)) {
      numberOnBadTeam = bad
      numberOnGoodTeam = numberOfPlayers - numberOnBadTeam
      numberOfHeretics = 0
    }
    else if (good > 0 && bad > 0) {
      numberOnGoodTeam = good
      numberOnBadTeam = bad
      numberOfHeretics = numberOfPlayers - numberOnBadTeam - numberOnGoodTeam
    }
  }

  ////// FORMULAIC APPROACH TO TEAM //////
  else {
    if (numberOfPlayers % 2 === 0 && numberOfPlayers >= 4 && numberOfPlayers < 12) { // even and 4-10
      numberOnGoodTeam = numberOfPlayers / 2
      numberOnBadTeam = numberOnGoodTeam - 1
      numberOfHeretics = 1
    }
    else if (numberOfPlayers % 2 === 0 && numberOfPlayers >= 12) { // even and 12+
      numberOnBadTeam = Math.round(numberOfPlayers * 0.45)
      numberOnGoodTeam = numberOfPlayers - numberOnBadTeam
      numberOfHeretics = 0
    }
    else if (numberOfPlayers >= 11) { // if odd and 11+
      numberOnBadTeam = Math.round(numberOfPlayers * 0.4)
      numberOnGoodTeam = numberOfPlayers - numberOnBadTeam - 1
      numberOfHeretics = 1
    }
    else { // if odd and 9- (or 2)
      numberOnBadTeam = Math.round(numberOfPlayers * 0.4)
      numberOnGoodTeam = numberOfPlayers - numberOnBadTeam
      numberOfHeretics = 0
    }
  }

  return {numberOnGoodTeam, numberOnBadTeam, numberOfHeretics}
}

export default determineTeamSizes