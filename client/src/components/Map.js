import React, {useState, useEffect, useContext} from "react";
import ReactMapGL, { NavigationControl, Marker, Popup} from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import { GET_PINS_QUERY} from '../graphql/queries';
import {DELETE_PIN_MUTATION} from '../graphql/mutations';

import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery';
import {useClient } from '../client';
import PinIcon from './PinIcon';
import Context from'../context';
import Blog from './Blog';



const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13

}


const Map = ({ classes }) => {

  const mobileSize = useMediaQuery('(max-width: 650px)')

  const client = useClient();
  const {state, dispatch} = useContext(Context);

  useEffect(() => {
    getPins()
  }, []);

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
      getUserPosition()
  }, []);
 const [popup, setPopup] = useState(null)

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude} = position.coords
        setViewport({...viewport, latitude, longitude})
        setUserPosition({latitude, longitude})
      })
    }
  }

  const getPins = async () => {
    const {getPins} = await client.request(GET_PINS_QUERY)
      console.log({ getPins })
      dispatch({ type: "GET_PINS", payload: getPins})
    }
  

  const handleMapClick = ({lngLat, leftButton}) => {
    if (!leftButton) return
    if(!state.draft) {
      dispatch({ type: "CREATE_DRAFT"})
    }
    const [longitude, latitude] = lngLat
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude}
    });
  } ;

  const highlightNewPin = pin => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
    return isNewPin ? "limegreen" : "#4db6ac";
  }

  const handleSelectedPin = pin => {
    setPopup(pin)
    dispatch({ type: "SET_PIN", payload: pin})
  }

  const isAuthUser = () => state.currentUser._id === popup.author._id
  
  const handleDeletePin = async pin => {
    const variables = {pinId: pin._id}
    const {deletePin} = await client.request(DELETE_PIN_MUTATION, variables);
    dispatch({ type: "DELETE_PIN", payload: deletePin});
    setPopup(null)
  }
  
  return (

  <div className={mobileSize ? classes.rootMobile : classes.root}>
    <ReactMapGL
        onClick={handleMapClick}
        mapboxApiAccessToken="pk.eyJ1IjoiYWxleGNsb3NlciIsImEiOiJjazlzcGd1bTAxNmxtM29uMWc4ejFmZGJ1In0.9SZz-1UX1LOSMtMngqGRjQ"
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        scrollZoom={!mobileSize}
        {...viewport}
        onViewportChange={newViewport => setViewport(newViewport)}
        >
          
          <div className={classes.navigationControl}>
            <NavigationControl 
              onViewportChange={newViewport => setViewport(newViewport)}
              />
          </div>

      {userPosition && (

        <Marker
          latitude={userPosition.latitude}
          longitude={userPosition.longitude}
          offsetLeft={-19}
          offsetTop={-37}
          >

          <PinIcon 
          size={40} 
          color="red" 
          />

        </Marker>

      ) }

        {state.draft && (
           <Marker  
        
              latitude={state.draft.latitude}
              longitude={state.draft.longitude}
              offsetLeft={-19}
              offsetTop={-37}
              >

                <PinIcon size={40} color="hotpink" />

            </Marker>       
      )}

    {state.pins.map(pin => (
        <Marker  
          key={pin._id}
          latitude={pin.latitude}
          longitude={pin.longitude}
          offsetLeft={-19}
          offsetTop={-37}
          >

          <PinIcon 
          onClick={() => handleSelectedPin(pin) }
          size={40} 
          color={highlightNewPin(pin)} />

        </Marker>     
      ))}

      {popup && (
        <Popup 
          anchor="top"
          latitude={popup.latitude}
          longitude={popup.longitude}
          closeOnClick={false}
          onClose={() => setPopup(null)}
          >
              <img 
                className={classes.popupImage}
                src={popup.image}
                alt={popup.title}
                />
                <div className={classes.popupTab}>
                    <Typography>
                      {popup.title}
                    </Typography>
                    
                    { isAuthUser() && (
                      <Button onClick={() => handleDeletePin(popup)}>
                        <DeleteIcon className={classes.deleteIcon} />
                      </Button>
                    )}
                   </div> 
          </Popup>
      )}
    </ReactMapGL>


    <Blog />
    
  </div>);
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
