import React, { Component } from 'react';
import _ from 'lodash'

import actions from '../../actions'
import { PROFESSIONS, SKILLS } from '../../util/professions'

import Button from '../Button'
import PlayerInfo from '../PlayerInfo'
import WaitingBlock from '../WaitingBlock'

class HireDetective extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  state = {
    chosenDetective: null,
    shouldHideButton: false
  }

  onHireDetective = (detective) => this.setState({chosenDetective: detective})

  onInvestigateHealth = _.partial(this.onHireDetective, 'health')
  onInvestigateProfession = _.partial(this.onHireDetective, 'profession')
  onInvestigateIntent = _.partial(this.onHireDetective, 'intent')
  onInvestigateMoney = _.partial(this.onHireDetective, 'money')
  onInvestigateTeam = _.partial(this.onHireDetective, 'team')

  hasHiredDetectiveWithTarget () {
    return _.has(this.props.appState.gameState.detectives.hiredForTheTurn, this.props.appState.player)
  }

  renderDetectiveList = () => {
    if (!this.state.chosenDetective && !this.hasHiredDetectiveWithTarget()) {
      const detectiveCosts = this.props.appState.gameState.detectives.cost
      const currentTurn = this.props.appState.gameState.turns.currentTurn
      const playerMoney = this.props.appState.gameState.players[this.props.appState.player].money
      return (
        <div>
          <h4>[optional] Hire a detective to investigate another player's info.</h4>
          <Button
            onClick={this.onInvestigateHealth}
            size="small"
            disabled={detectiveCosts.health > playerMoney}
          >
            Current health: ${detectiveCosts.health}
          </Button>
          <Button
            onClick={this.onInvestigateProfession}
            size="small"
            disabled={detectiveCosts.profession > playerMoney}
          >
            Profession: ${detectiveCosts.profession}
          </Button>
          <Button
            onClick={this.onInvestigateMoney}
            size="small"
            disabled={detectiveCosts.money > playerMoney}
          >
            Money: ${detectiveCosts.money}
          </Button>
          <Button
            onClick={this.onInvestigateIntent}
            size="small"
            disabled={currentTurn <= 1 || detectiveCosts.intent > playerMoney}
          >
            Intent from previous turn: ${detectiveCosts.intent}
          </Button>
          <Button
            onClick={this.onInvestigateTeam}
            size="small"
            disabled={detectiveCosts.team > playerMoney}
          >
            Team: ${detectiveCosts.team}
          </Button>
        </div>
      )
    }
  }

  onHireDifferentDetective = () => this.setState({chosenDetective: null})

  onChooseTarget = async (targetId) => {
    this.setState({shouldHideButton: true})
    await actions.hireDetective({
      player: this.props.appState.player,
      target: targetId, // don't need to log target
      detective: this.state.chosenDetective,
      cost: this.props.appState.gameState.detectives.cost[this.state.chosenDetective]
    })
  }

  shuffleTargets = _.once(_.shuffle)
  renderTargetList = () => { // originally c/p from ChooseSkill
    if (this.state.chosenDetective && !this.hasHiredDetectiveWithTarget()) {
      const targetButtons = this.shuffleTargets( // mix up the targets to avoid bias
        _.map(this.props.appState.gameState.players, (targetObj, targetId) => {
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
                onClick={_.partial(this.onChooseTarget, targetId)}
                size="small"
              >
                {targetObj.name}
              </Button>
            )
          }
        })
      )

      return (
        <div>
          <h5>
            Detective hired: {this.state.chosenDetective}
            <br />
            <a href="javascript:void(0)" onClick={this.onHireDifferentDetective}>[hire different detective]</a>
          </h5>
          <h4>Select a player to investigate:</h4>
          {targetButtons}
        </div>
      )
    }

  }

  renderInvestigation = () => {
    if (this.hasHiredDetectiveWithTarget()) {
      const {detective, target} =
        this.props.appState.gameState.detectives.hiredForTheTurn[this.props.appState.player]

      const targetName = this.props.appState.gameState.players[target].name

      let investigationText
      if (detective === 'health') {
        const targetHealth = this.props.appState.gameState.players[target].health
        investigationText = targetName + ' currently has ' + targetHealth + ' health'
      }
      else if (detective === 'profession') {
        const targetProfessionId = this.props.appState.gameState.players[target].profession
        const professionName = PROFESSIONS[targetProfessionId].name
        const professionDescription = PROFESSIONS[targetProfessionId].description
        const professionMaxHealth = PROFESSIONS[targetProfessionId].startingHealth

        investigationText = (
          <div>
            {targetName}'s profession: {professionName}
            <br />
            Profession description: {professionDescription}
            <br />
            Max health: {professionMaxHealth}
          </div>
        )
      }
      else if (detective === 'intent') {
        const currentTurn = this.props.appState.gameState.turns.currentTurn

        const skillsLastTurn = _.chain(this.props.appState.gameState.turns['turn' + (currentTurn-1)])
          .values()
          .filter({player: target})
          .valueOf()

        const skillsPlayerDid = _.map(skillsLastTurn, (skillObj) => {
          const skillTargetPlayerObj = this.props.appState.gameState.players[skillObj.target]
          let skillTargetName = ''
          if (skillTargetPlayerObj) {
            skillTargetName = skillTargetPlayerObj.name
          }

          let skillIntention
          if (SKILLS[skillObj.skill].type === 'ATTACK') {
            skillIntention = 'attack'
          }
          else if (SKILLS[skillObj.skill].type === 'SUPPORT') {
            skillIntention = 'support'
          }
          else if (SKILLS[skillObj.skill].type === 'INNOCENT') {
            skillIntention = `defecate in the toilet but missed`
            // for multi-turn skills, there'll still be a target in the obj, but we want to ignore it
            skillTargetName = ''
          }
          return (
            <span>
              {skillIntention} {skillTargetName}
            </span>
          )
        })

        const baseText = <span>In turn {currentTurn-1}, {targetName} attempted to</span>
        if (skillsPlayerDid.length > 1) {
          investigationText = (
            <div>
              {baseText}:
              <ul>
                {_.map(skillsPlayerDid, (text, index) => <li key={text + index}>{text}</li>)}
              </ul>
            </div>
          )
        }
        else {
          investigationText = (
            <div>
              {baseText} {skillsPlayerDid}
            </div>
          )
        }

      }
      else if (detective === 'money') {
        const targetMoney = this.props.appState.gameState.players[target].money
        investigationText = <span>{targetName} currently has ${targetMoney}</span>
      }
      else if (detective === 'team') {
        const targetTeam = this.props.appState.gameState.players[target].team
        let teamText
        if (targetTeam === 'GOOD') {
          teamText = 'Good rebel forces'
        }
        else if (targetTeam === 'BAD') {
          teamText = 'Evil hitmen'
        }
        else if (targetTeam === 'HERETIC') {
          teamText = 'Heretic'
        }
        investigationText = <span>{targetName}'s team: {teamText}</span>
      }

      return (
        <div>
          <h4>Intelligence retrieved from investigation:</h4>
          {investigationText}
        </div>
      )
    }
  }

  render () {
    return (
      <div>
        <hr />
        {this.renderDetectiveList()}
        {this.renderTargetList()}
        {this.renderInvestigation()}
      </div>
    )
  }
}

export default HireDetective
