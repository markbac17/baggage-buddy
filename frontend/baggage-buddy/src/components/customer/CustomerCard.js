import React from 'react';

const CustomerCard = (props) => {
{console.log(props.customer)}
  return (
    <div>
{/* data_storage_datetime_start: "Thu, 26 Mar 2020 03:42:00 GMT"
data_storage_status: "PENDING"
delivery_id: 995
delivery_location_lat: 40.7228
delivery_location_long: -73.9988
delivery_location_name: "modest.hush.mash"
delivery_location_zip: 99999
delivery_qr_code: "TBN"
delivery_status: "AT DEPOT"
delivery_window_end_time: "Thu, 26 Mar 2020 18:42:00 GMT"
delivery_window_start_time: "Thu, 26 Mar 2020 08:42:00 GMT" */}

      <p>bag_tag_group: {props.customer.bag_tag_group}</p>
      <p>bag_tag_number: {props.customer.bag_tag_number}</p>
      <p>current_location: {props.customer.current_location}</p>
      <p>current_location_lat: {props.customer.current_location_lat}</p>
      <p>current_location_long: {props.customer.current_location_long}</p>
      <p>current_location_timestamp: {props.customer.current_location_timestamp}</p>
      <p>data_storage_datetime_end: {props.customer.data_storage_datetime_end}</p>
      <p>customer_id: {props.customer.customer_id}</p>    
    </div>
  )
}

export default CustomerCard;