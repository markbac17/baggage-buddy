import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AirportCard from "./AirportCard";

function Airport() {
  const [customer, setCustomer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRecord, setIsRecord] = useState(false);
  const [isError, setIsError] = useState(false);
  const [inputWTFile, setInputWTFile] = useState("JFKBA79472");
  const [searchWTFile, setSearchWTFile] = useState("JFKBA79472");
  const lookupWTFile = () => {
    const getData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(
          `http://baggage-buddy.duckdns.org:9014/select_delivery_data?data=${searchWTFile}`
        );
        const data = await response.json();
        setCustomer(data);
        console.log(data);
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
  }));
  useEffect(() => lookupWTFile(), [searchWTFile]);
  const classes = useStyles();

  return (
    <div>
      <form noValidate autoComplete="off">
        <TextField
          size="small"
          id="bag_tag"
          label="Enter bag tag"
          variant="outlined"
          onChange={(e) => setInputWTFile(e.target.value)}
        />
        <Button
          variant="createButton"
          color="primary"
          variant="outlined"
          onClick={(e) => setSearchWTFile(inputWTFile)}
        >
          Retrieve
        </Button>
       
        {isLoading ? (<p>Loading...</p>) : (<AirportCard customer={customer} />)}
        </form>
    </div>
  );
}

export default Airport;