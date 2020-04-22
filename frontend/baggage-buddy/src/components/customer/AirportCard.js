import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import CustomerQRCode from "./CustomerQRCode";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

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
  { value: "With Delivery team", label: "With Delivery team" },
  { value: "Out for delivery", label: "Out for delivery" },
  { value: "Delivered", label: "Delivered" },
];


function AirportCard(props) {
  const [route1, setRoute1] = useState("http://baggage-buddy.duckdns.org:9014/insert_customers_2");
  const [inputColor, setInputColor] = useState(props.customer.color);
  const [inputType, setInputType] = useState(props.customer.type);
  const [inputLD, setInputLD] = useState(props.customer.LD);
  const [inputDeliveryStatus, setDeliveryStatus] = useState("Airport Control");
  const [response, setResponse] = useState();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [bt_ref, setBtRef] = useState("JFKBA12345")
  const [customer_id, setCustomerId] = useState(0);
  const classes = useStyles();

  const handleChangeDeliveryStatus = (event) => {setDeliveryStatus(event.target.value)};
  const handleChangeColor = (event) => {setInputColor(event.target.value)};
  const handleChangeType = (event) => {setInputType(event.target.value)};
  const handleChangeLD = (event) => {setInputLD(event.target.value)};
  
  const UpdateCustomer = async () => {
    const output = document.getElementById("flaskResponse");
    const configs = {method: "POST", mode: "cors", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        delivery_conf_status: inputDeliveryStatus,
        color: inputColor,
        type: inputType,
        customer_id: props.customer.customer_id,
        LD: inputLD,
        delivery_status: inputDeliveryStatus,
        f_name: 'TBD',
        l_name: 'TBD',
        delivery_email: 'TBD',
        delivery_address: 'TBD',
        delivery_phone_num: 'TBD',
        delivery_date: 'TBD',
        bt_ref: props.customer.bt_ref
      }),};
    try {
      console.log(configs)
      const response = await fetch(route1, configs);
      const flaskResponse = await response.json();
      setResponse(true);
      console.log(`Customer id:${flaskResponse}`);
      setCustomerId(flaskResponse);
      console.log("Customer ID:"+ customer_id);
      UpdateDeliveryItems();
    } catch (error) {}
  };

  const UpdateDeliveryItems = async () => {
    const output = document.getElementById("flaskResponse");
    const configs = {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        color: inputColor,
        type: inputType,
        customer_id: customer_id,
        LD: inputLD,
        delivery_status: inputDeliveryStatus,
        bt_ref: props.customer.bt_ref
      }),
    };
    try {
      console.log(configs)
      setResponse(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <Card className={classes.root}>
   <div>
     {console.log(props.customer.bt_ref)}
     {/* {setBtRef(props.customer.bt_ref)} */}
   {/* <CustomerQRCode data={props.customer.bt_ref} /> */}
    <Card> 
      <CardActionArea>
        <CardContent>
          {console.log(props.customer.bt_ref)}
          
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              size="small"
              id="wt_file"
              InputProps={{ readOnly: true }}
              defaultValue={props.customer.bt_ref}
              label="WT Reference"
              // onChange={handleChange}
              variant="outlined"
            >
              {props.customer.bt_ref}
            </TextField>
            <br></br>
            <TextField
              size="small"
              id="baggage_color"
              InputProps={{ readOnly: false}}
              defaultValue={props.customer.color}
              label="Baggage Color"
              onChange={handleChangeColor}
              variant="outlined"
            >
              {props.customer.color}
            </TextField>
            <br></br>
            <TextField
              size="small"
              id="baggage_type"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.type}
              label="Baggage Type"
              onChange={handleChangeType}
              variant="outlined"
            >
              {props.customer.type}
            </TextField>
            {/* <br></br>
            <TextField
              size="small"
              id="customer_id"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.customer_id}
              label="Customer ID"
              onChange={handleChange}
              variant="outlined"
            >
              {props.customer.customer_id}
            </TextField> */}
            <br></br>
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
            </TextField>
            <br></br>
            <TextField
              size="small"
              id="status"
              defaultValue={props.customer.delivery_status}
              select label="Status"
              onChange={handleChangeDeliveryStatus}
              variant="outlined"
            >
              {status1.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
    </div>
  );
}
export default AirportCard;
