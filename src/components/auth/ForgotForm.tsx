import { FC } from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Fonts } from '../../shared/constants/AppEnums';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { FormattedMessage, useIntl } from 'react-intl';
import logo from '../../assets/images/mi-alcaldia-logo.png';
import useStylesAuth from './auth.styles';
import { MyTextField } from '../custom/MyTextField';

interface ForgetPasswordProps { }

export const ForgotForm: FC<ForgetPasswordProps> = () => {
  const intl = useIntl();
  const classes = useStylesAuth();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(`${intl.formatMessage({ id: 'EmailFormat' })}`)
      .required(`${intl.formatMessage({ id: 'EmailRequired' })}`),
  });
  return (
    <Box flex={1} display='flex' flexDirection='column' justifyContent='center' className={classes.appAuth}>
      <Box mb={{ xs: 6, md: 8, xl: 18 }} textAlign='center'>
        <img
          className={classes.imgRoot}
          src={logo}
          alt='crema-logo'
        />
      </Box>

      <Box
        m={1} mt={3}
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'>
        <Card className={classes.card}>
          <Box
            component='h2'
            mb={3}
            fontWeight={Fonts.REGULAR}
            fontSize={{ xs: 24, xl: 26 }}
            className={classes.textGrey}>
            <FormattedMessage id='ForgetPassword' />
          </Box>
          <Box mb={{ xs: 6, xl: 12 }}>
            <Typography id="font" className={classes.textSize}>
              <FormattedMessage id='ForgetPasswordTextOne' /> <br />
              <FormattedMessage id='ForgetPasswordTextTwo' />
            </Typography>
          </Box>

          <Formik
            validateOnChange={true}
            initialValues={{
              email: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              // reset password api  call here
              setSubmitting(false);
              resetForm();
            }}>
            {({ isSubmitting }) => (
              <Form className={classes.form}>
                <Box>
                  <MyTextField
                    placeholder={intl.formatMessage({ id: 'EmailAddress' })}
                    name='email'
                    label={<FormattedMessage id='EmailAddress' />}
                    className={classes.textField}
                    variant='outlined'
                    autoComplete="off"
                  />
                </Box>
                <Box  mt={2} mb={3}>
                  <Button
                    variant='contained'
                    color='secondary'
                    disabled={isSubmitting}
                    className={classes.btnRoot}
                    type='submit'>
                    <FormattedMessage id='SendEmail' />
                  </Button>
                </Box>

                <Box
                  textAlign='center'
                  fontSize={15}
                  className={classes.textGrey}>
                  <FormattedMessage id='AlreadyHavePassword' />
                  <Link
                    to='/auth/login'
                    className={clsx(
                      classes.underlineNone,
                      classes.textSecondary,
                    )}>
                    <FormattedMessage id='Login' />
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        </Card>
      </Box>
    </Box>
  );
}
