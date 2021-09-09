import { FormattedMessage } from "react-intl";
import { Box, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
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
  textarea: {
    width: "100%",
  },
  typography: {
    fontFamily: "Poppins !important",
  },
}));

interface Props {
  existsAssigned: boolean;
}

export const DeleteSurveyor = (props: Props) => {
  const { existsAssigned } = props;
  const classes = styles();

  return (
    <Box m={1} className={classes.typography}>
      <Typography className={classes.title}>
        <FormattedMessage id="MessageDeleteSurveyorOne" />
        <ErrorOutlineIcon
          fontSize="small"
          style={{ color: "red", marginLeft: "5px", marginBottom: "-3px" }}
        />
      </Typography>

      <Typography variant="body2" className={classes.typography}>
        {existsAssigned ? (
          <FormattedMessage id="MessageDeleteSurveyorThree" />
        ) : (
          <FormattedMessage id="MessageDeleteSurveyorTwo" />
        )}
      </Typography>
    </Box>
  );
};
