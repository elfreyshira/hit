import React, { Component } from 'react';
import _ from 'lodash'

import PlayerInfo from '../PlayerInfo'
import HitsLog from '../ReviewTurn/HitsLog'
import DeadPeople from '../ReviewTurn/DeadPeople'

import { PROFESSIONS, SKILLS } from '../../util/professions'

class GameOver extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  renderPlayersList() {
    const goodPlayers = _.chain(this.props.appState.gameState.players)
      .filter({team: 'GOOD'})
      .map('name')
      .map((playerName) => {
        return <li key={playerName}>{playerName}</li>
      })
      .valueOf()

    const badPlayers = _.chain(this.props.appState.gameState.players)
      .filter({team: 'BAD'})
      .map('name')
      .map((playerName) => {
        return <li key={playerName}>{playerName}</li>
      })
      .valueOf()

    return (
      <div>
        <h4>Evil Hitmen</h4>
        <ul>{badPlayers}</ul>
        <h4>Rebel forces</h4>
        <ul>{goodPlayers}</ul>
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

    return (
      <div>
        <h1>Game Over</h1>
        <h3>{victoryText}</h3>
        <hr />
        <PlayerInfo appState={this.props.appState} />
        <hr />
        {this.renderPlayersList()}
      </div>
    )
  }
}

export default GameOver