import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from "yup";

import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { MyTextField } from "../../components/custom/MyTextField";
import { Fonts } from "../../shared/constants/AppEnums";
import logo from "../../assets/images/logo-encuestapp.png";
import useStylesAuth from "../../components/auth/auth.styles";

import {
  uiCloseErrorAlert,
  uiCloseSuccessAlert,
} from "../../redux/actions/uiActions";
import { AppState } from "../../redux/reducers/rootReducer";
import { startChangePassword } from "../../redux/actions/authActions";
import { MyAlert } from "../../components/custom/MyAlert";
import { InputAdornment, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

export const ChangeScreen = () => {
  const intl = useIntl();
  const classes = useStylesAuth();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
    current: false,
  });

  const { errorAlert, successAlert } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );

  const validationSchema = yup.object({
    current: yup
      .string()
      .required(`${intl.formatMessage({ id: "PasswordRequired" })}`),
    password: yup
      .string()
      .required(`${intl.formatMessage({ id: "PasswordRequired" })}`)
      .min(8, `${intl.formatMessage({ id: "MinimumPassword" })}`),
    confirmPassword: yup
      .string()
      .required(`${intl.formatMessage({ id: "PasswordRequired" })}`)
      .min(8, `${intl.formatMessage({ id: "MinimumPassword" })}`)
      .oneOf(
        [yup.ref("password"), null],
        `${intl.formatMessage({ id: "PasswordMatch" })}`
      ),
  });

  const closeAlert = () => {
    dispatch(uiCloseErrorAlert());
    dispatch(uiCloseSuccessAlert());
  };

  const handleClickPassword = () => {
    setShowPassword({ ...showPassword, password: !showPassword.password });
  };

  const handleClickCurrent = () => {
    setShowPassword({ ...showPassword, current: !showPassword.current });
  };

  const handleClickConfirm = () => {
    setShowPassword({ ...showPassword, confirm: !showPassword.confirm });
  };

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      className={classes.appAuth}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Card className={classes.cardRoot}>
          <Box m={3} mt={0}>
            <Box textAlign="center">
              <img className={classes.imgRoot} src={logo} alt="crema-logo" />
            </Box>
            <Box
              mt={1}
              component="h2"
              fontWeight={Fonts.REGULAR}
              fontSize={{ xs: 24, xl: 26 }}
              className={classes.textGrey}
            >
              <FormattedMessage id="ChangePasswordMessage" />
            </Box>
            <Box mt={1} mb={{ xs: 6, xl: 12 }}>
              <Typography id="font" className={classes.textSize}>
                <FormattedMessage id="SecurePassword" />
              </Typography>
            </Box>

            <Formik
              validateOnChange={true}
              initialValues={{
                current: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(data, { setSubmitting }) => {
                setSubmitting(true);
                dispatch(startChangePassword(data.current, data.password));
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className={classes.form}>
                  <Box>
                    <MyTextField
                      placeholder={intl.formatMessage({
                        id: "CurrentPassword",
                      })}
                      name="current"
                      type={showPassword.current ? "text" : "password"}
                      variant="outlined"
                      className={classes.textField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickCurrent}
                            >
                              {showPassword.current ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box>
                    <MyTextField
                      placeholder={intl.formatMessage({ id: "NewPassword" })}
                      name="password"
                      type={showPassword.password ? "text" : "password"}
                      variant="outlined"
                      className={classes.textField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickPassword}
                            >
                              {showPassword.password ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <MyTextField
                      placeholder={intl.formatMessage({
                        id: "ConfirmNewPassword",
                      })}
                      name="confirmPassword"
                      type={showPassword.confirm ? "text" : "password"}
                      variant="outlined"
                      className={classes.textField}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickConfirm}
                            >
                              {showPassword.confirm ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box mt={1} mb={3} display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={isSubmitting}
                      className={classes.btnRoot}
                      type="submit"
                    >
                      <FormattedMessage id="ChangePassword" />
                    </Button>
                  </Box>

                  <Box
                    textAlign="center"
                    fontSize={15}
                    className={classes.textGrey}
                  >
                    <Link to="/" className={classes.underlineNone}>
                      <FormattedMessage id="BackToHome" />
                    </Link>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Card>
      </Box>
      <MyAlert
        open={successAlert}
        typeAlert="success"
        message="PasswordUpdated"
        time={2500}
        handleClose={closeAlert}
      />

      <MyAlert
        open={errorAlert}
        typeAlert="error"
        message="ErrorUpdatingPassword"
        time={2500}
        handleClose={closeAlert}
      />
    </Box>
  );
};
