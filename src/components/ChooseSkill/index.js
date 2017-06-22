import React, { Component } from 'react';
import _ from 'lodash'

import actions from '../../actions'
import { PROFESSIONS, SKILLS } from '../../util/professions'

import Button from '../Button'
import PlayerInfo from '../PlayerInfo'
import WaitingBlock from '../WaitingBlock'

class ChooseSkill extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  state = {
    chosenSkillId: null
  }

  onChooseSkill = (skillId) => {
    this.setState({chosenSkillId: skillId})
  }

  onChooseTarget = async (targetId) => {
    // const {player, target, skill} = payload
    await actions.queueSkill({
      player: this.props.appState.player,
      target: targetId,
      skill: this.state.chosenSkillId
    })
  }

  hasChosenSkillAndTarget = () => {
    const currentTurn = this.props.appState.gameState.turns.currentTurn

    const playerAlreadyDone = _.chain(this.props.appState.gameState.turns['turn' + currentTurn])
      .values()
      .map('player')
      .includes(this.props.appState.player)
      .valueOf()

    return playerAlreadyDone
  }

  renderSkillList = () => {
    if (!this.state.chosenSkillId && !this.hasChosenSkillAndTarget()) {
      const playerObj = this.props.appState.gameState.players[this.props.appState.player]
      const currentTurn = this.props.appState.gameState.turns.currentTurn

      return (
        <div>
          <h4>[Turn {currentTurn}] Choose a skill to perform:</h4>
          {_.map(PROFESSIONS[playerObj.profession].possibleSkills, (skillId) => {
            return (
              <Button
                wrapperStyle={{minWidth: '200px'}}
                key={skillId}
                onClick={_.partial(this.onChooseSkill, skillId)}
              >
                {SKILLS[skillId].name}
              </Button>
            )
          })}
        </div>
      )
    }
  }

  renderTargetList = () => {
    if (this.state.chosenSkillId && !this.hasChosenSkillAndTarget()) {
      const targetButtons = _.chain(this.props.appState.gameState.players)
        .map((targetObj, targetId) => {
          if (targetId === this.props.appState.player || targetObj.health <= 0) {
            // don't show target if it's self or if target is dead
            return null
          }
          else {
            return (
              <Button
                wrapperStyle={{minWidth:'200px'}}
                key={targetId}
                onClick={_.partial(this.onChooseTarget, targetId)}
              >
                {targetObj.name}
              </Button>
            )
          }
        })
        .shuffle() // mix up the targets
        .valueOf()

      const currentTurn = this.props.appState.gameState.turns.currentTurn
      return (
        <div>
          <h4>[Turn {currentTurn}] Select a target:</h4>
          {targetButtons}
        </div>
      )
    }
  }

  renderWaiting () {
    if (this.hasChosenSkillAndTarget()) {
      return (
        <WaitingBlock />
      )
    }
  }

  render () {
    return (
      <div>
        <PlayerInfo appState={this.props.appState} />
        <hr />
        {this.renderSkillList()}
        {this.renderTargetList()}
        {this.renderWaiting()}
      </div>
    );
  }
}

export default ChooseSkill;
