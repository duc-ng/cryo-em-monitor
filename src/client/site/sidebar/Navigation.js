import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-scroll";

const useStyles = makeStyles((theme) => ({
  link: {
    "&:hover": {
      color: theme.palette.secondary.main,
      backgroundColor: "transparent",
      cursor: "pointer",
    },
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const navigation = [
    {
      name: "Status",
      id: "section_status",
    },
    {
      name: "Volume",
      id: "section_volume",
    },
    {
      name: "Data",
      id: "section_data",
    },
    {
      name: "Images",
      id: "section_images",
    },
    {
      name: "Plots",
      id: "section_plots",
    },
  ];

  return (
    <Hidden mdDown>
      <Box mt={4}>
        <Typography
          variant="body2"
          gutterBottom
          color="textSecondary"
          paragraph={true}
        >
          Navigation
        </Typography>
      </Box>
      <Box pl={2}>
        {navigation.map((item, i) => (
          <Link
            to={item.id}
            spy={true}
            smooth={true}
            duration={150}
            key={i}
            offset={-55}
          >
            <Typography
              variant="button"
              color="textPrimary"
              className={classes.link}
              display="block"
              gutterBottom
            >
              {item.name}
            </Typography>
          </Link>
        ))}
      </Box>
    </Hidden>
  );
}
