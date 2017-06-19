import React, { Component } from 'react';
import _ from 'lodash'

import Landing from  './components/Landing'
import Lobby from  './components/Lobby'
import ChooseSkill from  './components/ChooseSkill'

import getRoomID from './util/getRoomID'
import actions from './actions'

import './App.css';


class App extends Component {
  state = {
    room: getRoomID(),
    localStatus: '',
    player: '',
    // player: '55WG', // TEMPORARY!!!
    gameState: {}
  }
  componentDidMount = () => {
    if (!this.state.room) {
      this.setState({localStatus: 'landing'})
    }
    else {
      this.setState({localStatus: 'lobby'})
      actions.onGameStateChange((gameState) => this.setState({gameState: gameState || {}}))
    }
  }

  onJoinGame = (playerId) => {
    this.setState({player: playerId})
  }

  renderLanding () {
    if (this.state.localStatus === 'landing' && !this.state.gameState.status) {
      return <Landing />
    }
  }

  renderLobby () {
    if (this.state.localStatus === 'lobby' && !this.state.gameState.status) {
      return <Lobby onJoinGame={this.onJoinGame} appState={this.state} />
    }
  }

  renderChooseSkill () {
    if (this.state.player && this.state.gameState.status) {
      return <ChooseSkill appState={this.state} />
    }
  }

  render () {
    return (
      <div className="">
        {this.renderChooseSkill()}
        {this.renderLanding()}
        {this.renderLobby()}
      </div>
    )
  }
}

export default App;
