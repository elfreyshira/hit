import React, { Component } from 'react';
import _ from 'lodash'

import actions from '../../actions'
import {PROFESSIONS, SKILLS} from '../../util/professions'

import Button from '../Button'
import PlayerInfo from '../PlayerInfo'

const waitingImages = [
  'http://68.media.tumblr.com/0548a184b645a3a79d150208b9020eb9/tumblr_nr2569nqX01qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/2469a3bffe4c8c97f9a34768db55a1eb/tumblr_noy6woQBtr1qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/dba8930c075bf505728df757c37b4216/tumblr_oh8awjk7lA1qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/d977bfbc4fafa218fa06fd0f3db5abee/tumblr_nqantu68Dw1qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/74f3a108bc59636cc3e48cbd005216d8/tumblr_n9m262J4Lq1qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/b9c9c7616822fbd79c7eb73ada4c452a/tumblr_n9s45zl9Jc1qze3hdo1_500.gif',
  'http://68.media.tumblr.com/24ae2b225023363178e5fab544a9605d/tumblr_ne79hs8lGB1qze3hdo1_r3_500.gif',
  'http://68.media.tumblr.com/e85d3e398ccf035c0d5dd74a34d57eb9/tumblr_ngbasnF0bG1qze3hdo1_r3_500.gif',
  'http://68.media.tumblr.com/4e0e28821627a1e566134edef9b0b20b/tumblr_nm6j1ghB7C1qze3hdo1_500.gif',
  'http://68.media.tumblr.com/0781175ba91a46ed548e40b37c65368b/tumblr_oij4ithMKC1qze3hdo1_r3_500.gif'
]

class ChooseSkill extends Component {

  static propTypes = {
    appState: React.PropTypes.object
  }

  state = {
    chosenSkillId: null,
    isWaiting: false
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
    this.setState({isWaiting: true})
  }

  renderSkillList = () => {
    if (!this.state.chosenSkillId) {
      const playerObj = this.props.appState.gameState.players[this.props.appState.player]

      return (
        <div>
          <h4>Choose a skill to perform:</h4>
          {_.map(PROFESSIONS[playerObj.profession].possibleSkills, (skillId) => {
            return (
              <Button
                wrapperStyle={{width:'100%'}}
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
    if (this.state.chosenSkillId && !this.state.isWaiting) {
      return _.map(this.props.appState.gameState.players, (targetObj, targetId) => {
        if (targetId === this.props.appState.player) {
          return null
        }
        else {
          return (
            <Button
              wrapperStyle={{width:'100%'}}
              key={targetId}
              onClick={_.partial(this.onChooseTarget, targetId)}
            >
              {targetObj.name}
            </Button>
          )
        }
      })
    }
  }

  renderWaiting () {
    if (this.state.isWaiting) {
      return (
        <div>
          <h4>Waiting for other players...</h4>
          <img
            style={{maxWidth: '100%'}}
            src={_.sample(waitingImages)}
          />
        </div>
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
