import { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { UsersScreen } from '../pages/poll/UsersScreen';
import { PollsScreen } from '../pages/poll/PollsScreen';
import { ConfigurationScreen } from '../pages/poll/ConfigurationScreen';
import { StatisticsScreen } from '../pages/poll/StatisticsScreen';
import { useIntl } from 'react-intl';

export const DashboardRouter: FC = () => {
    const intl = useIntl();

    const routes = ["users", "polls", "configuration", "statistics"];

    const routesInt = routes.map( route => {
        return (intl.formatMessage({id: `${route}`}).normalize("NFD").replace(/[\u0300-\u036f]/g, "")).toLowerCase();
    });;

    return (
        <div>
            <Switch>
                <Route exact path={`/${routesInt[1]}`} component={ PollsScreen }/>
                <Route exact path={`/${routesInt[2]}`} component={ ConfigurationScreen }/>
                <Route exact path={`/${routesInt[3]}`} component={ StatisticsScreen }/>
                <Route exact path={`/${routesInt[0]}`} component={ UsersScreen }/>

                <Redirect to={`/${routesInt[0]}`}/>
            </Switch>

        </div>
    )
}
