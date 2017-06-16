import React, { Component } from 'react';
import _ from 'lodash'

import actions from '../../actions'

import Button from '../Button'
import IntroHeader from '../IntroHeader'

class Lobby extends Component {

  static propTypes = {
    onJoinGame: React.PropTypes.func,
    appState: React.PropTypes.object,
  }

  onJoinGame = async (evt) => {
    evt.preventDefault()
    const name = this.refs.name.value
    const playerId = await actions.joinGame(name)
    this.props.onJoinGame(playerId)
  }

  renderPlayerList = () => {
    if (!_.isEmpty(this.props, 'appState.gameState.players')) {
      return (
        <div>
          <hr/>
          <h4>Players joined</h4>
          <ul>
            {_.map(this.props.appState.gameState.players, (playerObj) => {
              return <li>{playerObj.name}</li>
            })}
          </ul>
        </div>
      )
    }
  }

  renderJoinForm = () => {
    if (!this.props.appState.player) {
      return (
        <form onSubmit={this.onJoinGame}>
          <hr/>
          <label>
            Enter your name (make sure others will recognize it's you): &nbsp;
            <input type="text" placeholder="Name" ref="name" />
          </label>
          <Button type="submit">Join game</Button>
        </form>
      )
    }
  }

  renderReadyButton () {
    if (this.props.appState.player) {
      return (
        <div>
          <hr/>
          <Button onClick={actions.startGame}>Everybody is ready</Button>
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
