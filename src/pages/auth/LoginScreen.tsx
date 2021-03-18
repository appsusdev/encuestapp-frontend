import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from "react-intl";
import { Box, Card } from '@material-ui/core';
import { Fonts } from '../../shared/constants/AppEnums';
import logo from '../../assets/images/logo-white-with-name.png';
import authBackground from '../../assets/images/auth-background.jpg';

const useStyles = makeStyles(theme => ({
    appAuth: {
        flex: 1,
        display: 'flex',
        position: 'relative',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        background: `url(${authBackground}) no-repeat center center`,
        backgroundSize: 'cover',
    
        '& .scrollbar-container': {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        '& .main-content-view': {
          padding: 20,
        },
        '& .footer': {
          marginRight: 0,
          marginLeft: 0,
        },
    },
    imgRoot: {
      cursor: 'pointer',
      display: 'inline-block',
      width: 140,
    },
    cardRoot: {
      maxWidth: '36rem',
      width: '100%',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      position: 'relative',
      paddingTop: 20,
      [theme.breakpoints.up('xl')]: {
        paddingTop: 32,
      },
      '&:before': {
        content: "''",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        width: 130,
        height: 9,
        borderBottomRightRadius: 80,
        borderBottomLeftRadius: 80,
        marginRight: 'auto',
        marginLeft: 'auto',
        backgroundColor: '#0A8FDC',
      },
    },
    textUppercase: {
      textTransform: 'uppercase',
    },
}));

export const LoginScreen: FC<{}> = () => {
    const classes = useStyles();
    return (
        <Box className={classes.appAuth}>

            <Box flex={1} display='flex' flexDirection='column' justifyContent='center'>
                <Box mb={{xs: 6, md: 8, xl: 18}} textAlign='center'>
                    <img
                    className={classes.imgRoot}
                    src={logo}
                    alt='crema-logo'
                />
            </Box>

            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'>
                <Card className={classes.cardRoot}>
                    <Box px={{xs: 6, sm: 10, xl: 15}}>
                        <Box
                        component='h2'
                        mb={{xs: 3, xl: 6}}
                        color='text.primary'
                        fontWeight={Fonts.REGULAR}
                        fontSize={{xs: 24, xl: 26}}>
                        <FormattedMessage id='Login' />
                        </Box>
                    </Box>
                    {/* TODO: Form*/}
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}
