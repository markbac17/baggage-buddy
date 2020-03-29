import React, {useState, useEffect } from 'react';
import DisplayCustomers from './DisplayCustomers';

function RetrieveCustomers() {
  const [data, setData] = useState([]);
  const [url, setUrl] = useState(`http://baggage-buddy.duckdns.org:9014/select_all_customers`);
  const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {setIsLoading(true);
      try {
        const result = await fetch(url);
        const data = await result.json();
        setData(data)} 
      catch (error) {console.log(error);}
      setIsLoading(false);
    }

  fetchData();
  
}, [url])

  return (<div className="App"><DisplayCustomers file={data}/></div>);
}

export default RetrieveCustomers