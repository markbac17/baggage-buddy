import React from 'react';

const WTFile = (props) => {
{console.log(props.file)}
  return (
    <div>
      <p>ID: {props.file.file_id}</p>
      <p>File Reference: {props.file.bt_ref}</p>
      <p>Color: {props.file.color}</p>
      <p>Type: {props.file.type}</p>
      <p>Local Delivery: {props.file.LD}</p>
      <p>Bagtag number: {props.file.bag_tag_number}</p>
      <p>Customer ID: {props.file.customer_id}</p>
      <p>Delivery status: {props.file.delivery_status}</p>    
    </div>
  )
}

export default WTFile;