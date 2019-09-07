import React, { Component, Fragment } from 'react';
import {ADRESS} from '../../utils/static'
import QrReader from "../qr-reader/qrReader";
import QRGenerator from "../qr-generator/qrGenerator";

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
        loading: false,
        sent: false,
        approved: false,
        checked: false
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
    this.setState({loading: true})
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
        this.setState({loading: false})
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
      let self = this
      contract.methods.getTalkBySpeaker(account).call()
          .then(function(result) {
            console.log("result ", result);
            let data =  {
              name: result[0],
              bio: result[1],
              topic: result[2],
              duration: result[3]/60,
              proof: result[9]
            }

            self.setState({data: data, sent: !!result[0], checked: result[7],  approved: Number(result[8]), loading: false})
            // self.setState({data: data, sent: !!result[0], checked: result[7],  approved: 1, loading: false})
          })
          .catch(e => {
            self.setState({loading: false})
            console.log(e)
          });

    } catch (e) {
      this.setState({loading: false})
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
      if(!this.state.approved) {
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
                this.getMe()
              })
              .on('error', err => {
                console.log('error', err);
                this.setState({loading: false})
              });
        } catch (e) {
          console.log(e);
          this.setState({loading: false})
        }
      } else {

        //check in
        try {
          web3.eth
              .sendTransaction({
                from: account,
                to: this.smart,
                value: depositInWei,
                data: contract.methods
                    .checkinSpeaker(
                        '1', account, account
                    )
                    .encodeABI()
              })
              .on('transactionHash', h => {
                console.log('transactionHash', h);
              })
              .on('confirmation', (confirmationNumber, receipt) => {
                this.getMe()
              })
              .on('error', err => {
                console.log('error', err);
                this.setState({loading: false})
              });
        } catch (e) {
          console.log(e);
          this.setState({loading: false})
        }
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
              readOnly={this.state.sent}
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
              readOnly={this.state.sent}
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
              readOnly={this.state.sent}
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
            <select className={'s-duration'} name="duration" id="duration" value={data.duration} disabled={this.state.sent} onChange={this.onChange}>
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


          {this.state.checked ?
          <React.Fragment>
            {/*<QrReader />*/}
            <QRGenerator />
          </React.Fragment>
          :
          <React.Fragment>
            {(this.state.sent && !this.state.approved )?
                <button
                    className="block-button-white"
                    style={{ margin: '35px 0 0 45px' }}
                    disabled={true}
                >
                  APPROVING...
                </button>
                :
                <React.Fragment>
                  <button
                      className="block-button-white"
                      style={{ margin: '35px 0 0 45px' }}
                      disabled={!Object.keys(this.props.deposit).length || this.state.loading}
                  >
                    {this.state.approved ? 'Check In' : 'APPLY'}
                  </button>
                </React.Fragment>
            }
          </React.Fragment>
          }




        </form>
      </Fragment>
    );
  }
}
