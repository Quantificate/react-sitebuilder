import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import './App.css';
import CustomerSelector from './CustomerSelector';
import StyleSelector from './StyleSelector';
import Content from './Content';
import ColorSelector from './ColorPicker';
import TypeSelector from './TypeSelector';
import Externals from './Externals';
import Bio from './Bio';

class App extends Component{
  constructor(props,context){
    super(props,context)

    this.getCustomerData = this.getCustomerData.bind(this);
    this.customerCallback = this.customerCallback.bind(this);
    this.styleCallback = this.styleCallback.bind(this);
    this.contentCallback = this.contentCallback.bind(this);
    this.returnData = this.returnData.bind(this);
    this.colorCallback = this.colorCallback.bind(this);
    this.typeCallback = this.typeCallback.bind(this);
    this.externalCallback = this.externalCallback.bind(this);
    this.bioCallback = this.bioCallback.bind(this);

    this.state = {
      customers: [],
      customerTerms: [],
      selectedCustomer: [],
      selectedTerms: [],
      style: '',
      color: '',
      type: '',
      bio: ''
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

  colorCallback(color){
    switch(color){
      case 'Blue':
        this.setState({color:'#4a668f'});
        break;
      case 'Green':
        this.setState({color:'#136910'});
        break;
      case 'Red':
        this.setState({color:'#6e0007'});
        break;
      case 'Purple':
        this.setState({color:'#26074f'});
        break;
      case 'Dark':
        this.setState({color:'#1f1e1e'});
        break;
      case 'Light':
        this.setState({color:'#eeeeee'});
        break;
      default:
        this.setState({color:'#eeeeee'});
    }
  }

  typeCallback(type){
    this.setState({type: type});
  }

  externalCallback(name, link){
    this.setState({[name]:link});
  }

  bioCallback(bio){
    this.setState({bio:bio});
  }

  returnData(){
    let y=0;
    let z = 0;
    let terms = [];
    let cleanTerms = [];
    let pkg = {};
    for (z in this.state.selectedTerms){
      if(this.state.selectedTerms[z] !== this.state.selectedCustomer.username && this.state.selectedTerms[z] !== this.state.selectedCustomer.fullname && this.state.selectedTerms[z] !== this.state.selectedCustomer.package && this.state.selectedTerms[z] !== null){
        let termKey = this.state.selectedTerms[z].toLowerCase().replace(/\s/g, "");
        pkg[termKey] = this.state[termKey];
        cleanTerms.push(termKey);
        terms.push(this.state.selectedTerms[z]);
      }
    }
    let custKeys = Object.keys(this.state.selectedCustomer);
    for (y in custKeys){
      pkg[custKeys[y]] = this.state.selectedCustomer[custKeys[y]];
    }
    let exLinks = [];
    exLinks.push(this.state.link1);
    exLinks.push(this.state.link2);
    exLinks.push(this.state.link3);
    exLinks.push(this.state.link4);
    pkg.terms = terms;
    pkg.cleanTerms = cleanTerms;
    pkg.style = this.state.style;
    pkg.color = this.state.color;
    pkg.siteType = this.state.type;
    pkg.externals = exLinks;
    pkg.bio = this.state.bio;
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
      <div className="container">
        <h2>Select a Customer, a Site Style, and Input the Keyterm Content Here, then hit "Submit &amp; Generate" to create the customer's Site</h2>
        <Button variant="primary" onClick={this.returnData}>Submit Content and Generate Pages</Button><br />
        <CustomerSelector customers={this.state.customers} callback={this.customerCallback}/>
        <p>Selected Customer: {this.state.selectedCustomer.fullname}</p>
        <TypeSelector callback={this.typeCallback} />
        <p>Selected Type: {this.state.type}</p>
        <StyleSelector callback={this.styleCallback} />
        <p>Selected Style: {this.state.style}</p>
        <ColorSelector callback={this.colorCallback} />
        <p>Selected Color: {this.state.color}</p>
        <Externals callback={this.externalCallback} />
        <ul>
          <li>Link 1: {this.state.link1}</li>
          <li>Link 2: {this.state.link2}</li>
          <li>Link 3: {this.state.link3}</li>
          <li>Link 4: {this.state.link4}</li>
        </ul>
        {this.state.selectedCustomer !== '' &&
          <>
          <Bio customer={this.state.selectedCustomer} callback={this.bioCallback} />
          <Content customer={this.state.selectedCustomer} customerTerms={this.state.selectedTerms} callback={this.contentCallback} />
          </>
        }
      </div>
      </>
    )
  }
}

export default App;
