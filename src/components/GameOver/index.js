import React, { Component } from 'react';
import _ from 'lodash'

import PlayerInfo from '../PlayerInfo'
import HitsLog from '../ReviewTurn/HitsLog'
import DeadPeople from '../ReviewTurn/DeadPeople'

import { PROFESSIONS, SKILLS } from '../../util/professions'

function getPlayersOnTeam (players, team) {
  return _.chain(players)
    .filter({team})
    .map((playerObj) => {
      const isPlayerDead = playerObj.health <= 0
      return (
        <li key={playerObj.name}>
          {playerObj.name}
          {isPlayerDead ? ' (RIP)' : ''}
        </li>
      )
    })
    .valueOf()
}

class GameOver extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  renderPlayersList() {
    const goodPlayers = getPlayersOnTeam(this.props.appState.gameState.players, 'GOOD')
    const badPlayers = getPlayersOnTeam(this.props.appState.gameState.players, 'BAD')
    const heretic = getPlayersOnTeam(this.props.appState.gameState.players, 'HERETIC')

    return (
      <div>
        <h4>Evil Hitmen</h4>
        <ul>{badPlayers}</ul>
        <h4>Good Rebel forces</h4>
        <ul>{goodPlayers}</ul>
        {_.isEmpty(heretic) ? null : (
          <div>
            <h4>Heretic</h4>
            <ul>{heretic}</ul>
          </div>
        )}
      </div>
    )
  }

  render () {
    const playerObj = this.props.appState.gameState.players[this.props.appState.player]
    const currentTurn = this.props.appState.gameState.turns.currentTurn
    const victoryStatus = this.props.appState.gameState.status

    let victoryText
    if (victoryStatus === 'BAD_VICTORY') {
      victoryText =
        'The hitmen have successfully taken out the rebel forces. LONG LIVE THE ETERNAL GOVERNMENT!'
    }
    else if (victoryStatus === 'GOOD_VICTORY') {
      victoryText = 'The evil hitmen are dead. Congrats, the rebel forces stand strong!'
    }
    else if (victoryStatus === 'HERETIC_VICTORY') {
      victoryText = `The heretic stands alone in victory! That's actually really impressive.`
    }
    else if (victoryStatus === 'TIE_VICTORY') {
      victoryText = 'Everyone was eliminated simultaneously. You all lose.'
    }

    return (
      <div>
        <h1>Game Over</h1>
        <h3>{victoryText}</h3>
        <hr />
        <PlayerInfo appState={this.props.appState} />
        <hr />
        <HitsLog appState={this.props.appState} />
        <hr />
        {this.renderPlayersList()}
      </div>
    )
  }
}

export default GameOver