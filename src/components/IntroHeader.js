import React, { Component } from 'react';

class IntroHeader extends Component {

  static propTypes = {
  }

  render() {
    return (
      <div>
        <h1>Hit</h1>
        <h3>It's like Mafia. But instead of voting, hit.</h3>
        <hr/>
        <h4> Rules </h4>
        <ul>
          <li>Goal of the game: be the team that wins by eliminating everybody else</li>
          <li>You'll be assigned a team, either evil hitmen or good rebel forces</li>
          <li>You choose between 2 professions, with different actions and skills.</li>
          <li>Each turn, all players must make simultaneous moves.</li>
          <li>If you have 0 health at the end of a turn, you are eliminated.</li>
          <li>You can hire detectives to discover information about others.</li>
          <li>DO NOT EVER show anybody your device. It ruins the game.</li>
        </ul>
      </div>
    );
  }
}

export default IntroHeader;
