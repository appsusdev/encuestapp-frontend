import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import logo from "../../../assets/images/logo-encuestapp.png";

const Logo = () => {
  const useStyles = makeStyles(() => ({
    logoRoot: {
      flexDirection: "row",
      cursor: "pointer",
      position: "fixed",
      right: 5,
    },
    logo: {
      height: 65,
      marginRight: 10,
      marginTop: 3,
    },
  }));
  const classes = useStyles();

  return (
    <Box className={classes.logoRoot}>
      <Hidden>
        <img className={classes.logo} src={logo} alt="crema-logo" />
      </Hidden>
    </Box>
  );
};

export default Logo;
