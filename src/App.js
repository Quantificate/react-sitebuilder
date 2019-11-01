import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import './App.css';
import CustomerSelector from './CustomerSelector';
import StyleSelector from './StyleSelector';
import Content from './Content';

class App extends Component{
  constructor(props,context){
    super(props,context)

    this.getCustomerData = this.getCustomerData.bind(this);
    this.customerCallback = this.customerCallback.bind(this);
    this.styleCallback = this.styleCallback.bind(this);
    this.contentCallback = this.contentCallback.bind(this);
    this.returnData = this.returnData.bind(this);

    this.state = {
      customers: [],
      customerTerms: [],
      selectedCustomer: [],
      selectedTerms: [],
      style: ''
    }
  }

  componentDidMount(){
    this.getCustomerData();
  }

  customerCallback(customer){
    let i=0;
    let j=0;
    for (i in this.state.customers){
      if(this.state.customers[i].fullname === customer){
        this.setState({selectedCustomer:this.state.customers[i]})
      }
    }
    fetch('/customerTerms')
      .then(res => res.json()
        .then(body => {
          if (res.ok)
            for (j in body){
              if(body[j].fullname === customer){
                if(body[j] !== null){
                  this.setState({selectedTerms: body[j]});
                }
              }
            }
        })
      )
    console.log(this.state);
  }

  styleCallback(style){
    this.setState({style:style});
  }

  contentCallback(name, content){
    this.setState({[name]: content});
  }

  getCustomerData(){
    fetch('/customers')
      .then(res => res.json()
        .then(body => {
          if (res.ok)
            this.setState({customers: body});
          // throw new Error(body.err)
        })
      )
  }

  returnData(){
    let y=0;
    let z = 0;
    let terms = [];
    let pkg = {};
    for (z in this.state.selectedTerms){
      if(this.state.selectedTerms[z] !== this.state.selectedCustomer.username && this.state.selectedTerms[z] !== this.state.selectedCustomer.fullname && this.state.selectedTerms[z] !== this.state.selectedCustomer.package && this.state.selectedTerms[z] !== null){
        let termKey = this.state.selectedTerms[z].toLowerCase().replace(/\s/g, "");
        pkg[termKey] = this.state[termKey];
        terms.push(this.state.selectedTerms[z]);
      }
    }
    let custKeys = Object.keys(this.state.selectedCustomer);
    for (y in custKeys){
      pkg[custKeys[y]] = this.state.selectedCustomer[custKeys[y]];
    }
    pkg.terms = terms;
    pkg.style = this.state.style;
    console.log(pkg);
    fetch('/builder', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(pkg)
    })
  }

  render(){
    return(
      <>
      <h2>Select a Customer, a Site Style, and Input the Keyterm Content Here, then hit "Submit &amp; Generate" to create the customer's Site</h2>
      <Button variant="primary" onClick={this.returnData}>Submit Content and Generate Pages</Button><br />
      <CustomerSelector customers={this.state.customers} callback={this.customerCallback}/>
      <p>Selected Customer: {this.state.selectedCustomer.fullname}</p>
      <StyleSelector callback={this.styleCallback} />
      <p>Selected Style: {this.state.style}</p>
      {this.state.selectedCustomer !== '' &&
        <Content customer={this.state.selectedCustomer} customerTerms={this.state.selectedTerms} callback={this.contentCallback} />
      }
      </>
    )
  }
}

export default App;
