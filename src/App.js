import React, { Component } from 'react';
import logo from './logo.svg';

import Landing from  './components/Landing'
import Lobby from  './components/Lobby'

import getRoomID from './util/getRoomID'

import './App.css';


class App extends Component {
  state = {
    room: getRoomID(),
    status: '',
    player: ''
  }
  componentDidMount = () => {
    if (!this.state.room) {
      this.setState({status: 'landing'})
    }
    else {
      this.setState({status: 'lobby'})
    }
  }

  onJoinGame = (playerId) => {
    this.setState({player: playerId})
  }

  render() {
    return (
      <div className="">
        {this.state.status === 'landing' ? <Landing/> : null}
        {this.state.status === 'lobby' ? <Lobby onJoinGame={this.onJoinGame} appState={this.state} /> : null}
      </div>
    );
  }
}

export default App;
