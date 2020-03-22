import React, {useState, useEffect } from 'react';
import ViewList from './ViewList';
import ViewData from './ViewData'
import '../App.css';

function Vendor() {
  const [data, setData] = useState([]);
  const [url, setUrl] = useState(`http://baggage-buddy.duckdns.org:9014/select_all_delivery_items`);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetch(url);
        const data = await result.json();
        setData(data)
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [url])

  const output = data.map((file) => {return <p><button>{file[0]}</button>,{file[1]},{file[2]},{file[3]}{file[4]},{file[5]},{file[6]},{file[7]}</p>})
  console.log(output)
  return (
    <div className="App">
      <h2>View Files</h2>
      { isLoading ? <h3>Loading...</h3> : output}
    </div>
  );
}

export default Vendor;