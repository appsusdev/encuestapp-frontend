import clsx from "clsx";
import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import {
  Divider,
  Grid,
  Paper,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Link,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { MyTextField } from "../../custom/MyTextField";
import { convertDate } from "../../../helpers/convertDate";
import { getCopyArrayOrObject } from "../../../helpers/getCopyArrayOrObject";
import { Surveyor } from "../../../interfaces/Surveyor";
import { Survey } from "../../../interfaces/Survey";
import { startLoadingMicrodata } from "../../../redux/actions/surveyorsActions";
import { startLoading, finishLoading } from "../../../redux/actions/uiActions";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useStyles } from "../../../shared/styles/useStyles";

export const Surveyors = () => {
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();

  const { dataSurveys } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const { surveyors, surveysTransmitted, infoSurveysTransmitted } = useSelector<
    AppState,
    AppState["surveyor"]
  >((state) => state.surveyor);
  const { loading } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const [surveyorSelected, setSurveyorSelected] = useState("");
  const [surveySelected, setSurveySelected] = useState("");
  const [surveysAssign, setSurveysAssign] = useState<Survey[]>([]);
  const [errorSurveyor, setErrorSurveyor] = useState(false);
  const [errorSurvey, setErrorSurvey] = useState(false);
  const [valid, setValid] = useState({ survey: false, surveyor: false });
  const [show, setShow] = useState(false);
  const transmitted: Partial<Survey>[] =
    getCopyArrayOrObject(surveysTransmitted);
  const infoTransmitted: any[] = infoSurveysTransmitted;
  const surveyorsList: Surveyor[] = surveyors;
  let list: Survey[] = dataSurveys;

  useEffect(() => {
    setSurveysAssign(
      list.filter((survey: Survey) =>
        survey.surveyors.includes(surveyorSelected)
      )
    );
  }, [surveyorSelected, list]);

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

  const handleSelect = (value: string, flag: boolean) => {
    setShow(false);

    if ( flag ) {
      setErrorSurvey(value === "");
      setSurveySelected(value);
      setValid({ ...valid, survey: true });
    } else {
      setErrorSurveyor(value === "");
      setSurveyorSelected(value);
      setValid({ ...valid, surveyor: true });
    }
  };

  let newData: any[] = [];

  if (infoTransmitted.length > 0 && transmitted.length > 0) {
    infoTransmitted.forEach((infoSurvey) => {
      const date = convertDate(
        new Date(infoSurvey.fechaDeCarga.seconds * 1000).toLocaleDateString("en-CA")
      );
      const getSurvey = transmitted.filter(
        (survey) => survey.idSurvey === infoSurvey.idEncuesta
      );
      const name = getSurvey[0].name ? getSurvey[0].name : "";
      newData.push({ fecha: date, codeSurvey: infoSurvey.id, name: name });
    });
  }

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
              setErrorSurveyor(surveyorSelected === "");
              setErrorSurvey(surveySelected === "");
              if (valid.survey && valid.surveyor) {
                setShow(true);
                dispatch(startLoading());
                data.surveyor = surveyorSelected;
                data.survey = surveySelected;
                setSubmitting(true);
                // console.log("DATAA", data);
                await dispatch(startLoadingMicrodata(data));
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
                      <FormattedMessage id="SelectSurveyor" />:
                    </label>
                    <TextField
                      className={classes.myTextFieldRoot}
                      helperText={
                        errorSurveyor &&
                        `*${intl.formatMessage({ id: "RequiredFile" })}`
                      }
                      InputLabelProps={{ shrink: false }}
                      name="surveyor"
                      onChange={(event) => handleSelect(event.target.value,false)}
                      select
                      value={surveyorSelected}
                      variant="outlined"
                      size="small"
                      error={errorSurveyor}
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                    >
                      {surveyorsList.map((surveyor, index) => (
                        <MenuItem key={index} value={surveyor.id}>
                          {surveyor.username}
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
                      <FormattedMessage id="Survey" />:
                    </label>
                    <TextField
                      className={classes.myTextFieldRoot}
                      helperText={
                        errorSurvey &&
                        `*${intl.formatMessage({ id: "RequiredFile" })}`
                      }
                      InputLabelProps={{ shrink: false }}
                      name="survey"
                      select
                      size="small"
                      value={surveySelected}
                      variant="outlined"
                      onChange={(event) => handleSelect(event.target.value,true)}
                      error={errorSurvey}
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                    >
                      {surveysAssign.map((survey, index) => (
                        <MenuItem key={index} value={survey.idSurvey}>
                          {survey.name}
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

        <Box m={2} ml={4}>
          {show &&
            (loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress className={classes.colorLoading} />
              </Box>
            ) : transmitted.length > 0 && !loading ? (
              <Grid container spacing={1}>
                {newData.map((survey, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={4} >
                      <Link component="button">
                        {survey.name} ({survey.codeSurvey})
                      </Link>
                    </Grid>

                    <Grid item xs={8}>
                      {survey.fecha}
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
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
