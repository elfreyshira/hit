import React, { Component } from 'react';
import actions from '../../actions'

import Button from '../Button'
import IntroHeader from '../IntroHeader'

class Lobby extends Component {

  static propTypes = {
    onJoinGame: React.PropTypes.func,
    appState: React.PropTypes.object,
  }

  onJoinGame = (evt) => {
    const name = this.refs.name.value
    actions.joinGame(name).then(this.props.onJoinGame)
    return false
  }

  renderJoinForm = () => {
    console.log('this.props.appState.player')
    console.log(this.props.appState.player)
    console.log(!!this.props.appState.player)
    if (!this.props.appState.player) {
      return (
        <form onSubmit={this.onJoinGame}>
          <label>
            Enter your name (make sure others will recognize it's you): &nbsp;
            <input type="text" placeholder="Name" ref="name" />
          </label>
          <Button type="submit">Join game</Button>
        </form>
      )
    }
  }

  render () {
    return (
      <div>
        <IntroHeader/>
        {this.renderJoinForm()}
        <Button>Everybody is ready</Button>
      </div>
    );
  }
}

export default Lobby;
