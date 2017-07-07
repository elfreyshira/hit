import React, { Component } from 'react'
import getRoomID from '../util/getRoomID'

class IntroHeader extends Component {

  static propTypes = {
  }

  renderShareUrl () {
    if (getRoomID()) {
      return (
        <h4>
          Send the browser url to invite more friends:
          <span
            ref="text"
            style={{padding: '1px 5px', marginLeft: '3px', border: '1px solid rgba(0,0,0,.3)', userSelect: 'all'}}
          >
            {window.location.href}
          </span>
        </h4>
      )
    }
    else {
      return null
    }
  }

  render () {
    return (
      <div>
        <h1>Hit</h1>
        <h3>It's like Mafia. But instead of voting, hit.</h3>
        <hr/>
        <h4>Rules</h4>
        <ul>
          <li>Goal of the game: be the team that wins by eliminating everybody else.</li>
          <li>You'll be assigned to one of 3 teams: evil hitmen, good rebel forces, or heretic.</li>
          <li>You choose between 2 professions, with different actions and skills.</li>
          <li>Each turn, all players must make simultaneous moves.</li>
          <li>If you have 0 health at the end of a turn, you are eliminated.</li>
          <li>You can hire detectives to discover information about others.</li>
          <li>DO NOT EVER show anybody your device. It ruins the game.</li>
        </ul>
        {this.renderShareUrl()}
        <h6>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://goo.gl/forms/NQndeKMs9VmIHmUv1"
          >
            Got feedback?
          </a>
        </h6>
      </div>
    );
  }
}

export default IntroHeader
