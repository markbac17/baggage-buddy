import React, {Component} from 'react'
import {render} from 'react-dom'
import QrCode from 'react.qrcode.generator'

function CustomerQRCode (props) {
const url = 'http://baggage-buddy.duckdns.org:9012/' + props.data
console.log(url)
return (
<div>
  <QrCode value='http://baggage-buddy.duckdns.org:9012' size='200' />
</div>
)
}

export default CustomerQRCode;