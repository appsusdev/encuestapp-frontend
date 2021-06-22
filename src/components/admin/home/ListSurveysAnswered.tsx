import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import { Box, CircularProgress, Link } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ICitizen } from "../../../interfaces/Citizens";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";

export const ListSurveysAnswered = () => {
  const classes = useStyles();

  const { surveysAnswered, activeCitizen } = useSelector<
    AppState,
    AppState["citizens"]
  >((state) => state.citizens);
  const { loading } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const citizen: ICitizen = activeCitizen;
  return (
    <Box m={2}>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress className={classes.colorLoading} />
        </Box>
      ) : surveysAnswered.length > 0 && citizen ? (
        <>
          <Box mb={1}>
            <FormattedMessage id="TheCitizen" /> {citizen.primerNombre}{" "}
            {citizen.primerApellido}{" "}
            <FormattedMessage id="SurveysConductedMessage" />
          </Box>
          {surveysAnswered.map((survey, index) => (
            <Link
              className={classes.typography}
              component="button"
              key={survey.idSurvey}
            >
              {index + 1}. {survey.name}
            </Link>
          ))}
        </>
      ) : (
        citizen && (
          <Alert severity="info" color="info">
            <FormattedMessage id="TheCitizen" /> {citizen.primerNombre}{" "}
            {citizen.primerApellido}{" "}
            <FormattedMessage id="NotSurveysConductedMessage" />
          </Alert>
        )
      )}
    </Box>
  );
};
