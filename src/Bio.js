import React, {Component} from 'react';
import {Form} from 'react-bootstrap';

class Bio extends Component{
  constructor(props,context){
    super(props,context)

    this.handleContent = this.handleContent.bind(this);

  }

  handleContent(e){
    this.props.callback(e.target.value);
  }

  render(){
    return(
      <>
      <Form.Label>Bio for: {this.props.customer.fullname}</Form.Label>
      <Form.Control as="textarea" name={this.props.customer.fullname} rows="10" onChange={this.handleContent} />
      </>
    )
  }
}
export default Bio;
