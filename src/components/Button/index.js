import React, { Component } from 'react';
import './index.css';

class Button extends Component {

  static propTypes = {
  }

  render() {
    return (
      <div>
        <div className="hit-button-wrapper">
          <button className="hit-button" {...this.props}>{this.props.children}</button>
        </div>
      </div>
    );
  }
}

export default Button;
