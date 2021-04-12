import { useIntl } from 'react-intl';

const routes = ["Home", "Surveyors", "Surveys", "Configuration", "Statistics"];

export const Routes = () => {
    const intl = useIntl();
    const routesInt = routes.map( route => {
        return (intl.formatMessage({id: `${route}`}).normalize("NFD").replace(/[\u0300-\u036f]/g, "")).toLowerCase();
    });;
    
    return routesInt;
}

export const RoutesName = () => {
    const intl = useIntl();
    const routesInt = routes.map( route => {
        return (intl.formatMessage({id: `${route}`}));
    });;

    return routesInt;
}
