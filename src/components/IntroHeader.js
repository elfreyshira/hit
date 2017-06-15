import React, { Component } from 'react';

class IntroHeader extends Component {

  static propTypes = {
  }

  render() {
    return (
      <div>
        <h1>Hit</h1>
        <h3>It's like Mafia, but better.</h3>
        <hr/>
        <h4> Rules </h4>
        <ul>
          <li>Goal of the game: be the team that wins by eliminating everybody else</li>
          <li>You'll be assigned a role, either citizen or hitman</li>
          <li>You'll be assigned a profession, with different actions and skills.</li>
          <li>Each turn, all players must make simultaneous moves.</li>
          <li>If you have 0 health at the end of a turn, you are eliminated.</li>
        </ul>
      </div>
    );
  }
}

export default IntroHeader;
