import React from 'react';
import{
  Nums,
  Dots,
} from './components';
import './App.css';
import './main.css';


function App() {
  return (
    <main className="block-body">
    {/* {!this.props.web3 && <div>Metamask is locked!</div>} */}
    <div className="block-container-site">
      <Nums amount={62} />
      <div className="block-right-container-site">
        <img
          src="https://ipfs.io/ipfs/QmPMK9NBnx7n2xyXcNtcanrVvUEZAfUfQa7f8Cq9yPi2L5"
          alt=""
          className="girl"
        />
        <p className="title-func">
          {/* <span className="italic">contract</span> cyberc0n(): */}
        </p>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://steemit.com/web3/@hipster/invitation-to-cyberc0n-first-distributed-search-conference-435e5d0bec06dest"
        >
          <img
            src="https://ipfs.io/ipfs/QmSQuSbrLrrUK4qUUsHPrk68WaBH6DFerkUhxf9zJZaSSS"
            alt="logo"
            className="logo-top padding-left-45"
          />
        </a>
        {/* <WhatWhereWhen
          what="Distributed search and Web3 conference"
          data={data}
          dots={<Dots />}
        /> */}
        <p className="title-func" style={{ marginTop: '28px' }}>
          <span className="italic">buy ticket</span> ():
        </p>
        {/* <Ticket capacity="146" tickets={tickets} dots={<Dots />} /> */}
        {/* <p className="warning">{warning}</p> */}
        {/* {!purchasedTickets && (
          <p style={{ color: '#90d371' }}>
            Checking purchase
            <Dots />
          </p>
        )} */}
        {/* {userHasTicket ? (
          <ConfirmButton
            web3={this.props.web3}
            contract={this.props.contract}
            ticket={this.state.ticket}
          />
        ) : (
          <BuyButton
            web3={this.props.web3}
            contract={this.props.contract}
            tickets={tickets}
            setWarning={this.getWarning}
          />
        )} */}
        {/* <ApplyForm
          web3={this.props.web3}
          contract={this.props.contract}
          deposit={deposit}
          dots={<Dots />}
        />
        <Shares shares={shares} dots={<Dots />} />
        <TalksAgenda talks={talks} dots={<Dots big />} /> */}
        {/* <WorkshopsAgenda agenda={""} /> */}
      </div>
    </div>
    <div className="link-cuber">
      <img
        src="https://ipfs.io/ipfs/QmPMtBXQ8NbKDMTrCV7gTJSgnpZcf7XBP2vR3X3ZCQ9dZe"
        alt="Cyber academy link"
        className="logo-cuber"
      />
    </div>

  </main>
  );
}

export default App;
