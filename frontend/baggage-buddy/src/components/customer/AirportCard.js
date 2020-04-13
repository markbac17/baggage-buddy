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
  { value: "With Delivery Delivery team", label: "With Delivery team" },
  { value: "Out for delivery", label: "Out for delivery" },
  { value: "Delivered", label: "Delivered" },
];

function AirportCard(props) {
  const [route, setRoute] = useState(
    "http://baggage-buddy.duckdns.org:9014/insert_customers"
  );
  const [inputFname, setInputFname] = useState("");
  const [inputLname, setInputLname] = useState("");
  const [inputDeliveryStatus, setDeliveryStatus] = useState("");
  const [response, setResponse] = useState();
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const [status, setStatus] = React.useState("");
  const handleChange = (event) => {
    setStatus(event.target.value);
  };

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
      console.log(configs)
      const response = await fetch(route, configs);
      const flaskResponse = await response.json();
      setResponse(true);
    } catch (error) {
      // setResponse(false);
      // handleClickOpen();
      console.log(error);
    }
  };

  return (
    // <Card className={classes.root}>
   <div>
     {console.log(props.customer.bt_ref)}
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
              onChange={handleChange}
              variant="outlined"
            >
              {props.customer.bt_ref}
            </TextField>
            <br></br>
            <TextField
              size="small"
              id="baggage_color"
              InputProps={{ readOnly: true }}
              defaultValue={props.customer.color}
              label="Baggage Color"
              onChange={handleChange}
              variant="outlined"
            >
              {props.customer.color}
            </TextField>
            <br></br>
            <TextField
              size="small"
              id="baggage_type"
              InputProps={{ readOnly: true }}
              defaultValue={props.customer.type}
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
              defaultValue={props.customer.customer_id}
              label="Customer ID"
              onChange={handleChange}
              variant="outlined"
            >
              {props.customer.customer_id}
            </TextField>
            <br></br>
            <TextField
              size="small"
              id="ld"
              InputProps={{ readOnly: false }}
              defaultValue={props.customer.LD}
              label="Delivery instructions"
              onChange={e => setDeliveryStatus(e.target.value)}
              variant="outlined"
            >
              {props.customer.LD}
            </TextField>
            <br></br>
            <TextField
              size="small"
              id="status"
              value="Airport control"
              select
              label="Status"
              onChange={handleChange}
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
