import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Card, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { LoginForm } from '../../components/auth/LoginForm';
import useStylesAuth from '../../components/auth/auth.styles';
import { Fonts } from '../../shared/constants/AppEnums';
import { AppState } from '../../redux/reducers/rootReducer';
import { uiCloseAlert } from '../../redux/actions/uiActions';
import logo from '../../assets/images/logo-white-with-name.png';

export const LoginScreen: FC<{}> = () => {
    const classes = useStylesAuth();
    const dispatch = useDispatch();
    const { alert } = useSelector<AppState, AppState['ui']>(state => state.ui);

    const handleClose = () => {
        dispatch( uiCloseAlert() );
    }

    return (
        <Box className={classes.appAuth}>

            <Box flex={1} display='flex' flexDirection='column' justifyContent='center'>
                <Box mb={{ xs: 6, md: 8, xl: 18 }} textAlign='center'>
                    <img
                        className={classes.imgRoot}
                        src={logo}
                        alt='crema-logo'
                    />
                </Box>

                <Box
                    m={1}
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'>
                    <Card className={classes.cardRoot}>
                        <Box px={{ xs: 6, sm: 10, xl: 15 }}>
                            <Box
                                component='h2'
                                mb={{ xs: 0, xl: 0 }}
                                color='#495047'
                                fontWeight={Fonts.REGULAR}
                                fontSize={{ xs: 24, xl: 26 }}>
                                <FormattedMessage id='Login' />
                            </Box>
                        </Box>

                        <LoginForm />
                    </Card>
                </Box>
            </Box>

            <Snackbar  
                open={ alert } 
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }} 
                autoHideDuration={4000} 
                onClose={ handleClose }
            >
                <Alert onClose={ handleClose } severity="error">
                    <FormattedMessage id='IncorrectEmailPassword'/>
                </Alert>
            </Snackbar>
        </Box>
    )
}
