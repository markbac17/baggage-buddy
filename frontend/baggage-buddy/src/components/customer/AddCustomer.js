import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: { "& > *": { margin: theme.spacing(1) } },
}));

function AddCustomers() {
  const [route, setRoute] = useState(
    "http://baggage-buddy.duckdns.org:9014/insert_customers"
  );
  const [f_name, setF_name] = useState("");
  const [l_name, setL_name] = useState("");
  const [status, setStatus] = useState("");

  const Customer = async () => {
    const output = document.getElementById("createAccount");
    const configs = {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        f_name: f_name,
        l_name: l_name,
        delivery_conf_status: status,
      }),
    };
    try {
      console.log(configs, route);
      const response = await fetch(route, configs);
      const createAccount = await response.json();
      //   output.innerHTML = "<p>"+createAccount["response"]+"</p>";
    } catch (error) {
      console.log(error);
    }
  };
  const classes = useStyles();
  return (
    <div>
      <Customer />
    </div>
  );
}

export default AddCustomers;