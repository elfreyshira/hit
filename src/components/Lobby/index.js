import React, { Component } from 'react';
import _ from 'lodash'

import actions from '../../actions'

import Button from '../Button'
import IntroHeader from '../IntroHeader'

class Lobby extends Component {

  static propTypes = {
    // onJoinGame: React.PropTypes.func,
    // appState: React.PropTypes.object
  }

  state = {
    shouldHideButton: false
  }

  onJoinGame = async (evt) => {
    evt.preventDefault()
    const name = this.refs.name.value
    const playerId = await actions.joinGame(name)
    this.props.onJoinGame(playerId)
  }

  renderPlayerList = () => {
    if (_.has(this.props, 'appState.gameState.players')) {
      return (
        <div>
          <hr/>
          <h4>Players joined</h4>
          <ul>
            {_.map(this.props.appState.gameState.players, (playerObj) => {
              return <li key={playerObj.name}>{playerObj.name}</li>
            })}
          </ul>
        </div>
      )
    }
  }

  renderJoinForm = () => {
    if (!this.props.appState.player) {
      return (
        <form onSubmit={this.onJoinGame} action="">
          <hr/>
          <label>
            Enter your name (make sure others will recognize it's you): &nbsp;
            <input type="text" placeholder="Name" ref="name" required />
          </label>
          <input type="submit" style={{visibility: 'hidden', position: 'absolute'}} />
          <Button type="submit">Join game</Button>
        </form>
      )
    }
  }

  onStartGame = () => {
    this.setState({shouldHideButton: true})
    actions.startGame()
  }
  renderReadyButton = () => {
    if (this.props.appState.player) {
      return (
        <div>
          <hr/>
          <Button
            hidden={this.state.shouldHideButton}
            onClick={this.onStartGame}
          >
            Everybody is ready. Begin game.
          </Button>
        </div>
      )
    }
  }

  render () {
    return (
      <div>
        <IntroHeader/>
        {this.renderJoinForm()}
        {this.renderPlayerList()}
        {this.renderReadyButton()}
      </div>
    );
  }
}

export default Lobby;
