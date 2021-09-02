import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { useIntl, FormattedMessage } from "react-intl";
import { CircularProgress, TextField } from "@material-ui/core";
import * as yup from "yup";
import clsx from "clsx";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import {
  uiCloseModalAdd,
  uiCloseSuccessAlert,
  uiCloseErrorAlert,
  uiCloseModalAlert,
} from "../../../redux/actions/uiActions";
import { MyTextField } from "../../custom/MyTextField";
import { useStyles } from "../../../shared/styles/useStyles";
import { Surveyor } from "../../../interfaces/Surveyor";
import { TypeDoc } from "../../../enums/enums";
import { useState } from "react";
import { startNewSurveyor } from "../../../redux/actions/surveyorsActions";
import { AppState } from "../../../redux/reducers/rootReducer";
import { MyAlert } from "../../custom/MyAlert";

export const FormAddSurveyor = () => {
  const initialValues: Partial<Surveyor> = {
    typeDoc: "",
    document: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    username: "",
    email: "",
    mobilePhone: "",
    address: "",
    profileImage: null,
  };

  const intl = useIntl();
  const classes = useStyles();

  const dispatch = useDispatch();
  const [noValid, setNoValid] = useState(false);
  const [labelImage, setLabelImage] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string | undefined>("");
  const { modalAlert, successAlert } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );

  const validationSchema = yup.object({
    typeDoc: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    document: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`)
      .min(8, `${intl.formatMessage({ id: "MinimumPassword" })}`),
    firstName: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    secondName: yup.string(),
    firstLastName: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    secondLastName: yup.string(),
    username: yup.string(),
    email: yup
      .string()
      .email(`${intl.formatMessage({ id: "InvalidEmail" })}`)
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    mobilePhone: yup
      .number()
      .typeError(`${intl.formatMessage({ id: "NumericValue" })}`)
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    address: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
  });

  const onClose = () => {
    dispatch(uiCloseModalAdd());
  };

  const closeDialog = () => {
    dispatch(uiCloseModalAlert());
    dispatch(uiCloseErrorAlert());
  };

  const closeSuccess = () => {
    dispatch(uiCloseSuccessAlert());
    dispatch(uiCloseModalAdd());
  };

  const handleSelectFile = (e: any) => {
    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
    const file = e.target.files[0] as File;

    if (file) {
      !SUPPORTED_FORMATS.includes(file.type)
        ? setNoValid(true)
        : setNoValid(false);
      setProfileFile(file);
      setLabelImage(e.target.files[0].name);
    } else {
      setNoValid(false);
      setLabelImage("");
    }
  };

  return (
    <Box m={1}>
      <Formik
        enableReinitialize
        validateOnChange={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={async (values, { setSubmitting }) => {
          if (!noValid) {
            setSubmitting(true);
            setEmail(values.email);
            values.profileImage = profileFile;
            await dispatch(startNewSurveyor(values));
            setSubmitting(false);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className={classes.input}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <label className="form-text">
                  <FormattedMessage id="DocumentType" />
                </label>
                <MyTextField
                  name="typeDoc"
                  variant="outlined"
                  select
                  className={classes.myTextFieldRoot}
                >
                  <MenuItem value={TypeDoc.CC}>
                    <FormattedMessage id="CitizenshipCard" />
                  </MenuItem>
                  <MenuItem value={TypeDoc.CE}>
                    <FormattedMessage id="ForeignersIdentityCard" />
                  </MenuItem>
                  <MenuItem value={TypeDoc.PASSPORT}>
                    <FormattedMessage id="Passport" />
                  </MenuItem>
                </MyTextField>
              </Grid>

              <Grid item xs={8}>
                <label className="form-text">
                  <FormattedMessage id="DocumentNumber" />
                </label>
                <MyTextField
                  name="document"
                  variant="outlined"
                  type="number"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="FirstName" />
                </label>
                <MyTextField
                  name="firstName"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="SecondName" />
                </label>
                <MyTextField
                  name="secondName"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="FirstLastName" />
                </label>
                <MyTextField
                  name="firstLastName"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="SecondLastName" />
                </label>
                <MyTextField
                  name="secondLastName"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="SurveyorName" />
                </label>
                <MyTextField
                  name="username"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                  InputLabelProps={{ shrink: false }}
                  label={`${values.firstName} ${values.secondName} ${values.firstLastName} ${values.secondLastName}`}
                  disabled={true}
                  style={{ color: "black" }}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="Email" />
                </label>
                <MyTextField
                  name="email"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="Mobile" />
                </label>
                <MyTextField
                  name="mobilePhone"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="Address" />
                </label>
                <MyTextField
                  name="address"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="ProfileImage" />
                </label>

                <TextField
                  size="small"
                  type="file"
                  onChange={handleSelectFile}
                  id="icon-button-file"
                  autoComplete="off"
                  style={{ display: "none" }}
                />

                <MyTextField
                  disabled={true}
                  variant="outlined"
                  style={{ color: "black" }}
                  label={labelImage}
                  name="hola"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <Box mt={3} ml={-2}>
                  <Tooltip
                    title={`${intl.formatMessage({ id: "SearchImage" })}`}
                  >
                    <label htmlFor="icon-button-file">
                      <IconButton component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </Tooltip>
                </Box>
              </Grid>
              {noValid && (
                <Grid item xs={12}>
                  <Box mt={-2} ml={2} style={{ fontSize: 12, color: "red" }}>
                    <FormattedMessage id="ValidFiles" />
                  </Box>
                </Grid>
              )}
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

      <Dialog
        open={modalAlert}
        onClose={closeDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id="MessageExistsSurveyorOne" /> <br />
            {email}
            <br />
            <br />
            <FormattedMessage id="MessageExistsSurveyorTwo" />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeDialog} color="primary">
            <FormattedMessage id="Accept" />
          </Button>
        </DialogActions>
      </Dialog>

      <MyAlert
        open={successAlert}
        typeAlert="success"
        message="SurveyorAddSuccess"
        time={1000}
        handleClose={closeSuccess}
      />
    </Box>
  );
};
