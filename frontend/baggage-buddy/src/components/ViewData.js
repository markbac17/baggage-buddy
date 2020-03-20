import React, {useState, useEffect } from 'react';
import Output from './Output'

function ViewData() {
  const [data, setData] = useState([]);
  const [url, setUrl] = useState(`http://baggage-buddy.duckdns.org:9014/select_all_customers`);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetch(url);
        const data = await result.json();
        setData(data.file)
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [url])

  return (
    <div className="App">
      <h2>View File</h2>
      { isLoading ? <h3>Loading...</h3> : <Output data={data}/> }
    </div>
  );
}

export default ViewData;
