import PropTypes from 'prop-types';

import { Route, Redirect } from 'react-router-dom';

interface PublicRouteProps {
    component: any;
    isAuthenticated: boolean;
    path: string;
    exact?: boolean;
}

export const PublicRoute = ( props: PublicRouteProps) => {
    const { component: Component, isAuthenticated, ...rest} = props;

    return (
        <Route {...rest}
            component={ (routeProps: any) => (
                ( isAuthenticated )
                    ? ( <Redirect to ="/" />)
                    : ( <Component {...routeProps} />)
            )}
        
        />
    )
}

PublicRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
}
