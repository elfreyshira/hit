import React, { Component } from 'react';
import _ from 'lodash'

import Landing from  './components/Landing'
import Lobby from  './components/Lobby'
import ChooseProfession from  './components/ChooseProfession'
import ChooseSkill from  './components/ChooseSkill'
import ReviewTurn from  './components/ReviewTurn'
import SpectatorView from  './components/SpectatorView'
import GameOver from  './components/GameOver'

import getRoomID from './util/getRoomID'
import actions from './actions'

import './App.css';


class App extends Component {
  state = {
    room: getRoomID(),
    localStatus: '',
    player: '',
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

  renderChooseProfession () {
    if (this.state.player && this.state.gameState.status === 'CHOOSE_PROFESSION') {
      return <ChooseProfession appState={this.state} />
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

  isGameOver () {
    return this.state.gameState.status === 'BAD_VICTORY'
      || this.state.gameState.status === 'GOOD_VICTORY'
      || this.state.gameState.status === 'HERETIC_VICTORY'
      || this.state.gameState.status === 'TIE_VICTORY'
  }
  renderGameOver () {
    if (this.isGameOver()) {
      return <GameOver appState={this.state} />
    }
  }

  isPlayerAlive = () => {
    return _.get(this.state.gameState, ['players', this.state.player, 'health']) > 0
  }
  renderSpectatorView () {
    // only show if the game has already started
    // and either the player's dead or it's somebody who's just watching
    if (
      this.state.gameState.status
      && this.state.gameState.status !== 'CHOOSE_PROFESSION'
      && (!this.isPlayerAlive() || !this.state.player)
      && !this.isGameOver()) {
      return <SpectatorView appState={this.state} />
    }
  }

  render () {
    return (
      <div className="">
        {this.renderChooseProfession()}
        {this.renderChooseSkill()}
        {this.renderReviewTurn()}
        {this.renderSpectatorView()}
        {this.renderGameOver()}
        {this.renderLanding()}
        {this.renderLobby()}
      </div>
    )
  }
}

export default App;
