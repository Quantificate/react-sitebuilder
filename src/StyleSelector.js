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
        <option>RE Minimalist</option>
        <option>RE Fancy</option>
        <option>Kangen</option>
        <option>Cash Tracking</option>
        <option>Generic MLM</option>
        <option>Extra Generic</option>
      </Form.Control>
      </>
    )
    }
  }
export default StyleSelector;
