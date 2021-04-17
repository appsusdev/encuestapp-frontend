import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Button, Grid } from '@material-ui/core';
import AppAnimate from '../../components/ui/AppAnimate/AppAnimate';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { useStyles } from '../survey/SurveyorsScreen';
import { CustomizedSearch } from '../../components/custom/CustomizedSearch';
import { SurveysTable } from '../../components/admin/surveys/SurveysTable';
import CustomizedDialog from '../../components/custom/CustomizedDialog';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../reducers/rootReducer';
import { uiOpenModalAdd, uiCloseModalAdd, uiCloseModalEdit, uiCloseModalAssign } from '../../actions/ui';
import { FormAddSurvey } from '../../components/admin/surveys/FormAddSurvey';
import { SurveysTabs } from '../../components/admin/surveys/SurveysTabs';
import { FormAddQuestion } from '../../components/admin/surveys/FormAddQuestion';

export const SurveysScreen = () => {


  const classes = useStyles();
  const intl = useIntl();

  const { modalAddOpen, modalEditOpen, modalAssignOpen } = useSelector<AppState, AppState['ui']>(state => state.ui);
  const dispatch = useDispatch();

  const openAddSurveyor = () => {
    dispatch(uiOpenModalAdd());
  }

  const onDenyAdd = () => {
    dispatch(uiCloseModalAdd());
  }

  const onDenyEdit = () => {
    dispatch(uiCloseModalEdit());
  }

  const onDenyAssign = () => {
    dispatch(uiCloseModalAssign());
  }

  return (
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <Box>
        <Box mb={3} fontSize={20}>
          <Grid container>
            <Grid item xs={5}>
              <Button
                size="large"
                variant='contained'
                color='secondary'
                className={classes.btnRoot}
                type='button'
                onClick={openAddSurveyor}
              >
                <AddOutlinedIcon /><FormattedMessage id='AddNewSurvey' />
              </Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={5}>
              <CustomizedSearch />
            </Grid>
          </Grid>
        </Box>

        <SurveysTable />
        <CustomizedDialog open={modalAddOpen} cancelBtn={true} onDeny={onDenyAdd} title={`${intl.formatMessage({ id: 'NewSurvey' })}`} content={<FormAddSurvey />} textButton="Accept" />
        <CustomizedDialog open={modalEditOpen} cancelBtn={true} onDeny={onDenyEdit} title={'Nombre de la encuesta'} content={<SurveysTabs />} textButton="Accept" />
        <CustomizedDialog open={modalAssignOpen} cancelBtn={true} onDeny={onDenyAssign} title={'Agregar pregunta'} content={<FormAddQuestion />} textButton="Accept" />
      </Box>
    </AppAnimate>
  )
}
