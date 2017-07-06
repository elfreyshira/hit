import React, { Component } from 'react';
import _ from 'lodash'

import actions from '../../actions'
import { PROFESSIONS, SKILLS } from '../../util/professions'

import Button from '../Button'
import PlayerInfo from '../PlayerInfo'
import WaitingBlock from '../WaitingBlock'
import HireDetective from '../HireDetective'
import SendMessage from '../SendMessage'

class ChooseSkill extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  state = {
    chosenSkillId: null,
    shouldHideTargets: false
  }

  onChooseSkill = (skillId, skillName) => {
    if (_.startsWith(skillId, 'DO')) {
      // if the skill requires no target, skip the targeting phase
      this.queueSkill(skillId)
      return
    }
    this.setState({
      chosenSkillId: skillId,
      chosenSkillName: skillName
    })
  }

  onChooseTarget = (targetId) => {
    this.setState({shouldHideTargets: true})
    this.queueSkill(this.state.chosenSkillId, targetId)
  }

  queueSkill = (skillId, targetId) => {
    actions.queueSkill({
      player: this.props.appState.player,
      skill: skillId,
      target: targetId
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
                onClick={_.partial(this.onChooseSkill, skillId, SKILLS[skillId].name)}
              >
                {SKILLS[skillId].name}
              </Button>
            )
          })}
        </div>
      )
    }
  }

  onChooseDifferentSkill = (evt) => {
    evt.preventDefault()
    this.setState({chosenSkillId: null})
  }
  shuffleTargets = _.once(_.shuffle)
  renderTargetList = () => {
    if (!this.state.shouldHideTargets && this.state.chosenSkillId && !this.hasChosenSkillAndTarget()) {
      const targetButtons = this.shuffleTargets( // mix up the targets to avoid bias
        _.map(this.props.appState.gameState.players, (targetObj, targetId) => {
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
      )

      const currentTurn = this.props.appState.gameState.turns.currentTurn
      return (
        <div>
          <h5>
            Skill chosen: {this.state.chosenSkillName}
            <br />
            <a href="#" onClick={this.onChooseDifferentSkill}>[choose different skill]</a>
          </h5>
          <h4>[Turn {currentTurn}] Select a target:</h4>
          {targetButtons}
        </div>
      )
    }
  }

  renderWaiting () {
    if (this.hasChosenSkillAndTarget()) {
      return (
        <WaitingBlock appState={this.props.appState} />
      )
    }
  }

  renderHireDetective () {
    if (!this.hasChosenSkillAndTarget()) {
      return (
        <HireDetective appState={this.props.appState} />
      )
    }
  }

  renderSendMessage () {
    if (!this.hasChosenSkillAndTarget()) {
      return (
        <SendMessage appState={this.props.appState} />
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
        {this.renderHireDetective()}
        {this.renderSendMessage()}
        {this.renderWaiting()}
      </div>
    );
  }
}

export default ChooseSkill;
