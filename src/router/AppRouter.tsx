import { FC } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from 'react-router-dom';
  
import { AuthRouter } from './AuthRouter';
import { DashboardRouter } from './DashboardRouter';

export const AppRouter: FC = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path='/auth' component={ AuthRouter }/>
                    <Route path='/' component={ DashboardRouter }/>

                    <Redirect to='/'/>
                </Switch>
            </div>
        </Router>
    )
}
