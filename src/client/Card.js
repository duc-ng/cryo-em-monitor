import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import CheckIcon from '@material-ui/icons/Check';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Avatar from "@material-ui/core/Avatar";
import DataUsageIcon from '@material-ui/icons/DataUsage';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    height: "100%"
  },

  avatar: {
    //backgroundColor: blue[900],
    backgroundColor: props => props.color,
  },
});

function getIcon(variant){
  switch(variant){
    case 1: return <PhotoCameraIcon />;
    case 2: return <SystemUpdateAltIcon />
    case 3: return <DataUsageIcon />
    case 4: return <CheckIcon />
    case 5: return <ErrorOutlineIcon />
    default: return
  }
}

export default function MediaCard(props) {
  const classes = useStyles(props);
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Grid container justify="space-between">
            <Typography gutterBottom variant="h4" component="h2">
              {props.value}
            </Typography>
            <Avatar aria-label="recipe" className={classes.avatar}>
              {getIcon(props.icon)}
            </Avatar>
          </Grid>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
