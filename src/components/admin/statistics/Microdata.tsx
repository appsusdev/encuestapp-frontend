import {
  Divider,
  Grid,
  Paper,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Link
} from "@material-ui/core";
import clsx from "clsx";
import { Formik, Form } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import { useStyles } from "../../../shared/styles/useStyles";
import { MyTextField } from "../../custom/MyTextField";
import * as yup from "yup";

export const Microdata = () => {
  const classes = useStyles();
  const intl = useIntl();

  const validationSchema = yup.object({
    survey: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    startDate: yup.date(),
    endDate: yup.date(),
    surveyor: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
  });

  let initialValues: any = {
    survey: "",
    startDate: new Date().toLocaleDateString("en-CA"),
    endDate: new Date().toLocaleDateString("en-CA"),
    surveyor: "",
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
              setSubmitting(true);
              console.log(data);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className={classes.input}>
                <Grid container spacing={2}>
                  <Grid item xs={12} style={{ marginTop: "10px" }}>
                    <label className="form-text"><FormattedMessage id="SelectSurvey"/></label>
                    <MyTextField
                      className={classes.myTextFieldRoot}
                      InputLabelProps={{ shrink: false }}
                      label={`${intl.formatMessage({ id: "InputSelect" })}`}
                      name="survey"
                      select
                      value=""
                      variant="outlined"
                    >
                      <MenuItem value={0}>Encuesta 1</MenuItem>
                    </MyTextField>
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
                    <label className="form-text"><FormattedMessage id="Surveyor"/>:</label>
                    <MyTextField
                      className={classes.myTextFieldRoot}
                      InputLabelProps={{ shrink: false }}
                      label={`${intl.formatMessage({ id: "InputSelect" })}`}
                      name="surveyor"
                      select
                      value=""
                      variant="outlined"
                    >
                      <MenuItem value={0}>Encuestador1</MenuItem>
                    </MyTextField>
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

        <Box m={2} ml={4} display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
            <Link component="button">
              Codigo_encuesta_microdatos_hogar
            </Link>
            <Link component="button">
              Codigo_encuesta_microdatos_personas
            </Link>
        </Box>
      </Paper>
    </>
  );
};
