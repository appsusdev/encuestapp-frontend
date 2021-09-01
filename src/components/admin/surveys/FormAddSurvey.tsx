import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { useIntl, FormattedMessage } from "react-intl";
import * as yup from "yup";
import clsx from "clsx";

import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
import {
  uiCloseModalAdd,
  uiCloseErrorAlert,
  uiCloseSuccessAlert,
  uiCloseModalEdit,
} from "../../../redux/actions/uiActions";
import { AntSwitch } from "../../custom/CustomizedSwitch";
import { MyTextField } from "../../custom/MyTextField";
import { useStyles } from "../../../shared/styles/useStyles";
import { Survey } from "../../../interfaces/Survey";
import {
  startNewSurvey,
  startEditSurvey,
  activeSurvey,
  surveyCleanActive,
} from "../../../redux/actions/surveysActions";
import { MyAlert } from "../../custom/MyAlert";
import { AppState } from "../../../redux/reducers/rootReducer";

export const FormAddSurvey = () => {
  const intl = useIntl();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { errorAlert, successAlert } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const { activeSurvey: active } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const survey: Survey = active;
  let disable: boolean = false;

  const validationSchema = yup.object({
    code: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    creationDate: yup
      .date()
      .max(new Date(), `${intl.formatMessage({ id: "GreaterCurrentDate" })}`)
      .required(),
    state: yup.boolean(),
    name: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
  });

  let initialValues: Partial<Survey> = {
    idSurvey: "",
    code: "",
    creationDate: new Date().toLocaleDateString("en-CA"),
    state: false,
    name: "",
    authorizationFormats: null,
    surveyors: [],
    chapters: [],
  };

  if (active) {
    disable = true;
    initialValues = {
      idSurvey: survey.idSurvey,
      code: survey.code,
      creationDate: survey.creationDate,
      state: survey.state,
      name: survey.name,
      authorizationFormats: survey.authorizationFormats,
      surveyors: survey.surveyors,
      chapters: survey.chapters,
      idTown: survey.idTown,
      idEntity: survey.idEntity,
    };
  }

  const onClose = () => {
    dispatch(uiCloseModalAdd());
    dispatch(uiCloseModalEdit());
    dispatch(surveyCleanActive());
  };

  const closeAlert = () => {
    dispatch(uiCloseErrorAlert());
  };

  const closeSuccess = () => {
    dispatch(uiCloseSuccessAlert());
    dispatch(uiCloseModalAdd());
    dispatch(uiCloseModalEdit());
    dispatch(surveyCleanActive());
  };

  return (
    <Box m={1}>
      <Formik
        validateOnChange={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (data, { setSubmitting }) => {
          data.idSurvey = data.code;
          setSubmitting(true);
          if (active) {
            dispatch(activeSurvey({ ...survey, name: data.name }));
            await dispatch(startEditSurvey(data));
          } else {
            await dispatch(startNewSurvey(data));
          }
          setSubmitting(false);
        }}
      >
        {({ values, isSubmitting, handleChange }) => (
          <Form className={classes.input}>
            <Grid container spacing={2}>
              <Grid item xs={active ? 6 : 5}>
                <label className="form-text">
                  <FormattedMessage id="Code" />
                </label>
                <MyTextField
                  name="code"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                  disabled={disable}
                />
              </Grid>

              <Grid item xs={active ? 6 : 5}>
                <label className="form-text">
                  <FormattedMessage id="CreationDate" />
                </label>
                <MyTextField
                  name="creationDate"
                  variant="outlined"
                  type="date"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              {!active && (
                <Grid item xs={2}>
                  <label className="form-text">
                    <FormattedMessage id="State" />
                  </label>
                  <Box mt={2}>
                    <AntSwitch
                      checked={values.state}
                      name="state"
                      onChange={handleChange}
                    />
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <label className="form-text">
                  <FormattedMessage id="Name" />
                </label>
                <MyTextField
                  name="name"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>
            </Grid>

            <Box mt={2} display="flex" flexDirection="row-reverse">
              {!isSubmitting ? (
                <Button
                  className={clsx(classes.btn, classes.save)}
                  autoFocus
                  type="submit"
                  disabled={isSubmitting}
                >
                  <FormattedMessage id="Save" />
                </Button>
              ) : (
                <Button
                  className={clsx(classes.btn, classes.save)}
                  autoFocus
                  type="button"
                  disabled={true}
                >
                  <CircularProgress className={classes.btnLoading} />
                </Button>
              )}
              <Button
                className={clsx(classes.btn, classes.cancel)}
                onClick={onClose}
              >
                <FormattedMessage id="Cancel" />
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <MyAlert
        open={successAlert}
        typeAlert="success"
        message="SurveyCreated"
        time={2000}
        handleClose={closeSuccess}
      />
      <MyAlert
        open={errorAlert}
        typeAlert="error"
        message="MessageExistsSurvey"
        time={2000}
        handleClose={closeAlert}
      />
    </Box>
  );
};
