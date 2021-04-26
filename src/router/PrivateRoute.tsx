import React from 'react'
import PropTypes from 'prop-types'

import { Route, Redirect } from 'react-router-dom'

interface PrivateRouteProps {
    component: any;
    isAuthenticated: boolean;
    path: string;
    exact?: boolean;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, isAuthenticated, ...rest} = props;

    return (
        <Route {...rest}
            component={ (routeProps: any) => (
                (isAuthenticated)
                    ? ( <Component {...routeProps} />)
                    : ( <Redirect to ="/auth/login" />)
            )}        
        />
    )
}

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
}


