import React, { useState } from "react";

function DeliveryList(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const UpdateDeliveies = () => {
    const getData = async () => {
      setIsLoading(true);
      setIsError(false);
      const configs = {
        method : "POST",
        mode : "cors",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({delivery_id : 40})}

        const response = await fetch('http://baggage-buddy.duckdns.org:9014/update_deliveries');
        
        const data = await response.json();
    };
    getData();
  };
UpdateDeliveies()

  return (
    <div>
        {console.log(props.data)}
      {props.data}
    </div>
  );
}

export default DeliveryList;