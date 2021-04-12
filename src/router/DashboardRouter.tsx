import { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { SurveyorsScreen } from '../pages/survey/SurveyorsScreen';
import { SurveysScreen } from '../pages/survey/SurveysScreen';
import { ConfigurationScreen } from '../pages/survey/ConfigurationScreen';
import { StatisticsScreen } from '../pages/survey/StatisticsScreen';
import { Routes } from '../helpers/getRoutes';
import { HomeScreen } from '../pages/survey/HomeScreen';

export const DashboardRouter: FC = () => {

    const routes = Routes();

    return (
        <div>
            <Switch>
                <Route exact path={`/${routes[1]}`} component={ SurveyorsScreen }/>
                <Route exact path={`/${routes[2]}`} component={ SurveysScreen }/>
                <Route exact path={`/${routes[3]}`} component={ ConfigurationScreen }/>
                <Route exact path={`/${routes[4]}`} component={ StatisticsScreen }/>
                <Route exact path={`/${routes[0]}`} component={ HomeScreen }/>

                <Redirect to={`/${routes[0]}`}/>
            </Switch>

        </div>
    )
}
