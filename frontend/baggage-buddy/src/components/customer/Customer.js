import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CustomerCard from "./CustomerCard";
import Map from "./Map"
import Grid from '@material-ui/core/Grid';
function Customer() {
  const [customer, setCustomer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [inputWTFile, setInputWTFile] = useState("");
  const [searchWTFile, setSearchWTFile] = useState("JFKBA12345");
  const lookupWTFile = () => {
    const getData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(
          `http://baggage-buddy.duckdns.org:9014/select_delivery_data_2?data=${searchWTFile}`
        );
        const data = await response.json();
        setCustomer(data);
        console.log('test')
        console.log(customer);
      } catch (error) {
        setIsError(true);
        console.log(error);
      }
      setIsLoading(false);
    };
    getData();
  };
  const useStyles = makeStyles((theme) => ({
    root: { "& > *": { margin: theme.spacing(1) } },
    media: {height: 300, paddingTop: '56.25%',}
  }));

  useEffect(() => lookupWTFile(), [searchWTFile]);
  const classes = useStyles();

  return (
    <div>
      <Grid container   direction="column" justify="left" alignItems="left">
      <form color="primary" noValidate autoComplete="off">
        <Grid item>
        <TextField
          id="bag_tag"
          size="small"
          label="Enter bag tag"
          variant="outlined"
          onChange={(e) => setInputWTFile(e.target.value)}
        /></Grid>
        <Grid item>
        <Button variant="createButton" color="primary" variant="outlined" onClick={(e) => setSearchWTFile(inputWTFile)} >
          Retrieve</Button></Grid>
        <Grid item>{isLoading ? (<p>Loading...</p>) : (!isError && <CustomerCard customer={customer} />)}</Grid>
      </form>
      </Grid>
      </div>
  );
}

export default Customer;