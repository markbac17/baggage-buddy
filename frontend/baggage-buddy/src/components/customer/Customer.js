import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CustomerCard from './CustomerCard'

function Customer() {
  const [customer, setCustomer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [inputWTFile, setInputWTFile] = useState("");
  const [searchWTFile, setSearchWTFile] = useState([]);
  const lookupWTFile = () => {
    const getData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(`http://baggage-buddy.duckdns.org:9014/select_delivery_data?data=${searchWTFile}`);
        const data = await response.json();
        setCustomer(data)
      } catch (error) {
        setIsError(true);
        console.log(error)
      }
      setIsLoading(false);
    }
    getData();
  }
  const useStyles = makeStyles(theme => ({root: {  '& > *': {margin: theme.spacing(1),},},}));
  useEffect(() => lookupWTFile(), [searchWTFile])
  const classes = useStyles();
  
  return (
      <div> 
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="file_ref" label="File reference" variant="outlined" onChange={e => setInputWTFile(e.target.value)}/>
        <Button variant="createButton" color="primary" onClick={e => setSearchWTFile(inputWTFile)}>Retrieve</Button>
          {isLoading ? <p>Loading...</p> : (!isError && <CustomerCard customer={customer}/>)}
      </form>
      </div>
);
}

export default Customer;