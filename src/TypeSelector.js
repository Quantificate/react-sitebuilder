import React, {Component} from 'react';
import {Form} from 'react-bootstrap';

class TypeSelector extends Component{
  constructor(props,context){
    super(props,context)

    this.handleType = this.handleType.bind(this);

  }

  handleType(e){
    this.props.callback(e.target.value);
  }

  render(){
    return(
      <>
      <Form.Label>Select a Type:</Form.Label>
      <Form.Control as="select" onChange={this.handleType}>
        <option>Pick one:</option>
        <option>Kangen</option>
        <option>Real Estate</option>
        <option>Cash Gifting</option>
        <option>MLM</option>
      </Form.Control>
      </>
    )
    }
  }
export default TypeSelector;
