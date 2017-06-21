import firebase from 'firebase'
import _ from 'lodash'

import getRoomID from '../util/getRoomID'

export default function fb (/* args */) {
  return firebase.database().ref('rooms/' + getRoomID() + '/' + _.toArray(arguments).join('/'))
}