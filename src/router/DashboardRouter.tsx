import { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { SurveyorsScreen } from '../pages/admin/survey/SurveyorsScreen';
import { SurveysScreen } from '../pages/admin/survey/SurveysScreen';
import { ConfigurationScreen } from '../pages/admin/survey/ConfigurationScreen';
import { StatisticsScreen } from '../pages/admin/survey/StatisticsScreen';
import { Routes } from '../helpers/getRoutes';
import { HomeScreen } from '../pages/admin/survey/HomeScreen';
import { HomeScreen as Home } from '../pages/super-admin/HomeScreen';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/reducers/rootReducer';
import { TypeUser } from '../enums/enums';

export const DashboardRouter: FC = () => {

    const routes = Routes();
    const { role } = useSelector<AppState, AppState['ui']>(state => state.ui);

    return (
        <div>
            {
                (role === TypeUser.ADMIN)?

                <Switch>
                    <Route exact path={`/${routes[1]}`} component={ SurveyorsScreen }/>
                    <Route exact path={`/${routes[2]}`} component={ SurveysScreen }/>
                    <Route exact path={`/${routes[3]}`} component={ ConfigurationScreen }/>
                    <Route exact path={`/${routes[4]}`} component={ StatisticsScreen }/>
                    <Route exact path={`/${routes[0]}`} component={ HomeScreen }/>

                    <Redirect to={`/${routes[0]}`}/>
                </Switch>
                :
                <Switch>
                    <Route exact path={`/${routes[5]}`} component={ Home }/>

                    <Redirect to={`/${routes[5]}`}/>
                </Switch>

            }

        </div>
    )
}
