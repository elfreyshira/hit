import React, { Component } from 'react';
import _ from 'lodash'

import { PROFESSIONS, SKILLS } from '../../util/professions'

const TEAM_NAMES = {
  BAD: 'Evil Hitmen -- eliminate the rebel forces',
  GOOD: 'Good Rebel Forces -- defend against the secret hitmen among you'
}

function Cur () {
  return <span style={{color: '#555', marginRight: '1px'}}>{'\u20B4'}</span>
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
        <p>Profession: {PROFESSIONS[playerObj.profession].name}</p>
        <p>Description: {PROFESSIONS[playerObj.profession].description}</p>
        <p>Health: {Math.max(playerObj.health, 0)} / {playerObj.maxHealth}</p>
        <p>Money: <Cur />{Math.max(playerObj.money, 0)}</p>
        <p>Team: {TEAM_NAMES[playerObj.team]}</p>
        {this.renderEvilTeammates()}
      </div>
    );
  }
}

export default PlayerInfo;
