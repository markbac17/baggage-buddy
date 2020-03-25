import React from 'react';

const WTFiles = (props) => {

  return (
    <div className='wtfile-item'>
      <p><input type='checkbox'/>{props.file[0]},{props.file[1]},{props.file[2]},{props.file[3]}{props.file[4]},{props.file[5]},{props.file[6]}</p>
      {/* <p>ID: {props.data.id}</p>
      <p>File Reference: {props.data.file_ref}</p>
      <p>Color: {props.data.color}</p>
      <p>Type: {props.data.type}</p>
      <p>Local Delivery: {props.data.LD}</p>
      <p>Bagtag number: {props.data.bag_tag_number}</p>
      <p>Customer ID: {props.data.customer_id}</p>
      <p>Delivery status: {props.data.delivery_status}</p> */}
    </div>
  )
}

export default WTFiles;
