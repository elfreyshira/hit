import React, { Component } from 'react';
import _ from 'lodash'
import './index.css';

class Button extends Component {

  static propTypes = {
    // wrapperStyle
  }

  render() {
    return (
      <div>
        <div className="hit-button-wrapper" style={this.props.wrapperStyle}>
          <button className="hit-button" {..._.omit(this.props, 'wrapperStyle')}>{this.props.children}</button>
        </div>
      </div>
    );
  }
}

export default Button;
