import React from 'react';
import '../styles/App.css'
import Header from './Header';
import Block from './Block';
import Blockchain from './Blockchain';
import Distributed from './Distributed';
import Tokens from './Tokens'
import Coinbase from './Coinbase'
import FatBlockchain from './FatBlockchain';
import Keys from './Keys';
import Signatures from './Signatures'
import Transaction from './Transaction';
import SimpleHashFunction from './SimpleHashFunction'
import { BrowserRouter as Router, Route } from 'react-router-dom'




function App() {

  return (
    <Router>
      <Header />
      <Route exact path="/" component={SimpleHashFunction} />
      <Route path="/block" component={Block} />
      <Route path="/blockchain" component={Blockchain} />
      <Route path="/distributed" component={Distributed} />
      <Route path="/tokens" component={Tokens} />
      <Route path="/coinbase" component={Coinbase} />
      <Route path="/keys" component={Keys} />
      <Route path="/signatures" component={Signatures} />
      <Route path="/transaction" component={Transaction} />
      <Route path="/fatBlockchain" component={FatBlockchain} />
    </Router>
  )

}
export default App