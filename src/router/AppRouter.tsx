import { FC, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import IdleTimer from "react-idle-timer";

import CircularProgress from "@material-ui/core/CircularProgress";
import { AuthRouter } from "./AuthRouter";
import Layout from "../components/ui/Layout/Layout";
import { firebase } from "../config/firebase/firebase-config";
import { TypeUser } from "../enums/enums";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { login, startLogout } from "../redux/actions/authActions";
import { uiChangeRole } from "../redux/actions/uiActions";
import { getUserRole } from "../services/firebase/auth";
import { Box, Grid } from "@material-ui/core";
import { useStyles } from "../shared/styles/useStyles";
import {
  startLoadingSurveyors,
  startLoadingAssignedSurveys,
} from "../redux/actions/surveyorsActions";
import { startLoadingCompleteSurveys } from "../redux/actions/surveysActions";
import {
  startLoadingCitizens,
  startLoadingMapData,
} from "../redux/actions/citizensActions";
import { startLoadEntities } from "../redux/actions/entitiesActions";
import { ChangeScreen } from "../pages/auth/ChangeScreen";

export const AppRouter: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isAuthFlag = true;

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user?.uid) {
        if (isAuthFlag) {
          isAuthFlag = false;
          const resp = await getUserRole(user.email);

          if (resp) {
            const { rol, municipio, nit, razonSocial } = resp;

            if (rol === TypeUser.ADMIN || rol === TypeUser.SUPER_ADMIN) {
              dispatch(uiChangeRole(rol));
              const userMain = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                rol: rol,
                municipio: municipio,
                nit: nit,
                razonSocial: razonSocial,
              };
              dispatch(login(userMain));

              if (rol === TypeUser.ADMIN) {
                await dispatch(startLoadingSurveyors(municipio, nit));
                await dispatch(startLoadingCompleteSurveys(municipio, nit));
                await dispatch(startLoadingAssignedSurveys(municipio, nit));
                await dispatch(startLoadingCitizens());
                await dispatch(startLoadingMapData(nit));
                setIsLoggedIn(true);
              } else if (rol === TypeUser.SUPER_ADMIN) {
                await dispatch(startLoadEntities());
                setIsLoggedIn(true);
              }
            }
          } else {
            setIsLoggedIn(false);
          }
        }
      } else {
        setIsLoggedIn(false);
      }
      setChecking(false);
    });
    // eslint-disable-next-line
  }, [dispatch, setChecking, setIsLoggedIn]);

  if (checking) {
    return (
      <div className={classes.rootLoading}>
        <Grid container className={classes.paperLoading}>
          <Box mx="auto" my="45vh">
            <CircularProgress className={classes.colorLoading} />
          </Box>
        </Grid>
      </div>
    );
  }

  const handleInactivity = () => {
    dispatch(startLogout());
  };

  return (
    <IdleTimer timeout={5 * 60 * 1000} onIdle={handleInactivity}>
      <Router>
        <div>
          <Switch>
            <PublicRoute
              isAuthenticated={isLoggedIn}
              path="/auth"
              component={AuthRouter}
            />
            <PrivateRoute
              path="/account"
              isAuthenticated={isLoggedIn}
              component={ChangeScreen}
            />
            <PrivateRoute
              path="/"
              isAuthenticated={isLoggedIn}
              component={Layout}
            />

            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    </IdleTimer>
  );
};
