import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import QRCode from './CustomerQRCode'
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function CustomerCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        {/* <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        /> */}
        <QRCode data={props.customer.bt_number}/>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">Bag tag num: {props.customer.bt_number}</Typography>
          <TextField id="bag_tag" label={props.customer.bt_ref} variant="outlined"/>
          <Typography variant="body2" color="textSecondary" component="p">Tracer ref: {props.customer.bt_ref}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">Luggage color: {props.customer.color}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">Luggage type: {props.customer.type}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">Instructions: {props.customer.LD}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">Status: {props.customer.delivery_status}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">File ID: {props.customer.file_id}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">Customer Code: {props.customer.customer_id}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Update
        </Button>
        <Button size="small" color="primary">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}