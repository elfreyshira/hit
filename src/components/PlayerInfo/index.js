import React, { Component } from 'react';
import _ from 'lodash'

import { PROFESSIONS, SKILLS } from '../../util/professions'

import ReceivedMessages from './ReceivedMessages'

const TEAM_NAMES = {
  BAD: 'Evil Hitmen -- eliminate the rebel forces',
  GOOD: 'Good Rebel Forces -- defend against the secret hitmen among you'
}

class PlayerInfo extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  renderEvilTeammates () {
    const playerObj = this.props.appState.gameState.players[this.props.appState.player]
    if (playerObj.team === 'BAD') {
      const teammatesString = _.chain(this.props.appState.gameState.players)
        .reject((playerObj, playerId) => (this.props.appState.player === playerId))
        .filter({team: 'BAD'})
        .map('name')
        .valueOf()
        .join(', ')
      if (teammatesString) {
        return <p>Other evil hitmen teammates: {teammatesString}</p>
      }
    }
  }

  render () {
    const playerObj = this.props.appState.gameState.players[this.props.appState.player]


    return (
      <div>
        <p>Name: {playerObj.name}</p>
        <p>Team: {TEAM_NAMES[playerObj.team]}</p>
        {this.renderEvilTeammates()}
        <p>Profession: {PROFESSIONS[playerObj.profession].name}</p>
        <p>Description: {PROFESSIONS[playerObj.profession].description}</p>
        <p>Health: {Math.max(playerObj.health, 0)} / {playerObj.maxHealth}</p>
        <p>Money: ${Math.max(playerObj.money, 0)}</p>
        <ReceivedMessages appState={this.props.appState} />
      </div>
    );
  }
}

export default PlayerInfo;
