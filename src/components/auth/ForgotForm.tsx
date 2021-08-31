import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from "yup";

import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { MyTextField } from "../custom/MyTextField";
import { Fonts } from "../../shared/constants/AppEnums";
import logo from "../../assets/images/logo-encuestapp.png";
import useStylesAuth from "./auth.styles";
import { startPasswordRecovery } from "../../redux/actions/authActions";
import { MyAlert } from "../custom/MyAlert";
import {
  uiCloseErrorAlert,
  uiCloseSuccessAlert,
} from "../../redux/actions/uiActions";
import { AppState } from "../../redux/reducers/rootReducer";

export const ForgotForm: FC = () => {
  const intl = useIntl();
  const classes = useStylesAuth();
  const dispatch = useDispatch();

  const { errorAlert, successAlert } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(`${intl.formatMessage({ id: "EmailFormat" })}`)
      .required(`${intl.formatMessage({ id: "EmailRequired" })}`),
  });

  const closeAlert = () => {
    dispatch(uiCloseErrorAlert());
    dispatch(uiCloseSuccessAlert());
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
              <FormattedMessage id="ForgetPassword" />
            </Box>
            <Box mt={1} mb={{ xs: 6, xl: 12 }}>
              <Typography id="font" className={classes.textSize}>
                <FormattedMessage id="ForgetPasswordTextOne" /> <br />
                <FormattedMessage id="ForgetPasswordTextTwo" />
              </Typography>
            </Box>

            <Formik
              validateOnChange={true}
              initialValues={{
                email: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(data, { setSubmitting }) => {
                setSubmitting(true);
                dispatch(startPasswordRecovery(data.email));
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className={classes.form}>
                  <Box>
                    <MyTextField
                      placeholder={intl.formatMessage({ id: "EmailAddress" })}
                      name="email"
                      InputLabelProps={{ shrink: false }}
                      className={classes.textField}
                      variant="outlined"
                      autoComplete="off"
                    />
                  </Box>
                  <Box mt={1} mb={3}>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={isSubmitting}
                      className={classes.btnRoot}
                      type="submit"
                    >
                      <FormattedMessage id="SendEmail" />
                    </Button>
                  </Box>

                  <Box
                    textAlign="center"
                    fontSize={15}
                    className={classes.textGrey}
                  >
                    <FormattedMessage id="AlreadyHavePassword" /> &nbsp;
                    <Link to="/auth/login" className={classes.underlineNone}>
                      <FormattedMessage id="Login" />
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
        message="PasswordRecoveryMessage"
        time={2500}
        handleClose={closeAlert}
      />

      <MyAlert
        open={errorAlert}
        typeAlert="error"
        message="ErrorPasswordRecovery"
        time={2500}
        handleClose={closeAlert}
      />
    </Box>
  );
};
