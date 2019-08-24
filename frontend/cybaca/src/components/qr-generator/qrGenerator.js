import React from 'react'
import QRCode from 'qrcode.react'

const data="http://facebook.github.io/react/"
export default class QrGenerator extends React.Component {

    constructor(props) {
        super(props);
    }

    render () {
        return (
            <QRCode value={data} />
        )
    }
}