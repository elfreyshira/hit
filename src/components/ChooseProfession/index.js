import React, { Component } from 'react'
import _ from 'lodash'

import actions from '../../actions'
import { PROFESSIONS } from '../../util/professions'

import Button from '../Button'
import WaitingBlock from '../WaitingBlock'
// import IntroHeader from '../IntroHeader'

const TEAM_NAMES = {
  BAD: 'Evil Hitmen -- eliminate the rebel forces',
  GOOD: 'Good Rebel Forces -- defend against the secret hitmen among you'
}

class ChooseProfession extends Component {

  static propTypes = {
    // onJoinGame: React.PropTypes.func,
    // appState: React.PropTypes.object
  }

  // state = {
  //   shouldHideButton: false
  // }

  onChooseProfession = (professionId) => {
    actions.chooseProfession({
      player: this.props.appState.player,
      profession: professionId
    })
  }

  render () {
    const playerId = this.props.appState.player

    if (this.props.appState.gameState.players[playerId].professionChoices) {
      const professionId1 = this.props.appState.gameState.players[playerId].professionChoices[0]
      const professionObj1 = PROFESSIONS[professionId1]

      const professionId2 = this.props.appState.gameState.players[playerId].professionChoices[1]
      const professionObj2 = PROFESSIONS[professionId2]
      return (
        <div>
          <h3>Team: {TEAM_NAMES[this.props.appState.gameState.players[playerId].team]}</h3>
          <h2>Choose a Profession</h2>
          <hr/>

          <h4>Option 1:</h4>
          <p>Name: {professionObj1.name}</p>
          <p>Description: {professionObj1.description}</p>
          <p>Starting health: {professionObj1.startingHealth}</p>
          <hr/>

          <h4>Option 2:</h4>
          <p>Name: {professionObj2.name}</p>
          <p>Description: {professionObj2.description}</p>
          <p>Starting health: {professionObj2.startingHealth}</p>
          <hr/>

          <Button onClick={() => this.onChooseProfession(professionId1)}>{professionObj1.name}</Button>
          <Button onClick={() => this.onChooseProfession(professionId2)}>{professionObj2.name}</Button>
        </div>
      )
    }
    else { // if this.props.appState.gameState.players[playerId].profession exists
      return <WaitingBlock appState={this.props.appState} />
    }
  }
}

export default ChooseProfession
