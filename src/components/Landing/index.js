import React, { Component } from 'react';
import actions from '../../actions'

import Button from '../Button'
import IntroHeader from '../IntroHeader'

class Landing extends Component {

  static propTypes = {
  }

  render() {
    return (
      <div>
        <IntroHeader/>
        <Button onClick={actions.createNewGame}>Create New Game</Button>
      </div>
    );
  }
}

export default Landing;
