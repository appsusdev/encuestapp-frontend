import clsx from "clsx";
import { Formik, Form } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import {
  TextField,
  Divider,
  Grid,
  Paper,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Link,
} from "@material-ui/core";

import { useStyles } from "../../../shared/styles/useStyles";
import { MyTextField } from "../../custom/MyTextField";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useEffect, useState } from "react";
import { Surveyor } from "../../../interfaces/Surveyor";
import { startLoadingMicrodata } from "../../../redux/actions/surveyorsActions";
import { startLoading, finishLoading } from "../../../redux/actions/uiActions";
import { Alert } from "@material-ui/lab";

export const Microdata = () => {
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();
  const { dataSurveys } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const { surveyors, surveysTransmitted } = useSelector<
    AppState,
    AppState["surveyor"]
  >((state) => state.surveyor);
  const { loading } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const surveys: any[] = dataSurveys;
  const listSurveyors: Partial<Surveyor>[] = surveyors;
  const [surveySelected, setSurveySelected] = useState("");
  const [surveyorSelected, setSurveyorSelected] = useState("");
  const [, setSurveyorsEmail] = useState<string[]>([]);
  const [surveyorsName, setSurveyorsName] = useState<any[]>([]);
  const [errorSurvey, setErrorSurvey] = useState(false);
  const [errorSurveyor, setErrorSurveyor] = useState(false);
  const [valid, setValid] = useState({ survey: false, surveyor: false });
  const transmitted: any[] = surveysTransmitted;
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
  }, []);

  const validationSchema = yup.object({
    survey: yup.string(),
    startDate: yup
      .date()
      .required()
      .max(
        yup.ref("endDate"),
        `${intl.formatMessage({ id: "GreaterStartDate" })}`
      ),
    endDate: yup
      .date()
      .min(
        yup.ref("startDate"),
        `${intl.formatMessage({ id: "LowerEndDate" })}`
      )
      .max(new Date(), `${intl.formatMessage({ id: "GreaterCurrentDate" })}`)
      .required(),
    surveyor: yup.string(),
  });

  let initialValues: any = {
    survey: "",
    startDate: new Date().toLocaleDateString("en-CA"),
    endDate: new Date().toLocaleDateString("en-CA"),
    surveyor: "",
  };

  const handleSelectSurvey = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value: string = event.target.value as string;
    setSurveySelected(value);
    value === "" ? setErrorSurvey(true) : setErrorSurvey(false);

    setValid({ ...valid, survey: true });
    const surveryFilter = surveys.filter((survey) => survey.code === value);
    setSurveyorsEmail(surveryFilter[0].surveyors);

    let names: any[] = [];
    listSurveyors.filter((surveyor) => {
      if (surveyor.id && surveryFilter[0].surveyors.includes(surveyor.id)) {
        surveyor.firstName &&
          surveyor.firstLastName &&
          names.push({
            name: `${surveyor.firstName} ${surveyor.firstLastName}`,
            email: surveyor.id,
          });
      }
      return names;
    });
    setSurveyorsName(names);
  };

  const handleSelectSurveyor = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value: string = event.target.value as string;
    value === "" ? setErrorSurveyor(true) : setErrorSurveyor(false);
    setSurveyorSelected(value);
    setValid({ ...valid, surveyor: true });
  };

  return (
    <>
      <Divider variant="fullWidth" />
      <Paper square className={classes.paper}>
        <Box m={2} mt={1} mb={3}>
          <Formik
            validateOnChange={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (data, { setSubmitting }) => {
              surveySelected === ""
                ? setErrorSurvey(true)
                : setErrorSurvey(false);
              surveyorSelected === ""
                ? setErrorSurveyor(true)
                : setErrorSurveyor(false);
              if (valid.survey && valid.surveyor) {
                setShow(true);
                dispatch(startLoading());
                data.survey = surveySelected;
                data.surveyor = surveyorSelected;
                setSubmitting(true);
                // await dispatch(startLoadingMicrodata(data));
                setSubmitting(false);
                dispatch(finishLoading());
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className={classes.input}>
                <Grid container spacing={2}>
                  <Grid item xs={12} style={{ marginTop: "10px" }}>
                    <label className="form-text">
                      <FormattedMessage id="SelectSurvey" />
                    </label>
                    <TextField
                      className={classes.myTextFieldRoot}
                      helperText={
                        errorSurvey &&
                        `*${intl.formatMessage({ id: "RequiredFile" })}`
                      }
                      InputLabelProps={{ shrink: false }}
                      name="survey"
                      onChange={handleSelectSurvey}
                      select
                      size="small"
                      value={surveySelected}
                      variant="outlined"
                      error={errorSurvey}
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                    >
                      {surveys.map((survey, index) => (
                        <MenuItem key={index} value={survey.code}>
                          {survey.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={3}>
                    <label className="form-text">
                      <FormattedMessage id="StartDate" />:
                    </label>
                    <MyTextField
                      name="startDate"
                      variant="outlined"
                      type="date"
                      className={classes.myTextFieldRoot}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <label className="form-text">
                      <FormattedMessage id="EndDate" />:
                    </label>
                    <MyTextField
                      name="endDate"
                      variant="outlined"
                      type="date"
                      className={classes.myTextFieldRoot}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <label className="form-text">
                      <FormattedMessage id="Surveyor" />:
                    </label>
                    <TextField
                      className={classes.myTextFieldRoot}
                      helperText={
                        errorSurveyor &&
                        `*${intl.formatMessage({ id: "RequiredFile" })}`
                      }
                      InputLabelProps={{ shrink: false }}
                      name="surveyor"
                      onChange={handleSelectSurveyor}
                      select
                      size="small"
                      value={surveyorSelected}
                      variant="outlined"
                      error={errorSurveyor}
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                    >
                      {valid.survey && <MenuItem value="Todos">Todos</MenuItem>}
                      {surveyorsName &&
                        surveyorsName.map((surveyor, index) => (
                          <MenuItem key={index} value={surveyor.email}>
                            {surveyor.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={2}>
                    {!isSubmitting ? (
                      <Button
                        className={clsx(classes.btnAction, classes.save)}
                        autoFocus
                        type="submit"
                        disabled={isSubmitting}
                        style={{ marginTop: "27px" }}
                      >
                        <FormattedMessage id="Search" />
                      </Button>
                    ) : (
                      <Button
                        className={clsx(classes.btnAction, classes.save)}
                        autoFocus
                        type="button"
                        disabled={true}
                        style={{ marginTop: "27px" }}
                      >
                        <CircularProgress className={classes.btnLoading} />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>

        <Box m={2}>
          {show &&
            (loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress className={classes.colorLoading} />
              </Box>
            ) : transmitted.length > 0 ? (
              <Box
                m={2}
                ml={6}
                mr={6}
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Link component="button">Codigo_encuesta_microdatos_hogar</Link>
                <Link component="button">Codigo_encuesta_microdatos_personas</Link>
              </Box>
            ) : (
              <Box display="flex" justifyContent="center">
                <Alert severity="error" color="error">
                  <FormattedMessage id="NoExistsRecords" />
                </Alert>
              </Box>
            ))}
        </Box>
      </Paper>
    </>
  );
};
