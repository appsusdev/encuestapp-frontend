import { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { UsersScreen } from '../pages/poll/UsersScreen';
import { PollsScreen } from '../pages/poll/PollsScreen';
import { ConfigurationScreen } from '../pages/poll/ConfigurationScreen';
import { StatisticsScreen } from '../pages/poll/StatisticsScreen';

export const DashboardRouter: FC = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/encuestas" component={ PollsScreen }/>
                <Route exact path="/configuracion" component={ ConfigurationScreen }/>
                <Route exact path="/estadisticas" component={ StatisticsScreen }/>
                <Route exact path="/usuarios" component={ UsersScreen }/>

                <Redirect to="/usuarios"/>
            </Switch>

        </div>
    )
}
