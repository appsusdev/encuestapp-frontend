import { FC } from 'react';
import { Link } from 'react-router-dom';

import { Form, Formik, useField } from 'formik';
import * as yup from 'yup';
import { useIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { CremaTheme } from '../../types/AppContextPropsType';
import { Fonts } from '../../shared/constants/AppEnums';
import { Box, Button, Checkbox, TextField } from '@material-ui/core';

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
    background: '#F04F47',
    borderRadius: '4px',
    width: '10rem',
    fontWeight: Fonts.REGULAR,
    fontSize: 16,
    marginTop: -15,
    textTransform: 'none',
    '&:hover': {
      background: '#D94040'
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
    color: '#0A8FDC',
  },
  underlineNone: {
    textDecoration: 'none',
  },
  textGrey: {
    color: '#9E9E9E',
  },
}));

const MyTextField = (props: any) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      {...props}
      {...field}
      helperText={errorText}
      error={!!errorText}
    />
  );
};

interface UserSigninProps { }

export const LoginForm: FC<UserSigninProps> = props => {

  const intl = useIntl();
  const classes = useStyles(props);

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
            setSubmitting(true);
            // dispatch(login({email: data.email, password: data.password}));
            setSubmitting(false);
          }}>
          {({ isSubmitting }) => (

            <Form className={classes.formRoot} noValidate autoComplete='off'>
              <Box mb={{ xs: 5, xl: 8 }}>
                <MyTextField
                  placeholder={intl.formatMessage({ id: 'Email' })}
                  name='email'
                  label={<FormattedMessage id='Email' />}
                  variant='outlined'
                  className={classes.myTextFieldRoot}
                />
              </Box>

              <Box mb={{ xs: 3, lg: 4 }}>
                <MyTextField
                  type='password'
                  placeholder={intl.formatMessage({ id: 'Password' })}
                  label={<FormattedMessage id='Password' />}
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
