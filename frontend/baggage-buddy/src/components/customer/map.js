import React from 'react';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from "@material-ui/core/styles";

import { typography } from '@material-ui/core/styles';


// const useStyles = makeStyles({
//   card: { maxWidth: 345, },
//   media: { height: 140, }, });


  // const useStyles = makeStyles((theme) => ({
  //   root: {
  //     "& .MuiTextField-root": {
  //       margin: theme.spacing(1),
  //       width: "35ch",
  //       media: {height: 40,},
  //     },
  //   },
  // }));

class GoogleMapsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      loadingElement: <div style={{ height: `25%` }} />,
      containerElement: <div style={{ height: `40px` }} />,
      mapElement: <div style={{ height: `25%` }} />,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      panControl: false,
      rotateControl: false,
      fullscreenControl: false,
      zoomControlOptions: false,
      mapTypeControlOptions: 'ROADMAP',
      streetViewControlOptions:false,
      gestureHandling: 'greedy'
    }
    
    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }
  
  
  render() {
    const style = {
      position: 'absolute',
      width: '350px',
      height: '250px',
      // 'marginLeft': 'auto',
      // 'marginRight': 'auto'
    }
    const containerStyle = {
      position: 'relative',
      width: '350px',
      height: '250px',
      // 'marginLeft': 'auto',
      // 'marginRight': 'auto'
    }

    return (
     
 <Map
        item
        xs = { 12 }
        style = {style}
        containerStyle={containerStyle}
        google = { this.props.google }
        onClick = { this.onMapClick }
        zoom = { 15 }
        initialCenter = {{ lat: 40.7517, lng: -73.979 }}
      >
        <Marker
          onClick = { this.onMarkerClick }
          title = { 'Changing Colors Garage' }
          position = {{ lat: 40.7517, lng: -73.979 }}
          name = { 'Changing Colors Garage' }
        />
        <InfoWindow
          marker = { this.state.activeMarker }
          visible = { this.state.showingInfoWindow }
        >
          <Paper>
            <Typography
              variant = 'headline'
              component = 'h4'
            >
              Changing Colors Garage
            </Typography>
            <Typography
              component = 'p'
            >
              98G Albe Dr Newark, DE 19702 <br />
              302-293-8627
            </Typography>
          </Paper>
        </InfoWindow>
      </Map>
     
    );
  }
}
export default GoogleApiWrapper({
    apiKey: "AIzaSyCma6y1qP4IEi_FMBjBQFzgK8r-INiBJUc"
})(GoogleMapsContainer)

// AIzaSyC7989j4HSwfNmab2hE-lcJefj07i-t6jM