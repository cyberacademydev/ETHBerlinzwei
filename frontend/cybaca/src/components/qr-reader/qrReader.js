import React from 'react'
import Reader from 'react-qr-reader'

export default class QrReader extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        result: 'No result'
      }
     
    handleScan = data => {
        if (data) {
          this.setState({
            result: data
          })
        }
    }

    handleError = err => {
        console.error(err)
    }

    render () {
        return (
            <div style={{height:400, width:400}}>
            <Reader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '100%' }}
            />
            <p style={{color:'#FFF'}}>{this.state.result}</p>
        </div>
        )
    }
}