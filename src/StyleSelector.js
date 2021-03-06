import React, {Component} from 'react';
import {Form} from 'react-bootstrap';

class StyleSelector extends Component{
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
      <Form.Label>Select a Style:</Form.Label>
      <Form.Control as="select" onChange={this.handleStyle}>
        <option>Pick one:</option>
        <option>Sales</option>
        <option>Real Estate</option>
      </Form.Control>
      </>
    )
    }
  }
export default StyleSelector;
