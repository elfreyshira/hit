import React, { Component } from 'react';
import _ from 'lodash'

import Landing from  './components/Landing'
import Lobby from  './components/Lobby'
import ChooseSkill from  './components/ChooseSkill'
import ReviewTurn from  './components/ReviewTurn'
import SpectatorView from  './components/SpectatorView'

import getRoomID from './util/getRoomID'
import actions from './actions'

import './App.css';


class App extends Component {
  state = {
    room: getRoomID(),
    localStatus: '',
    player: '',
    // player: 'CKVB', // TEMPORARY!!!
    gameState: {}
  }
  componentDidMount = () => {
    if (!this.state.room) {
      this.setState({localStatus: 'landing'})
    }
    else {
      this.setState({localStatus: 'lobby'})
      actions.onGameStateChange((gameState) => this.setState({gameState: gameState || {}}))

      if (typeof(Storage) !== 'undefined') {
        const sessionPlayer = sessionStorage.getItem('player')
        const sessionRoom = sessionStorage.getItem('room')
        if (sessionRoom === this.state.room) {
          this.setState({player: sessionPlayer})
        }
      }
    }
  }

  onJoinGame = (playerId) => {
    this.setState({player: playerId})

    if (typeof(Storage) !== 'undefined') {
      sessionStorage.setItem('player', playerId)
      sessionStorage.setItem('room', this.state.room)
    }
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
    if (this.state.player && this.state.gameState.status === 'CHOOSE_SKILL' && this.isPlayerAlive()) {
      return <ChooseSkill appState={this.state} />
    }
  }

  renderReviewTurn () {
    if (this.state.player && this.state.gameState.status === 'REVIEW_TURN' && this.isPlayerAlive()) {
      return <ReviewTurn appState={this.state} />
    }
  }

  isPlayerAlive = () => {
    return _.get(this.state.gameState, ['players', this.state.player, 'health']) > 0
  }
  renderSpectatorView () {
    // only show if the game has already started
    // and either the player's dead or it's somebody who's just watching
    if (this.state.gameState.status && (!this.isPlayerAlive() || !this.state.player)) {
      return <SpectatorView appState={this.state} />
    }
  }

  render () {
    return (
      <div className="">
        {this.renderChooseSkill()}
        {this.renderReviewTurn()}
        {this.renderSpectatorView()}
        {this.renderLanding()}
        {this.renderLobby()}
      </div>
    )
  }
}

export default App;
