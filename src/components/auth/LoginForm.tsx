import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useIntl, FormattedMessage } from 'react-intl';

import { makeStyles } from '@material-ui/core/styles';
import { CremaTheme } from '../../types/AppContextPropsType';
import { Fonts } from '../../shared/constants/AppEnums';
import { Box, Button, Checkbox } from '@material-ui/core';
import { MyTextField } from '../custom/MyTextField';
import { startLoginCorreoPassword } from '../../actions/auth';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme: CremaTheme) => ({
  formRoot: {
    textAlign: 'left',
    [theme.breakpoints.up('xl')]: {
      marginBottom: -24,
    },
    marginBottom: -40,
    marginLeft: 14,
    marginRight: 14,
    marginTop: -30,
  },
  myTextFieldRoot: {
    width: '100%',
    marginBottom: -15,
  },
  checkboxRoot: {
    marginLeft: -12,
  },
  pointer: {
    cursor: 'pointer',
  },
  btnRoot: {
    background: theme.palette.error.main,
    borderRadius: '4px',
    width: '10rem',
    fontWeight: Fonts.REGULAR,
    fontSize: 16,
    marginTop: -15,
    textTransform: 'none',
    '&:hover': {
      background: theme.palette.error.dark,
    }
  },
  btnRootFull: {
    width: '100%',
  },
  dividerRoot: {
    marginBottom: 16,
    marginLeft: -48,
    marginRight: -48,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 32,
    },
  },
  textPrimary: {
    color: theme.palette.text.primary,
  },
  colorTextPrimary: {
    color: theme.palette.info.main,
  },
  underlineNone: {
    textDecoration: 'none',
  },
  textGrey: {
    color: theme.palette.action.disabled,
  },
}));

interface UserSigninProps { }

export const LoginForm: FC<UserSigninProps> = props => {

  const intl = useIntl();
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(`${intl.formatMessage({ id: 'InvalidEmail' })}`)
      .required(`${intl.formatMessage({ id: 'EmailRequired' })}`),
    password: yup.string().required(`${intl.formatMessage({ id: 'PasswordRequired' })}`),
  });

  return (
    <Box flex={1} display='flex' flexDirection='column'>
      <Box
        px={{ xs: 6, sm: 10, xl: 15 }}
        pt={8}
        flex={1}
        display='flex'
        flexDirection='column'
        className={classes.dividerRoot}>
        <Formik
          validateOnChange={true}
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(data, { setSubmitting }) => {
            // console.log(data);
            setSubmitting(true);
            dispatch(startLoginCorreoPassword(data.email, data.password));
            setSubmitting(false);
          }}>
          {({ isSubmitting }) => (

            <Form className={classes.formRoot} noValidate autoComplete='off'>
              <Box mb={{ xs: 5, xl: 8 }}>
                <MyTextField
                  placeholder={intl.formatMessage({ id: 'Email' })}
                  name='email'
                  variant='outlined'
                  className={classes.myTextFieldRoot}
                />
              </Box>

              <Box mb={{ xs: 3, lg: 4 }}>
                <MyTextField
                  placeholder={intl.formatMessage({ id: 'Password' })}
                  type='password'
                  name='password'
                  variant='outlined'
                  className={classes.myTextFieldRoot}
                />
              </Box>

              <Box
                mb={{ xs: 3, xl: 4 }}
                display='flex'
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={{ sm: 'center' }}
                justifyContent={{ sm: 'space-between' }}
                fontSize={15}>
                <Box display='flex' alignItems='center'>
                  <Checkbox className={classes.checkboxRoot} />
                  <Box className={classes.textGrey} component='span'>
                    <FormattedMessage id='RememberMe' />
                  </Box>
                </Box>
                <Box
                  component='span'
                  ml={{ sm: 4 }}
                  className={classes.pointer}
                  // onClick={onGoToForgetPassword}
                  fontSize={15}>
                  <Link to="/auth/forgot">
                    <FormattedMessage id='ForgetPassword' />
                  </Link>
                </Box>
              </Box>

              <Box
                mb={6}
                display='flex'
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={{ sm: 'center' }}
                justifyContent={{ sm: 'space-between' }}>
                <Button
                  variant='contained'
                  color='secondary'
                  type='submit'
                  disabled={isSubmitting}
                  className={classes.btnRoot}>
                  <FormattedMessage id='Login' />
                </Button>

              </Box>
            </Form>
          )}
        </Formik>
      </Box>

    </Box>
  )
}
