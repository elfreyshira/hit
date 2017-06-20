import React, { Component } from 'react';
import _ from 'lodash'

import PlayerInfo from '../PlayerInfo'
import HitsLog from '../ReviewTurn/HitsLog'

import { PROFESSIONS, SKILLS } from '../../util/professions'

class SpectatorView extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  renderDead () {
    if (this.props.appState.player) {
      return (
        <div>
          <h2>You are dead!</h2>
          <h4>You can no longer participate, but feel free to spectate.</h4>
          <hr />
          <PlayerInfo appState={this.props.appState} />
          <hr />
        </div>
      )
    }
  }

  render () {
    const playerObj = this.props.appState.gameState.players[this.props.appState.player]
    const currentTurn = this.props.appState.gameState.turns.currentTurn

    return (
      <div>
        {this.renderDead()}
        <h2> Spectator View</h2>
        Current turn: {currentTurn}
        {this.props.appState.gameState.status === 'REVIEW_TURN'
          ? <HitsLog appState={this.props.appState} />
          : null
        }
      </div>
    )
  }
}

export default SpectatorView;
