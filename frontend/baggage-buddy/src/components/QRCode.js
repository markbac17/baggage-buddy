import React from 'react';
function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [inputWTFile, setInputWTFile] = useState("");
  const [searchWTFile, setSearchWTFile] = useState("JFKBA12345");
  const [wtfile, setwtfile] = useState([]);
  const lookupWTFile = () => {
    const getData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(`http://baggage-buddy.duckdns.org:9014/qrcode?data=${searchWTFile}`);
        const data = await response.json();
        console.log(data)
        setwtfile(data)
      } catch (error) {
        setIsError(true);
        console.log(error)
      }
      setIsLoading(false);
    }
    getData();
  }

  useEffect(() => lookupWTFile(), [searchWTFile])
}

return (
  <div className="container">
      <div className='b'>< input type="text" onChange={e => setInputWTFile(e.target.value)} placeholder="File Reference"/></div>
      <div className='c'><button onClick={e => qrCode(inputWTFile)}>Retrieve</button></div>
      {isLoading ? <p>Loading...</p> : (!isError && <WTFile data={wtfile}/>)}
  </div>
  )
export default qrCode;