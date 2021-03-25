import { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { UsersScreen } from '../pages/poll/UsersScreen';
import { PollsScreen } from '../pages/poll/PollsScreen';
import { ConfigurationScreen } from '../pages/poll/ConfigurationScreen';
import { StatisticsScreen } from '../pages/poll/StatisticsScreen';
import { Routes } from '../helpers/getRoutes';

export const DashboardRouter: FC = () => {

    const routes = Routes();

    return (
        <div>
            <Switch>
                <Route exact path={`/${routes[1]}`} component={ PollsScreen }/>
                <Route exact path={`/${routes[2]}`} component={ ConfigurationScreen }/>
                <Route exact path={`/${routes[3]}`} component={ StatisticsScreen }/>
                <Route exact path={`/${routes[0]}`} component={ UsersScreen }/>

                <Redirect to={`/${routes[0]}`}/>
            </Switch>

        </div>
    )
}
