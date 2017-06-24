import React, { Component } from 'react';
import _ from 'lodash'
import './index.css';

class Button extends Component {

  static propTypes = {
    // wrapperStyle
    // hidden
    // disabled
    // size: small, medium, large
  }

  render() {
    if (this.props.hidden) {
      return null
    }
    const size = this.props.size || 'medium'
    return (
      <div>
        <div className="hit-button-wrapper" style={this.props.wrapperStyle}>
          <button
            className={'hit-button ' + size}
            disabled={!!this.props.disabled}
            {..._.omit(this.props, ['wrapperStyle', 'hidden', 'size'])}
          >
            {this.props.children}
          </button>
        </div>
      </div>
    );
  }
}

export default Button;
