import React, {useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MapIcon from "@material-ui/icons/Map";
import Typography from "@material-ui/core/Typography";
import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery';

import Context from '../context';
import Signout from '../components/Auth/Signout';


const Header = ({ classes }) => {

 const mobileSize = useMediaQuery('(max-width: 650px)')

  const {state} = useContext(Context)
  const {currentUser} = state
  return (

    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
        {currentUser && (
           <div className={classes.grow}>
             <img
              className={classes.picture}
              src={currentUser.picture}
              alt={currentUser.name}
            />
            {/* <Typography
                className={mobileSize ? classes.mobile : ""}
                variant="h6"
                color="inherit"
                noWrap>

              {currentUser.name}
            </Typography> */}
           </div>
         )}
         
          <div className={classes.grow}>
            <MapIcon className={classes.icon} />
            <Typography 
            className={mobileSize ? classes.mobile : ""}
            component="h1"
            variant="h4"
            color="inherit"
            noWrap
            >
              GeoPins
            </Typography >
          </div>
        

         <Signout className={classes.signout}/>
         
        </Toolbar>
      </AppBar>
    </div>
  )
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing.unit,
    color: "black",
    fontSize: 45
  },
  mobile: {
    display: "none"
  },
  picture: {
    height: "40px",
    borderRadius: "90%",
    marginRight: theme.spacing.unit * 2
  },
  signout : {
    fontsize : 30
  }
});

export default withStyles(styles)(Header);
