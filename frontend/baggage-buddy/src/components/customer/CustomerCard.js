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
import Grid from '@material-ui/core/Grid';
// import { DateTimePicker } from "@material-ui/pickers";
import GoogleMapsContainer from "./map";
import Map from "./Map"

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
  const [route, setRoute] = useState("http://baggage-buddy.duckdns.org:9014/update_customers_2");
  const [inputFname, setInputFname] = useState("");
  const [inputLname, setInputLname] = useState("");
  const [inputDeliveryAddress, setDeliveryAddress] = useState("");
  const [inputEmail, setEmail] = useState("");
  const [inputPhone, setPhone] = useState("");
  const [inputLD, setInputLD] = useState("");
  const [inputDeliveryStatus, setDeliveryStatus] = useState("");
  const [inputDeliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState("Airport Control");
  const [customerID, setCustomerID] = useState(0);
  const [response, setResponse] = useState();
  const [open, setOpen] = useState(false);
  const newLocal = props.customer.delivery_email;
  console.log(newLocal)
  const classes = useStyles();
  
  const handleChangeFname = (event) => {setInputFname(event.target.value);};
  const handleChangeLname = (event) => {setInputLname(event.target.value)};
  const handleChangeAddress = (event) => {setDeliveryAddress(event.target.value)};
  const handleChangePhone = (event) => {setPhone(event.target.value)};
  const handleChangeEmail = (event) => {setEmail(event.target.value)};
  const handleChangeDate = (event) => {setDeliveryDate(event.target.value)};
  const handleChangeLD = (event) => {setInputLD(event.target.value)};

  const UpdateCustomer = async () => {
    const output = document.getElementById("flaskResponse");
    const configs = {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        f_name: inputFname,
        l_name: inputLname,
        delivery_address: inputDeliveryAddress,
        delivery_email: inputEmail,
        delivery_phone_num: inputPhone,
        delivery_date: inputDeliveryDate,
        delivery_status: inputDeliveryStatus,
        LD: inputLD,
        customer_id: props.customer.customer_id
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
      // console.log(error);
    }
  };
  // useEffect(() => {setCustomerID()}, [customerID]);
  // const containerStyle = {
  //   position: 'relative',  
  //   width: '25',
  //   height: '25'
  // }
    return (
      <div className={classes.root}>
      <Grid container   direction="column" justify="left" alignItems="center">
    {/* <Grid item><GoogleMapsContainer /></Grid> */}
        <Grid item><Card width ="350px" height= "250px">
       {console.log(props.customer)}
      <CardActionArea>
        <CardContent>
          <form className={classes.root} noValidate autoComplete="off">
            <Grid container>
            <Grid item>
            <TextField
              size="small"
              id="fname"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.fname}
              label="First Name"
              onChange={handleChangeFname}
              variant="outlined"
            >
              {props.customer.fname}
            </TextField></Grid>
            <Grid item>
            <TextField
              size="small"
              id="lname"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.lname}
              label="Last Name"
              onChange={handleChangeLname}
              variant="outlined"
            >
              {props.customer.lname}
            </TextField></Grid>
            {/* <TextField
              fullWidth
              size="small"
              id="delivery_address"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.delivery_address}
              label="Delivery Address"
              onChange={handleChangeAddress}
              variant="outlined"
            > */}
              <Map/>
              {/* {props.customer.delivery_address}
            </TextField> */}
            <Grid item>
            <TextField
              fullWidth
              size="small"
              id="delivery_phone"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.delivery_phone_num}
              label="Contact Phone Num"
              onChange={handleChangePhone}
              variant="outlined"
            >
              {props.customer.delivery_phone_num}
            </TextField></Grid>
            <Grid item>
            <TextField
              fullWidth
              size="small"
              id="email"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.delivery_email}
              label="Email address"
              onChange={handleChangeEmail}
              variant="outlined"
            >
              {props.customer.delivery_email}
            </TextField></Grid>
            <Grid item>
            <TextField
              size="small"
              id="ld"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.LD}
              label="Delivery instructions"
              onChange={handleChangeLD}
              variant="outlined"
            >
              {props.customer.LD}
            </TextField></Grid>
            <Grid item>
            <TextField
              size="small"
              id="baggage_color"
              InputProps={{ readOnly: true }}
              defaultValue={props.customer.color}
              label="Baggage Color"
              variant="outlined"
            >
              {props.customer.color}
            </TextField></Grid>
            <Grid item>
            <TextField
              size="small"
              id="baggage_type"
              InputProps={{ readOnly: true }}
              defaultValue={props.customer.type}
              label="Baggage Type"
              // onChange={handleChange}
              variant="outlined"
            >
              {props.customer.type}
            </TextField></Grid>
            <Grid item>
            <TextField
              size="small"
              id="delvery_date"
              InputProps={{ readOnly: false }}
              defaultValue="04-17-2020"
              label="Deliver Until"
              onChange={handleChangeDate}
              variant="outlined">
                {props.customer.DV}
            </TextField></Grid>
            <Grid item>
            <TextField
              size="small"
              id="customer_id"
              InputProps={{ readOnly: false }}
              value={props.customer.customer_id}
              label="Customer ID"
              // onChange={handleChange}
              variant="outlined">
              {props.customer.customer_id}
            </TextField></Grid></Grid>
            {/* <TextField size="small" id="status" value={props.customer.delivery_status} select label="Status" onChange={handleChange} variant="outlined">
            {status1.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
          </TextField> */}
            {/* <DateTimePicker autoOk ampm={false} disableFuture value="04-17-2020" onChange={handleChange} label="Deliver until"/> */}
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
    </Grid></Grid>
</div>
  );
}
export default CustomerCard;
