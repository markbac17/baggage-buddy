import React, {useState, useEffect } from 'react';
import '../App.css';
import WTFiles from './WTFiles';

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

  const files = data.map((file) =>  <WTFiles file={file}/> )
  console.log(files)
  return (
    <div className="App">
      {files}
    </div>
  );
}

export default Vendor