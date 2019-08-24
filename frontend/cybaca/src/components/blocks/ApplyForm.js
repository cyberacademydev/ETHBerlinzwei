import React, { Component, Fragment } from 'react';
import {ADRESS} from '../../utils/static'

export class ApplyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: '',
        bio: '',
        topic: '',
        duration: 15,
        proof: ''
      },
        loading: false
    };
    // this.smart = '0x61B81103e716B611Fff8aF5A5Dc8f37C628efb1E';
    this.smart = ADRESS;
  }

  componentDidMount() {
      this.getMe()
  }

  onChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };

  apply = e => {
    e.preventDefault();
    this.getAccount();
  };


  getMe = async () => {
    const { web3, setWarning } = this.props;
    if (web3.currentProvider.host)
      return setWarning(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          this.setMe(accounts[0])
        }
      } catch (error) {
        clearInterval(this.interval);
        setWarning('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        this.setMe(accounts[0])
      }
    } else return setWarning('Your metamask is locked!');
  }

  setMe = (account) => {
    const { web3, contract, deposit } = this.props;
    try {
      contract.methods.getTalkBySpeaker(account).call()
          .then(function(result) {
            console.log("Zombie 15: " + JSON.stringify(result));
          })
          .catch(e => {
            console.log(e)
          });

    } catch (e) {
      console.log(e);
    }
  }

  getAccount = async () => {
    console.log('get account')
    const { web3, setWarning } = this.props;
    if (web3.currentProvider.host)
      return setWarning(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable();
        if (accounts.length) {
          this.applyForm(accounts[0]);
        }
      } catch (error) {
        clearInterval(this.interval);
        setWarning('You declined transaction', error);
      }
    } else if (window.web3) {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        this.applyForm(accounts[0]);
      }
    } else return setWarning('Your metamask is locked!');
  };

  applyForm = account => {
    const { web3, contract, deposit } = this.props;
    let data = Object.assign({}, this.state.data);
    data.duration = data.duration * 60
    this.setState({loading: true})
    if (deposit) {
      const depositInWei = web3.utils.toWei(deposit, 'ether');
      try {
        web3.eth
          .sendTransaction({
            from: account,
            to: this.smart,
            value: depositInWei,
            data: contract.methods
              .applyForTalk(
                data.name,
                data.bio,
                data.topic,
                Number(data.duration),
                data.proof
              )
              .encodeABI()
          })
          .on('transactionHash', h => {
            console.log('transactionHash', h);
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            debugger
            console.log('confirmation', confirmationNumber, receipt);
              this.setState({loading: true, sent: true})
          })
          .on('error', err => {
            console.log('error', err);
          });
      } catch (e) {
        console.log(e);
          this.setState({loading: false})
      }
    }
  };

  render() {
    const { data } = this.state;
    return (
      <Fragment>
        <p className="title-func" style={{ marginTop: '28px' }}>
          <span className="italic">apply for talk</span> ():
        </p>
        <form onSubmit={this.apply}>
          <label
            htmlFor="name"
            className="title-code padding-left-45"
            style={{ marginTop: '28px' }}
          >
            name =&nbsp;
            <span className="left-input">“</span>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={this.onChange}
            />
            <span className="right-input">”</span>
          </label>
          <label
            htmlFor="bio"
            className="title-code padding-left-45"
            style={{ marginTop: '28px' }}
          >
            bio =&nbsp;
            <span className="left-input">“</span>
            <input
              type="text"
              name="bio"
              value={data.bio}
              onChange={this.onChange}
            />
            <span className="right-input">”</span>
          </label>
          <label
            htmlFor="topic"
            className="title-code padding-left-45"
            style={{ marginTop: '28px' }}
          >
            topic =&nbsp;
            <span className="left-input">“</span>
            <input
              type="text"
              name="topic"
              value={data.topic}
              onChange={this.onChange}
            />
            <span className="right-input">”</span>
          </label>




          <label
            htmlFor="duration"
            className="title-code padding-left-45"
            style={{ marginTop: '28px' }}
          >
            duration =&nbsp;
            <span className="left-input">“</span>
            {/*<input*/}
            {/*  type="text"*/}
            {/*  name="duration"*/}
            {/*  value={data.duration}*/}
            {/*  onChange={this.onChange}*/}
            {/*/>*/}
            <select className={'s-duration'} name="duration" id="duration" value={data.duration} onChange={this.onChange}>
              {[15, 20, 25, 30, 35, 40, 45,50, 55, 60].map((item, key) => {
                return <option key={key} value={item}>{item}</option>
              })}
            </select>

            <span className="right-input">”</span>
          </label>



          <label
            htmlFor="proof"
            className="title-code padding-left-45"
            style={{ marginTop: '28px' }}
          >
            proof =&nbsp;
            <span className="left-input">“</span>
            <input
              type="text"
              name="proof"
              value={data.proof}
              onChange={this.onChange}
            />
            <span className="right-input">”</span>
          </label>
          <div className="title-code padding-left-45">
            minimal speaker deposit =
            <span className="string">
              &nbsp;
              {this.props.deposit
                ? Number.parseFloat(this.props.deposit).toFixed(2)
                : this.props.dots}{' '}
              ETH
            </span>
          </div>
          <button
            className="block-button-white"
            style={{ margin: '35px 0 0 45px' }}
            disabled={!Object.keys(this.props.deposit).length || this.state.loading}
          >
              {this.state.sent? 'APPROVING...' : 'APPLY' }
          </button>
        </form>
      </Fragment>
    );
  }
}
