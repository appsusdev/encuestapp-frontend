import { FormattedMessage } from "react-intl";
import { Box, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Fonts } from "../../../shared/constants/AppEnums";

const styles = makeStyles((theme: Theme) => ({
  title: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: Fonts.MEDIUM,
    color: theme.palette.grey[800],
    textAlign: "center",
    marginBottom: "15px",
  },
  typography: {
    fontFamily: "Poppins !important",
  },
}));

export const DeleteSurvey = () => {
  const classes = styles();

  return (
    <Box m={1} className={classes.typography}>
      <Typography className={classes.title}>
        <FormattedMessage id="MessageDeleteSurveyOne" />
      </Typography>

      <Typography variant="body2" className={classes.typography}>
        <FormattedMessage id="MessageDeleteSurveyTwo" />
      </Typography>
    </Box>
  );
};
