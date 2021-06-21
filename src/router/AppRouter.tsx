import { FC, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";

import CircularProgress from "@material-ui/core/CircularProgress";
import { AuthRouter } from "./AuthRouter";
import Layout from "../components/ui/Layout/Layout";
import { firebase } from "../config/firebase/firebase-config";
import { TypeUser } from "../enums/enums";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { login } from "../redux/actions/authActions";
import { uiChangeRole } from "../redux/actions/uiActions";
import { getUserRole } from "../services/firebase/auth";
import { Box, Grid } from "@material-ui/core";
import { useStyles } from "../shared/styles/useStyles";
import { startLoadingSurveyors, startLoadingAssignedSurveys } from '../redux/actions/surveyorsActions';
import { startLoadingCompleteSurveys, startLoadingDataSurveys } from '../redux/actions/surveysActions';
import { startLoadingCitizens } from '../redux/actions/citizensActions';

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
            const { rol, municipios } = resp;

            if (rol === TypeUser.ADMIN || rol === TypeUser.SUPER_ADMIN) {
              dispatch(uiChangeRole(rol));
              const userMain = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                rol: rol,
                municipios: municipios,
              };
              dispatch(login(userMain));
              dispatch(startLoadingSurveyors(municipios[0]));
              dispatch(startLoadingDataSurveys(municipios[0]));
              dispatch(startLoadingCompleteSurveys(municipios[0]));
              dispatch(startLoadingAssignedSurveys(municipios[0]));
              dispatch(startLoadingCitizens());
              setIsLoggedIn(true);
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

  return (
    <Router>
      <div>
        <Switch>
          <PublicRoute
            exact
            isAuthenticated={isLoggedIn}
            path="/auth/login"
            component={AuthRouter}
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
  );
};
