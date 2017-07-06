import React, { Component } from 'react'
import _ from 'lodash'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { PROFESSIONS, SKILLS } from '../../util/professions'

import Cur from '../Cur'
import './ReceivedMessages.css'

class ReceivedMessages extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  render () {
    const playerObj = this.props.appState.gameState.players[this.props.appState.player]

    const messageList = _.chain(this.props.appState.gameState.messages)
      .values()
      .map((messageObj, index) => {
        if (messageObj.target !== this.props.appState.player) {
          // only show the messages sent to the player
          return null
        }
        return (
          <li key={messageObj.player + messageObj.turn}>
            [Turn {messageObj.turn}] Message from {this.props.appState.gameState.players[messageObj.player].name}
            : {messageObj.message}
          </li>
        )
      })
      .compact()
      .valueOf()

    return (
      <div>
        {_.isEmpty(messageList) ? null : (
          <div>
            <hr />
            Messages:
          </div>
        )}
        <ul>
          <ReactCSSTransitionGroup
            transitionName="new-message-item"
            transitionEnterTimeout={0}
            transitionLeaveTimeout={0}
          >
            {messageList}
          </ReactCSSTransitionGroup>
        </ul>
      </div>
    )
  }
}

export default ReceivedMessages;
