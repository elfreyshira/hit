import React, { Component } from 'react'
import _ from 'lodash'

import actions from '../../actions'

import Button from '../Button'

class SendMessage extends Component {

  static propTypes = {
    // appState: React.PropTypes.object
  }

  state = {
    messageText: null,
    alreadySentMessage: false,
    wantToSendMessage: false,
    shouldHideButton: false
  }

  onSendMessage = () => this.setState({wantToSendMessage: true})
  renderSendMessage = () => {
    if (this.state.wantToSendMessage || this.hasSentMessageOnServer()) {
      return null
    }

    const playerMoney = this.props.appState.gameState.players[this.props.appState.player].money
    return (
      <div>
        <h4>[optional] Send a private message to another player.</h4>
        <Button
          onClick={this.onSendMessage}
          size="small"
          disabled={20 > playerMoney}
        >
          Send message for $20
        </Button>
      </div>
    )
  }

  onChooseMessage = (messageText) => this.setState({messageText})
  onGoBack = () => this.setState({wantToSendMessage: false})
  renderChooseMessage = () => {
    if (!this.state.wantToSendMessage || this.state.messageText) {
      return null
    }

    const messageButtons = _.map(this.props.appState.gameState.players, (targetObj, targetId) => (
      <Button
        wrapperStyle={{minWidth:'200px'}}
        key={targetId}
        onClick={_.partial(this.onChooseMessage, targetObj.name)}
        size="small"
      >
        {targetObj.name}
      </Button>
    ))
    const otherMessages = _.map(['I know who you are.', 'Help me.'], (messageText) => {
      return (
        <Button
          wrapperStyle={{minWidth:'200px'}}
          key={messageText}
          onClick={_.partial(this.onChooseMessage, messageText)}
          size="small"
        >
          {messageText}
        </Button>
      )
    })

    return (
      <div>
        <h5>
          <a href="javascript:void(0)" onClick={this.onGoBack}>[back]</a>
        </h5>
        <h4>Choose message text:</h4>
        {otherMessages.concat(messageButtons)}
      </div>
    )
  }

  onChooseDifferentMessage = () => this.setState({messageText: null})
  onChooseMessageTarget = (targetId) => {
    this.setState({
      alreadySentMessage: true,
      shouldHideButton: true
    })
    actions.sendMessage({
      player: this.props.appState.player,
      target: targetId,
      message: this.state.messageText,
      turn: this.props.appState.gameState.turns.currentTurn
    })
  }

  renderMessageTargetList = () => {
    if (!this.state.messageText || this.state.alreadySentMessage ) {
      return null
    }
    const targetButtons =  _.map(this.props.appState.gameState.players, (targetObj, targetId) => {
      if (targetId === this.props.appState.player || targetObj.health <= 0) {
        // don't show target if it's self or if target is dead
        return null
      }
      else {
        return (
          <Button
            hidden={this.state.shouldHideButton}
            wrapperStyle={{minWidth:'200px'}}
            key={targetId}
            onClick={_.partial(this.onChooseMessageTarget, targetId)}
            size="small"
          >
            {targetObj.name}
          </Button>
        )
      }
    })

    return (
      <div>
        <h5>
          Message text chosen: {this.state.messageText}
          <br />
          <a href="javascript:void(0)" onClick={this.onChooseDifferentMessage}>[choose different message]</a>
        </h5>
        <h4>Choose target to send message to:</h4>
        {targetButtons}
      </div>
    )
  }

  hasSentMessageOnServer = () => {
    const currentTurn = this.props.appState.gameState.turns.currentTurn
    return !_.chain(this.props.appState.gameState.messages)
      .values()
      .filter({
        turn: currentTurn,
        player: this.props.appState.player
      })
      .isEmpty()
      .valueOf()
  }

  renderMessageConclusion = () => {
    if (this.hasSentMessageOnServer())
    return (
      <div>
        Message delivered.
      </div>
    )
  }

  render () {
    return (
      <div>
        <hr />
        {this.renderSendMessage()}
        {this.renderChooseMessage()}
        {this.renderMessageTargetList()}
        {this.renderMessageConclusion()}
      </div>
    )
  }
}

export default SendMessage
