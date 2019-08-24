import React, { Component } from 'react';

export class ConfirmButton extends Component {
  constructor(props) {
    super(props);
    this.smart = '0x61B81103e716B611Fff8aF5A5Dc8f37C628efb1E';
  }

  checkout = () => {
    const { web3, contract, ticket } = this.props;
    try {
      web3.eth.sendTransaction({
        from: ticket.buyer,
        to: this.smart,
        data: contract.methods.checkinMember(ticket.id).encodeABI()
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <button
        className="block-button-white"
        style={{ margin: '35px 0 0 45px' }}
        onClick={this.checkout}
      >
        CHECK IN
      </button>
    );
  }
}
