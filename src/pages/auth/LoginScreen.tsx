import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import { Box, Card } from "@material-ui/core";
import { LoginForm } from "../../components/auth/LoginForm";
import useStylesAuth from "../../components/auth/auth.styles";
import { Fonts } from "../../shared/constants/AppEnums";
import { AppState } from "../../redux/reducers/rootReducer";
import { uiCloseErrorAlert } from "../../redux/actions/uiActions";
import logo from "../../assets/images/logo-encuestapp-blanco.png";
import { MyAlert } from "../../components/custom/MyAlert";

export const LoginScreen: FC<{}> = () => {
  const classes = useStylesAuth();
  const dispatch = useDispatch();
  const { errorAlert } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );

  const handleClose = () => {
    dispatch(uiCloseErrorAlert());
  };

  return (
    <Box className={classes.appAuth}>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box mb={5} textAlign="center">
          <img className={classes.imgRoot} src={logo} alt="Logo Encuestapp" />
        </Box>

        <Box
          m={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Card className={classes.cardRoot}>
            <Box px={{ xs: 6, sm: 10, xl: 15 }}>
              <Box
                component="h2"
                mb={{ xs: 0, xl: 0 }}
                color={"#495047"}
                fontWeight={Fonts.REGULAR}
                fontSize={{ xs: 24, xl: 26 }}
              >
                <FormattedMessage id="Login" />
              </Box>
            </Box>

            <LoginForm />
          </Card>
        </Box>
      </Box>

      <MyAlert
        open={errorAlert}
        typeAlert="error"
        message="IncorrectEmailPassword"
        time={4000}
        handleClose={handleClose}
      />
    </Box>
  );
};
