import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import CustomerQRCode from "./CustomerQRCode";
import TextField from "@material-ui/core/TextField";
// import { DateTimePicker } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "35ch",
    },
  },
}));



// const useStyles = makeStyles({root: {maxWidth: 345,},});
const status1 = [
  { value: "Airport control", label: "Airport Control" },
  { value: "With Delivery Delivery team", label: "With Delivery team" },
  { value: "Out for delivery", label: "Out for delivery" },
  { value: "Delivered", label: "Delivered" },
];

function CustomerCard(props) {
  const [route, setRoute] = useState("http://baggage-buddy.duckdns.org:9014/insert_customers");
  const [inputFname, setInputFname] = useState("");
  const [inputLname, setInputLname] = useState("");
  const [inputDeliveryStatus, setDeliveryStatus] = useState("");
  const [customerID, setCustomerID] = useState(0);
  const [response, setResponse] = useState();
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const [status, setStatus] = React.useState("Airport Control");
  


  const handleChange = (event) => {setStatus(event.target.value);};


  const UpdateCustomer = async () => {
    const output = document.getElementById("flaskResponse");
    const configs = {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        f_name: inputFname,
        l_name: inputLname,
        delivery_conf_status: inputDeliveryStatus
      }),
    };
    try {
      const response = await fetch(route, configs);
      const flaskResponse = await response.json();
      
      setResponse(true);
      setCustomerID(flaskResponse);
      
      
      console.log("Flask resonse:" + flaskResponse);
      console.log("Customer ID:" + customerID);
    } catch (error) {
      // setResponse(false);
      // handleClickOpen();
      console.log(error);
    }
  };
  useEffect(() => {setCustomerID()}, [customerID]);
  
  
    return (
    <Card>
      <CardActionArea>
        {/* <CustomerQRCode data={props.customer.bt_number} /> */}
        <CardContent>
          <form className={classes.root} noValidate autoComplete="off">
            <br></br>
            <TextField
              size="small"
              id="fname"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.fname}
              label="First Name"
              onChange={e => setInputFname(e.target.value)}
              variant="outlined"
            >
              {props.customer.fname}
            </TextField>
            <TextField
              size="small"
              id="lname"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.lname}
              label="Last Name"
              onChange={e => setInputLname(e.target.value)}
              variant="outlined"
            >
              {props.customer.color}
            </TextField>
            <br></br>
            <TextField
              fullWidth
              size="small"
              id="delivery_address"
              InputProps={{ readOnly: false }}
              defaultValue="TBN"
              label="Delivery Address"
              onChange={e => setDeliveryStatus(e.target.value)}
              variant="outlined"
            >
              {props.customer.type}
            </TextField>
            <TextField
              size="small"
              id="ld"
              InputProps={{ readOnly: false }}
              defaultValue="Leave with front desk in lobby"
              label="Delivery instructions"
              onChange={handleChange}
              variant="outlined"
            >
              {props.customer.LD}
            </TextField>
            <br></br>
            <TextField
              size="small"
              id="baggage_color"
              InputProps={{ readOnly: true }}
              defaultValue="Black"
              label="Baggage Color"
              onChange={handleChange}
              variant="outlined"
            >
              {props.customer.color}
            </TextField>
            <TextField
              size="small"
              id="baggage_type"
              InputProps={{ readOnly: true }}
              defaultValue="Samsonite"
              label="Baggage Type"
              onChange={handleChange}
              variant="outlined"
            >
              {props.customer.type}
            </TextField>
            <br></br>
            <TextField
              size="small"
              id="customer_id"
              InputProps={{ readOnly: false }}
              value={customerID}
              label="Customer ID"
              onChange={handleChange}
              variant="outlined"
            >
              {props.customer.customer_id}
            </TextField>
            <br></br>
            {/* <TextField size="small" id="status" value={props.customer.delivery_status} select label="Status" onChange={handleChange} variant="outlined">
            {status1.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
          </TextField> */}
            {/* <DateTimePicker autoOk ampm={false} disableFuture value="04-17-2020" onChange={handleChange} label="Deliver until"/> */}
            <TextField
              size="small"
              id="delvery_date"
              InputProps={{ readOnly: false }}
              defaultValue="04-17-2020"
              label="Deliver Until"
              onChange={handleChange}
              variant="outlined"
            >
              {props.customer.customer_id}
            </TextField>
            <br></br>
            {/* <TextField size="small" id="status" value={props.customer.delivery_status} select label="Status" onChange={handleChange} variant="outlined">
            {status1.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
          </TextField> */}
          </form>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => UpdateCustomer()} >
          Update
        </Button>
        <Button size="small" color="primary">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
export default CustomerCard;
