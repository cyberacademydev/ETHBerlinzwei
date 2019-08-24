import React, { PureComponent } from 'react';
import waitForWeb3 from './waitForWeb3';
import { abi } from '../../utils/abi';
import { ADRESS } from '../../utils/static';

const injectWeb3 = InnerComponent =>
  class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        web3: null,
        contract: null,
        loading: true
      };
      this.getWeb3 = this.getWeb3.bind(this);
      // this.smart = '0x61B81103e716B611Fff8aF5A5Dc8f37C628efb1E';
      this.smart = ADRESS;
    }

    componentDidMount() {
        console.log('ADRESS', ADRESS)
      this.getWeb3().then(() => this.setState({ loading: false }));
    }

    async getWeb3() {
      try {
        const web3 = await waitForWeb3();
        const contract = await new web3.eth.Contract(abi, this.smart);
        this.setState({
          web3,
          contract
        });
      } catch (e) {
        this.setState({ loading: false });
      }
    }

    render() {
      const { web3, contract, loading } = this.state;

      if (loading) {
        return <p>...</p>;
      }

      return <InnerComponent web3={web3} contract={contract} {...this.props} />;
    }
  };

export default injectWeb3;
