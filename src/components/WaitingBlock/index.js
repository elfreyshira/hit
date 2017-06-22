import React, { Component } from 'react';
import _ from 'lodash'

const waitingImages = [
  'http://68.media.tumblr.com/54af19212db5e2cce51d031cb32709fd/tumblr_o7l2sq0iSy1qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/fbf858ec0d1347c13bee275d9e48ac52/tumblr_o8l4vtmw9B1qze3hdo1_500.gif',
  'http://68.media.tumblr.com/a1971a640a7c31496b83b4368b7af2d3/tumblr_oa5kbyhVQh1qze3hdo1_500.gif',
  'http://68.media.tumblr.com/2b0ec5e7d4763b0cc6aaba6982be379c/tumblr_occujlvMQE1qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/2469a3bffe4c8c97f9a34768db55a1eb/tumblr_inline_odlvegbcIm1qzc0ri_500.gif',
  'http://68.media.tumblr.com/dba8930c075bf505728df757c37b4216/tumblr_oh8awjk7lA1qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/0781175ba91a46ed548e40b37c65368b/tumblr_oij4ithMKC1qze3hdo1_r3_500.gif',
  'http://68.media.tumblr.com/88b031b3a3404c77f2defd8aac92ec5c/tumblr_oirozpY81B1qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/09c6d90170076846bdb19de05e08a8ca/tumblr_ol3lldvM801qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/e85d3e398ccf035c0d5dd74a34d57eb9/tumblr_ngbasnF0bG1qze3hdo1_r3_500.gif',
  'http://68.media.tumblr.com/118003578b24e6f68c88a454f8f8702a/tumblr_nh35p9VBO31qze3hdo1_500.gif',
  'http://68.media.tumblr.com/197d88298e555b162eb38b9e2215db9c/tumblr_ni9qrsClUg1qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/4e0e28821627a1e566134edef9b0b20b/tumblr_nm6j1ghB7C1qze3hdo1_500.gif',
  'http://68.media.tumblr.com/2dbf142a4a69b350fa220a103f18f88a/tumblr_nmjpfvJD4i1qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/734ba6db5941cd39f175f61ccf33b980/tumblr_nmvrs6ubl71qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/4c1313fb62311980f738c18fe9d27dac/tumblr_noa6mdd3yb1qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/d977bfbc4fafa218fa06fd0f3db5abee/tumblr_nqantu68Dw1qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/0548a184b645a3a79d150208b9020eb9/tumblr_nr2569nqX01qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/127e386a1dea373305434bfa7d566cae/tumblr_n0pykny8HK1qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/4dc89cf1c41000f8a7b02cf5fda562b9/tumblr_n77oaqwhn61qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/bfb488cc19c0307b2ada509d5babbd51/tumblr_n7zukidWwU1qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/f16abcf098d80e0dd5e433bfb63d626d/tumblr_n85t6pXLTA1qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/74f3a108bc59636cc3e48cbd005216d8/tumblr_n9m262J4Lq1qze3hdo1_r2_500.gif',
  'http://68.media.tumblr.com/b9c9c7616822fbd79c7eb73ada4c452a/tumblr_n9s45zl9Jc1qze3hdo1_500.gif',
  'http://68.media.tumblr.com/063481f87ba3058c8bb235148df090b9/tumblr_nb8zykBVPC1qze3hdo1_r1_500.gif',
  'http://68.media.tumblr.com/24ae2b225023363178e5fab544a9605d/tumblr_ne79hs8lGB1qze3hdo1_r3_500.gif',
  'https://rachelvision.files.wordpress.com/2017/02/img_3316.gif',
  'https://s-media-cache-ak0.pinimg.com/originals/50/ff/c8/50ffc8da808e31a16eed77b741afe480.gif',
  'https://rachelvision.files.wordpress.com/2017/04/img_3650.gif',
  'https://68.media.tumblr.com/3a72957c0984aac3dc28d7033c3e0b99/tumblr_ok6ek6pCLC1uqrdeoo1_500.gif',
  'http://i.imgur.com/dyMLb6C.gif'
]


class WaitingBlock extends Component {
  static propTypes = {
    appState: React.PropTypes.object
  }

  render () {
    const {playersAlive, playersChosenSkill, playersReviewedTurn} = this.props.appState.gameState.meta.turn
    let numberWaitingFor
    if (this.props.appState.gameState.status === 'CHOOSE_SKILL') {
      numberWaitingFor = playersAlive - playersChosenSkill
    }
    else if (this.props.appState.gameState.status === 'REVIEW_TURN') {
      numberWaitingFor = playersAlive - playersReviewedTurn
    }

    let waitingText
    if (numberWaitingFor === 0) {
      waitingText = <h4>Waiting for the server...'</h4>
    }
    else {
      waitingText = <h4>Waiting for {numberWaitingFor} other player{numberWaitingFor === 1 ? '' : 's'}...</h4>
    }

    return (
      <div>
        {waitingText}
        <img
          style={{maxWidth: '100%', maxHeight: '95vh'}}
          src={_.sample(waitingImages)}
        />
      </div>
    )
  }
}

export default WaitingBlock
