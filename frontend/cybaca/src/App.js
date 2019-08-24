import React, {PureComponent} from 'react';
import withWeb3 from './components/web3/withWeb3';

import{
  Nums,
  WhatWhereWhen,
  Ticket,
  ApplyForm,
  Shares,
  TalksAgenda,
  BuyButton,
  ConfirmButton,
  Dots
} from './components';
import './App.css';
import './main.css';
import Graph from './components/graph/graph'
import QrReader from './components/qr-reader/qrReader'
import QRGenerator from './components/qr-generator/qrGenerator'

const getDateString = uint256 => {
  const date = new Date(uint256 * 1000);
  return `${date.toLocaleString('en-us', {
    month: 'long'
  })} ${date.getDate()}, ${date.getFullYear()}`;
};

const getInfoBlock = (methods, methodsArray) =>
  Promise.all(methods.map(methodName => methodsArray[methodName]().call()));

const run = async func => {
  try {
    await func();
  } catch (error) {
    setTimeout(run, 1000, func);
  }
};
class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shares: {},
      tickets: {
        price: '',
        amount: ''
      },
      data: {
        place: '',
        startTime: '',
      },
      deposit: '',
      warning: '',
      schedule: null,
      talks: {},
      purchasedTickets: null,
      userHasTicket: false,
      ticket: null
    };
  }

  async componentDidMount() {
    if (this.props.web3) {
      run(this.getInfo);
      run(this.getTicketsInfo);
      run(this.getShares);
      run(this.getDeposit);
      run(this.getSchedule);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.schedule !== this.state.schedule) {
      run(this.getTalks);
    }
    if (prevState.tickets !== this.state.tickets) {
      run(this.getTicketsArray);
    }
    if (prevState.purchasedTickets !== this.state.purchasedTickets) {
      this.checkUserTicket();
    }
  }

  getInfo = async () => {
    try {
      const {contract: { methods: methodsArray }} = this.props;
      const methods = ['getPlace', 'getEventStartTime'];
      const [place, rawStartTime] = await getInfoBlock(methods, methodsArray);
      const startTime = getDateString(rawStartTime);
      if (!place || !rawStartTime) {
        throw new TypeError('invalid value');
      }
      const data = {
        place,
        startTime
      };
      return this.setState({ data });
    } catch (error) {
      throw new Error();
    }
  };

  getTicketsInfo = async () => {
    try {
      const {contract: { methods: methodsArray }} = this.props;
      const methods = ['getCurrentPrice', 'getTicketsAmount'];
      const [rawPrice, amount] = await getInfoBlock(methods, methodsArray);
      const price = this.props.web3.utils.fromWei(rawPrice);
      if (!rawPrice || !amount) {
        throw new TypeError('invalid value');
      }
      const tickets = {
        price,
        amount
      };
      return this.setState({ tickets });
    } catch (error) {
      throw new Error();
    }
  };

  getTicketsIDArray = () => {
    const { tickets } = this.state;
    if (tickets.amount) {
      const N = 146 - tickets.amount;
      return Array.from(Array(N), (_, x) => x);
    }
  };

  getTicketsArray = async () => {
    const ids = this.getTicketsIDArray();
    const {contract: { methods }} = this.props;
    try {
      const tickets = await Promise.all(
        ids.map(ticketId => methods.getTicket(ticketId).call())
      );
      return this.setState({ purchasedTickets: tickets });
    } catch (e) {
      throw new Error();
    }
  };

  setTicket = account => {
    const { purchasedTickets } = this.state;
    const isPur = purchasedTickets.findIndex(
      ticket => ticket[1].toLowerCase() === account.toLowerCase()
    );
    // eslint-disable-next-line
    if (~isPur) {
      this.setState({
        userHasTicket: true,
        ticket: { id: isPur, buyer: account }
      });
    }
  };

  checkUserTicket = async () => {
    const { web3 } = this.props;
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          this.setTicket(accounts[0]);
        }
      } catch (error) {
        this.getWarning('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        this.setTicket(accounts[0]);
      }
    } else this.setState({ userHasTicket: false, ticket: null });
  };

  getShares = async () => {
    try {
      const {contract: {methods: methodsArray}} = this.props;
      const methods = [
        'getSpeakersShares',
        'getOrganizersShares',
        'getTicketsFunds'
      ];
      const [speakers, organizers, rawFunds] = getInfoBlock(
        methods,
        methodsArray
      );
      const funds = this.props.web3.utils.fromWei(rawFunds);

      debugger
      if (!speakers || !organizers || !rawFunds) {
        throw new TypeError('invalid value');
      }
      const shares = {
        speakers,
        organizers,
        funds
      };


      return this.setState({ shares });
    } catch (e) {
      throw new Error();
      console.log('error', e)
    }
  };

  getDeposit = async () => {
    try {
      const {contract: { methods }} = this.props;
      const weiDeposit = await methods.getMinimalSpeakerDeposit().call();
      const deposit = this.props.web3.utils.fromWei(weiDeposit);
      return this.setState({ deposit });
    } catch (e) {
      throw new Error();
    }
  };

  getSchedule = async () => {
    try {
      const {contract: { methods }} = this.props;
      const schedule = await methods.getTalksGrid().call();
      if (!schedule) {
        throw new TypeError('invalid value');
      }
      return this.setState({ schedule });
    } catch (e) {
      throw new Error();
    }
  };

  getTalks = async () => {
    const {contract: { methods }} = this.props;
    const { schedule } = this.state;
    const scheduleArray = schedule.split(',');
    try {
      const talksRaw = await Promise.all(
        scheduleArray.map(talkId => methods.getTalkById(talkId).call())
      );
      if (!talksRaw) throw new TypeError('invalid value');
      const talks = talksRaw.map(t => ({
        speakerNickname: t[0],
        speakerName: t[1],
        topic: t[2],
        duration: t[3]
      }));
      this.setState({ talks });
    } catch (e) {
      throw new Error();
    }
  };

  getWarning = warning => this.setState({ warning });

  render (){
    const {
      data,
      tickets,
      shares,
      warning,
      deposit,
      talks,
      userHasTicket,
      purchasedTickets
    } = this.state;
  return (
    <main className="block-body">
    {!this.props.web3 && <div>Metamask is locked!</div>}
    <div className="block-container-site">
      <Nums amount={62} />
      <div className="block-right-container-site">
        {/* <img
          src="https://ipfs.io/ipfs/QmPMK9NBnx7n2xyXcNtcanrVvUEZAfUfQa7f8Cq9yPi2L5"
          alt=""
          className="girl"
        /> */}
        <p className="title-func">
          <span className="italic">contract</span> cyberc0n():
        </p>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://steemit.com/web3/@hipster/invitation-to-cyberc0n-first-distributed-search-conference-435e5d0bec06dest"
        >
          {/* <img
            src="https://ipfs.io/ipfs/QmSQuSbrLrrUK4qUUsHPrk68WaBH6DFerkUhxf9zJZaSSS"
            alt="logo"
            className="logo-top padding-left-45"
          /> */}
        </a>
        <WhatWhereWhen
          what="Distributed search and Web3 conference"
          data={data}
          dots={<Dots />}
        />
        <p className="title-func" style={{ marginTop: '28px' }}>
          <span className="italic">buy ticket</span> ():
        </p>
        <Ticket capacity="146"
         tickets={tickets}
          dots={<Dots />} />
        <p className="warning">{warning}</p>
        {!purchasedTickets && (
          <div style={{ color: '#90d371' }}>
            Checking purchase
            <Dots />
          </div>
        )}

        <Graph />


        {userHasTicket ? (
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
        )}
        <ApplyForm
          web3={this.props.web3}
          contract={this.props.contract}
          deposit={deposit}
          dots={<Dots />}
        />
        <Shares shares={shares} dots={<Dots />} />
        <TalksAgenda talks={talks} dots={<Dots big />} />
        {/* <WorkshopsAgenda agenda={""} /> */}
      </div>
    </div>
    <div className="link-cuber">
      {/* <img
        src="https://ipfs.io/ipfs/QmPMtBXQ8NbKDMTrCV7gTJSgnpZcf7XBP2vR3X3ZCQ9dZe"
        alt="Cyber academy link"
        className="logo-cuber"
      /> */}
    </div>

  </main>
  );
}
}

export default withWeb3(App);
