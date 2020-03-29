import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RetrieveCustomers from '../customer/RetrieveCustomers';

function Dashboard() {

  const useStyles = makeStyles(theme => ({root: {  '& > *': {margin: theme.spacing(1),},},}));
  const classes = useStyles();
  
  return (
      <div>
        <RetrieveCustomers />
      </div>
  );
}
export default Dashboard