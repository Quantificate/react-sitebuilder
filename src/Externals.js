import React, {Component} from 'react';
import {Form} from 'react-bootstrap';

class Externals extends Component{
  constructor(props,context){
    super(props,context)

    this.handleLinks = this.handleLinks.bind(this);

  }

  handleLinks(e){
    this.props.callback(e.target.name, e.target.value);
  }

  render(){
    return(
      <>
      <Form.Label>External Link 1:</Form.Label>
      <Form.Control name="link1" onChange={this.handleLinks} />
      <Form.Label>External Link 2:</Form.Label>
      <Form.Control name="link2" onChange={this.handleLinks} />
      <Form.Label>External Link 3:</Form.Label>
      <Form.Control name="link3" onChange={this.handleLinks} />
      <Form.Label>External Link 4:</Form.Label>
      <Form.Control name="link4" onChange={this.handleLinks} />
      </>
    )
    }
  }
export default Externals;
