import React, {Component} from 'react';
import {Form} from 'react-bootstrap';

class ColorSelector extends Component{
  constructor(props,context){
    super(props,context)

    this.handleStyle = this.handleStyle.bind(this);

  }

  handleStyle(e){
    this.props.callback(e.target.value);
  }

  render(){
    return(
      <>
      <Form.Label>Select a Color Scheme:</Form.Label>
      <Form.Control as="select" onChange={this.handleStyle}>
        <option>Pick one:</option>
        <option>Blue</option>
        <option>Green</option>
        <option>Red</option>
        <option>Purple</option>
        <option>Dark</option>
        <option>Light</option>
      </Form.Control>
      </>
    )
    }
  }
export default ColorSelector;
