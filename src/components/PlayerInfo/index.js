import React, { Component } from 'react';
import _ from 'lodash'

import { PROFESSIONS, SKILLS } from '../../util/professions'

class PlayerInfo extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  render () {
    const playerObj = this.props.appState.gameState.players[this.props.appState.player]

    return (
      <div>
        <p>Name: {playerObj.name}</p>
        <p>Profession: {PROFESSIONS[playerObj.profession].name}</p>
        <p>Description: {PROFESSIONS[playerObj.profession].description}</p>
        <p>Health: {playerObj.health} / {playerObj.maxHealth}</p>
      </div>
    );
  }
}

export default PlayerInfo;
