import React, { Component } from 'react';

export default function Cur (props = {bg: 'dark'}) {
  let color = '#ddd'
  if (props.bg === 'light') {
    color = '#555'
  }
  return <span style={{color, marginRight: '1px'}}>{'\u20B4'}</span>
}