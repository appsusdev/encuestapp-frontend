import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { CustomizedSearch } from '../../components/custom/CustomizedSearch';
import { Fonts } from '../../shared/constants/AppEnums';
import { AppState } from '../../reducers/rootReducer';
import { uiOpenModalAdd, uiCloseModalAdd } from '../../actions/ui';
import { FormAddSurveyor } from '../../components/admin/surveyors/FormAddSurveyor';
import { SurveyorsTable } from '../../components/admin/surveyors/SurveyorsTable';
import CustomizedDialog from '../../components/custom/CustomizedDialog';
import AppAnimate from '../../components/ui/AppAnimate/AppAnimate';

const useStyles = makeStyles((theme) => ({
  btnRoot: {
    background: '#F04F47',
    display: 'flex',
    borderRadius: '4px',
    width: '20rem',
    fontWeight: Fonts.REGULAR,
    fontSize: 16,
    textTransform: 'none',
    '&:hover': {
      background: '#D94040'
    },
    [theme.breakpoints.down('sm')]: {
      width: '20%',
      heigth: '200px',
      textShadow: 'transparent',
      fontSize: 0
    },
  }
}));

export const HomeScreen = () => {
  const classes = useStyles();
  const intl = useIntl();
  const { modalAddOpen } = useSelector<AppState, AppState['ui']>(state => state.ui);
  const dispatch = useDispatch();

  const openAddSurveyor = () => {
    dispatch(uiOpenModalAdd());
  }

  const onDenyAdd = () => {
    dispatch(uiCloseModalAdd());
  }


  return (
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <Box>
        <Box mb={3} fontSize={20}>
          <Grid container direction="row">
            <Button
              size="large"
              variant='contained'
              color='secondary'
              className={classes.btnRoot}
              type='button'
              onClick={openAddSurveyor}
            >
              <AddOutlinedIcon /><FormattedMessage id='AddNewSurveyor' />
            </Button>

            <CustomizedSearch />
          </Grid>
        </Box>

        <SurveyorsTable />
        <CustomizedDialog open={modalAddOpen} cancelBtn={true} onDeny={onDenyAdd} title={`${intl.formatMessage({ id: 'CreateNewSurveyor' })}`} content={<FormAddSurveyor />} />
        
      </Box>
    </AppAnimate>
  )
}
