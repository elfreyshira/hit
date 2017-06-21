import React, { Component } from 'react';
import _ from 'lodash'

import { PROFESSIONS, SKILLS } from '../../util/professions'

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
      const teammates = _.chain(this.props.appState.gameState.players)
        .reject((playerObj, playerId) => (this.props.appState.player === playerId))
        .filter({team: 'BAD'})
        .map('name')
        .valueOf()
        .join(', ')

      return <p>Other evil hitmen teammates: {teammates}</p>
    }
  }

  render () {
    const playerObj = this.props.appState.gameState.players[this.props.appState.player]

    return (
      <div>
        <p>Name: {playerObj.name}</p>
        <p>Profession: {PROFESSIONS[playerObj.profession].name}</p>
        <p>Description: {PROFESSIONS[playerObj.profession].description}</p>
        <p>Health: {playerObj.health} / {playerObj.maxHealth}</p>
        <p>Team: {TEAM_NAMES[playerObj.team]}</p>
        {this.renderEvilTeammates()}
      </div>
    );
  }
}

export default PlayerInfo;
