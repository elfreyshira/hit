import React, { Component } from 'react';
import _ from 'lodash'

import actions from '../../actions'
import { PROFESSIONS, SKILLS } from '../../util/professions'

import Button from '../Button'
import PlayerInfo from '../PlayerInfo'
import WaitingBlock from '../WaitingBlock'

function Cur () {
  return <span style={{color: '#ddd', marginRight: '1px'}}>{'\u20B4'}</span>
}

class HireDetective extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  state = {
    chosenDetective: null,
    shouldHideButton: false
  }

  onHireDetective = (detective) => {
    this.setState({chosenDetective: detective})
  }

  onInvestigateHealth = _.partial(this.onHireDetective, 'health')
  onInvestigateProfession = _.partial(this.onHireDetective, 'profession')
  onInvestigateIntent = _.partial(this.onHireDetective, 'intent')

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
            Current health: <Cur/>{detectiveCosts.health}
          </Button>
          <Button
            onClick={this.onInvestigateProfession}
            size="small"
            disabled={detectiveCosts.profession > playerMoney}
          >
            Profession: <Cur/>{detectiveCosts.profession}
          </Button>
          <Button
            onClick={this.onInvestigateIntent}
            size="small"
            disabled={currentTurn <= 1 || detectiveCosts.intent > playerMoney}
          >
            Intent from previous turn: <Cur/>{detectiveCosts.intent}
          </Button>
        </div>
      )
    }
  }

  onHireDifferentDetective = (evt) => {
    evt.preventDefault()
    this.setState({chosenDetective: null})
  }

  onChooseTarget = async (targetId) => {
    this.setState({shouldHideButton: true})
    await actions.hireDetective({
      player: this.props.appState.player,
      target: targetId, // don't need to log target
      detective: this.state.chosenDetective,
      cost: this.props.appState.gameState.detectives.cost[this.state.chosenDetective]
    })
  }

  renderTargetList = () => { // originally c/p from ChooseSkill
    if (this.state.chosenDetective && !this.hasHiredDetectiveWithTarget()) {
      const targetButtons = _.chain(this.props.appState.gameState.players)
        .map((targetObj, targetId) => {
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
        .shuffle() // mix up the targets to avoid bias
        .valueOf()

      return (
        <div>
          <h5>
            Detective hired: {this.state.chosenDetective}
            <br />
            <a href="#" onClick={this.onHireDifferentDetective}>[hire different detective]</a>
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

        console.log('this.props.appState.gameState.turns[currentTurn-1]')
        console.log(this.props.appState.gameState.turns[currentTurn-1])
        const turnObj = _.find(
          this.props.appState.gameState.turns['turn' + (currentTurn-1)],
          {player: target}
        )

        const skillTargetName = this.props.appState.gameState.players[turnObj.target].name
        
        let skillIntention
        if (_.startsWith(turnObj.skill, 'HIT')) {
          skillIntention = 'hit'
        }
        else if (_.startsWith(turnObj.skill, 'SUPPORT')) {
          skillIntention = 'support'
        }

        investigationText = (
          <span>
            In turn {currentTurn-1}, {targetName} attempted to {skillIntention} {skillTargetName}
          </span>
        )
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
