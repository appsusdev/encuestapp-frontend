import { FC } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from 'react-router-dom';
  
import { AuthRouter } from './AuthRouter';
import Layout from '../components/ui/Layout/Layout';

export const AppRouter: FC = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path='/auth' component={ AuthRouter }/>
                    <Route path='/' component={ Layout }/>

                    <Redirect to='/'/>
                </Switch>
            </div>
        </Router>
    )
}
