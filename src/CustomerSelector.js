import React, {Component} from 'react';
import {Form} from 'react-bootstrap';

class CustomerSelector extends Component{
  constructor(props,context){
    super(props,context)

    this.handleCustomer = this.handleCustomer.bind(this);

  }

  handleCustomer(e){
    this.props.callback(e.target.value);
  }

  render(){
    let i = 0;
    let rows = [];
    for(i in this.props.customers){
      rows.push(
        <option>{this.props.customers[i].fullname}</option>
      )
    }
    return(
      <>
      <Form.Label>Select a Customer:</Form.Label>
      <Form.Control as="select" onChange={this.handleCustomer}>
        <option>Pick one:</option>
        {rows}
      </Form.Control>
      </>
    )
    }
  }
export default CustomerSelector;
