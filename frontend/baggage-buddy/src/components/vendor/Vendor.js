import React, { useState, useEffect } from "react";
import DisplayDeliveries from "./DisplayDeliveries";

function Vendor() {
  const [data, setData] = useState([]);
  const [url, setUrl] = useState(
    `http://baggage-buddy.duckdns.org:9014/select_all_delivery_items`
  );
  const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetch(url);
        const data = await result.json();
        setData(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  return (
    <div className="App">
      <DisplayDeliveries file={data} />
    </div>
  );
}

export default Vendor;