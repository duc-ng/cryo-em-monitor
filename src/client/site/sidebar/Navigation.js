import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ScrollspyNav from "react-scrollspy-nav";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  link: {
    "&:hover": {
      color: theme.palette.warning.main,
    },
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const navigation = [
    {
      name: "Status",
      href: "/",
    },
    {
      name: "Images",
      href: "#section_1",
    },
    {
      name: "Data",
      href: "#section_2",
    },
    {
      name: "Plots",
      href: "#section_3",
    },
  ];

  return (
    <React.Fragment>
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
      <ScrollspyNav
        scrollTargetIds={navigation.map((item) => item.href)}
        offset={60}
        activeNavClass="is-active"
        scrollDuration="150"
        headerBackground="true"
      >
        <Box pl={2}>
          {navigation.map((item, i) => (
            <Typography variant="button" display="block" gutterBottom key={i}>
              <Link
                underline="none"
                color="textPrimary"
                href={item.href}
                className={classes.link}
              >
                {item.name}
              </Link>
            </Typography>
          ))}
        </Box>
      </ScrollspyNav>
    </React.Fragment>
  );
}
