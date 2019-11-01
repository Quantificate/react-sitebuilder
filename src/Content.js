import React, {Component} from 'react';
import {Form} from 'react-bootstrap';

class Content extends Component{
  constructor(props,context){
    super(props,context)

    this.handleContent = this.handleContent.bind(this);

  }

  handleContent(e){
    const value = e.target.value;
    let name = e.target.name;
    name = name.toLowerCase().replace(/\s/g, "");
    this.props.callback(name, e.target.value);
  }

  render(){
    let i = 0;
    let rows = [];
    for (i in this.props.customerTerms){
      if(this.props.customerTerms[i] !== this.props.customer.username && this.props.customerTerms[i] !== this.props.customer.fullname && this.props.customerTerms[i] !== this.props.customer.package && this.props.customerTerms[i] !== null){
        rows.push(
          <>
          <Form.Label>Content for: {this.props.customerTerms[i]}</Form.Label>
          <Form.Control as="textarea" name={this.props.customerTerms[i]} rows="10" onChange={this.handleContent} />
          </>
        )
      }
    }
    return(
      <>{rows}</>
    )
  }
}
export default Content;
