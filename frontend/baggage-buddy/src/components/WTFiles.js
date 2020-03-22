import React from 'react';

const WTFile = (props) => {

  return (
    <div>
      <p>ID: {props.data.id}</p>
      <p>File Reference: {props.data.file_ref}</p>
      <p>Color: {props.data.color}</p>
      <p>Type: {props.data.type}</p>
      <p>Local Delivery: {props.data.LD}</p>
      <p>Bagtag number: {props.data.bag_tag_number}</p>
      <p>Customer ID: {props.data.customer_id}</p>
      <p>Delivery status: {props.data.delivery_status}</p>
    </div>
  )
}

export default WTFile;
