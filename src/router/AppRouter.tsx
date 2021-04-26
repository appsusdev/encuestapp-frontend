import { FC, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect
  } from 'react-router-dom';
  
import { AuthRouter } from './AuthRouter';
import Layout from '../components/ui/Layout/Layout';
import { firebase } from '../config/firebase/firebase-config';
import { useDispatch } from 'react-redux';
import { login } from '../actions/auth';
import { getUserRole } from '../services/auth/auth';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { uiChangeRole } from '../actions/ui';
import { TypeUser } from '../types/types';

export const AppRouter: FC = () => {
    const dispatch = useDispatch();
    const [checking, setChecking] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {

        firebase.auth().onAuthStateChanged(async(user) => {
            if (user?.uid) {
                const { rol } = await getUserRole(user.email);
                
                
                if(rol === TypeUser.ADMIN || rol === TypeUser.SUPER_ADMIN) {
                    dispatch( uiChangeRole(rol) );
                    const userMain = {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        rol: rol
                    }
                    dispatch( login(userMain));
                    setIsLoggedIn(true);
                } 
            } else {
                setIsLoggedIn(false);
            }
            setChecking(false);
        });
    }, [dispatch, setChecking, setIsLoggedIn]);

    if (checking) {
        return ( 
            <div>
                <p className = "mt-2"> Cargando</p> 
            </div >
        )
    }

    return (
        <Router>
            <div>
                <Switch>
                    <PublicRoute exact isAuthenticated = { isLoggedIn } path = "/auth/login" component = { AuthRouter }/> 
                    <PrivateRoute path = "/" isAuthenticated = { isLoggedIn } component = { Layout }/>

                    <Redirect to='/'/>
                </Switch>
            </div>
        </Router>
    )
}
