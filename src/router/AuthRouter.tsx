import { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { ForgotScreen } from '../pages/auth/ForgotScreen';
import { LoginScreen } from '../pages/auth/LoginScreen';

export const AuthRouter: FC = () => {
    return (
        <div>
            <Switch>
                <Route exact path='/auth/login' component={ LoginScreen } />
                <Route exact path='/auth/forgot' component={ ForgotScreen } />
            
                <Redirect to='/auth/login'/>
            </Switch>
        </div>
    )
}
