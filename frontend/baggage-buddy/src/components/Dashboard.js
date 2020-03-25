import React, { useState, useEffect } from 'react';
import '../App.css';
import WTFile from './WTFile'

function Dashboard() {
  const [wtfile, setWtfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [inputWTFile, setInputWTFile] = useState("");
  const [searchWTFile, setSearchWTFile] = useState("JFKBA12345");
  const [files, setFiles] = useState([]);
  const lookupWTFile = () => {
    const getData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(`http://baggage-buddy.duckdns.org:9014/select_delivery?data=${searchWTFile}`);
        const data = await response.json();
        console.log(data)
        setWtfile(data)
      } catch (error) {
        setIsError(true);
        console.log(error)
      }
      setIsLoading(false);
    }
    getData();
  }

  useEffect(() => lookupWTFile(), [searchWTFile])
  
    return (
      <>
      <div className="container">
          <div className='b'>< input type="text" onChange={e => setInputWTFile(e.target.value)} placeholder="File Reference"/></div>
          <div className='c'><button onClick={e => setSearchWTFile(inputWTFile)}>Retrieve</button></div>
          {isLoading ? <p>Loading...</p> : (!isError && <WTFile data={wtfile}/>)}
      </div>
</>
);
}

export default Dashboard;