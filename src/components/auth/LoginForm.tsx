import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useIntl, FormattedMessage } from "react-intl";

import { makeStyles } from "@material-ui/core/styles";
import { CremaTheme } from "../../types/AppContextPropsType";
import { Fonts } from "../../shared/constants/AppEnums";
import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { MyTextField } from "../custom/MyTextField";
import { startLoginCorreoPassword } from "../../redux/actions/authActions";
import { Colors } from "../../shared/constants/Colors";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { AppState } from "../../redux/reducers/rootReducer";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme: CremaTheme) => ({
  formRoot: {
    textAlign: "left",
    [theme.breakpoints.up("xl")]: {
      marginBottom: -24,
    },
    marginBottom: -40,
    marginLeft: 14,
    marginRight: 14,
    marginTop: -30,
  },
  myTextFieldRoot: {
    width: "100%",
    marginBottom: -15,
  },
  checkboxRoot: {
    marginLeft: -12,
  },
  pointer: {
    cursor: "pointer",
  },
  btnRoot: {
    background: Colors.ACCENT,
    borderRadius: "4px",
    width: "10rem",
    fontWeight: Fonts.REGULAR,
    fontSize: 16,
    marginTop: -15,
    textTransform: "none",
    "&:hover": {
      background: Colors.LIGTH_ACCENT,
    },
  },
  btnRootFull: {
    width: "100%",
  },
  btnLoading: {
    color: theme.palette.common.white,
    height: "25px !important",
    width: "25px !important",
  },
  dividerRoot: {
    marginBottom: 16,
    marginLeft: -48,
    marginRight: -48,
    [theme.breakpoints.up("xl")]: {
      marginBottom: 32,
    },
  },
  textPrimary: {
    color: theme.palette.text.primary,
  },
  colorTextPrimary: {
    color: theme.palette.info.main,
  },
  underlineNone: {
    textDecoration: "none",
  },
  textGrey: {
    color: theme.palette.action.disabled,
  },
}));

interface UserSigninProps {}

export const LoginForm: FC<UserSigninProps> = (props) => {
  const intl = useIntl();
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector((state: AppState) => state.ui);

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(`${intl.formatMessage({ id: "InvalidEmail" })}`)
      .required(`${intl.formatMessage({ id: "EmailRequired" })}`),
    password: yup
      .string()
      .required(`${intl.formatMessage({ id: "PasswordRequired" })}`),
  });

  const handleClick = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <Box flex={1} display="flex" flexDirection="column">
      <Box
        px={{ xs: 6, sm: 10, xl: 15 }}
        pt={5}
        flex={1}
        display="flex"
        flexDirection="column"
        className={classes.dividerRoot}
      >
        <Formik
          validateOnChange={true}
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (data, { setSubmitting }) => {
            setSubmitting(true);
            await dispatch(startLoginCorreoPassword(data.email, data.password));
            setSubmitting(false);
          }}
        >
          {() => (
            <Form className={classes.formRoot} noValidate autoComplete="off">
              <Box mb={{ xs: 5, xl: 8 }}>
                <MyTextField
                  placeholder={intl.formatMessage({ id: "Email" })}
                  name="email"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Box>

              <Box mb={{ xs: 3, lg: 4 }}>
                <MyTextField
                  placeholder={intl.formatMessage({ id: "Password" })}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClick}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box
                mb={{ xs: 3, xl: 4 }}
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ sm: "center" }}
                justifyContent={{ sm: "space-between" }}
                fontSize={15}
              >
                <Box display="flex" alignItems="center">
                  <Checkbox className={classes.checkboxRoot} />
                  <Box className={classes.textGrey} component="span">
                    <FormattedMessage id="RememberMe" />
                  </Box>
                </Box>
                <Box
                  component="span"
                  ml={{ sm: 4 }}
                  className={classes.pointer}
                  fontSize={15}
                >
                  <Link to="/auth/forgot">
                    <FormattedMessage id="ForgetPassword" />
                  </Link>
                </Box>
              </Box>

              <Box
                mb={6}
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ sm: "center" }}
                justifyContent={{ sm: "space-between" }}
              >
                {!loading ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={loading}
                    className={classes.btnRoot}
                  >
                    <FormattedMessage id="Login" />
                  </Button>
                ) : (
                  <Button
                    className={classes.btnRoot}
                    autoFocus
                    type="button"
                    disabled={true}
                  >
                    <CircularProgress className={classes.btnLoading} />
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};
