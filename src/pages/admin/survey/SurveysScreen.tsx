import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";

import { Box, Button, Grid } from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { useStyles } from "./SurveyorsScreen";
import { SurveysTable } from "../../../components/admin/surveys/SurveysTable";
import { FormAddSurvey } from "../../../components/admin/surveys/FormAddSurvey";
import { FormAddQuestion } from "../../../components/admin/surveys/FormAddQuestion";
import { SurveysTabs } from "../../../components/admin/surveys/SurveysTabs";
import CustomizedDialog from "../../../components/custom/CustomizedDialog";
import { CustomizedSearch } from "../../../components/custom/CustomizedSearch";
import { MyAlert } from "../../../components/custom/MyAlert";
import AppAnimate from "../../../components/ui/AppAnimate/AppAnimate";
import { Survey } from "../../../interfaces/Survey";
import {
  uiOpenModalAdd,
  uiCloseModalAdd,
  uiCloseModalEdit,
  uiCloseModalAssign,
  uiCloseAlert,
  uiCloseModalDelete,
  uiCloseModalAlert,
  uiCloseDeleteSuccess,
} from "../../../redux/actions/uiActions";
import { AppState } from "../../../redux/reducers/rootReducer";
import {
  surveyCleanActive,
  startDeleteSurvey,
} from "../../../redux/actions/surveysActions";
import { FormAddChapter } from "../../../components/admin/surveys/FormAddChapter";
import { DeleteSurvey } from "../../../components/admin/surveys/DeleteSurvey";
import {
  setChapters,
  chapterCleanActive,
} from "../../../redux/actions/surveysActions";

export const SurveysScreen: FC = () => {
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const {
    alert,
    modalAddOpen,
    modalAlert,
    modalEditOpen,
    modalAssignOpen,
    modalDeleteOpen,
    deleteSuccess,
  } = useSelector<AppState, AppState["ui"]>((state) => state.ui);
  const { activeSurvey, surveys } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const survey: Survey = activeSurvey;
  let title: string = "";
  let array: Survey[] = surveys;

  if (activeSurvey) {
    title = survey.name;
  }

  useEffect(() => {
    dispatch(uiCloseAlert());
  }, [dispatch]);

  const openAddSurveyor = () => {
    dispatch(uiOpenModalAdd());
  };

  const onDenyAdd = () => {
    dispatch(uiCloseModalAdd());
  };

  const onDenyEdit = () => {
    dispatch(surveyCleanActive());
    dispatch(uiCloseModalEdit());
    dispatch(setChapters([]));
  };

  const onDenyAssign = () => {
    dispatch(uiCloseModalAssign());
    dispatch(surveyCleanActive());
    dispatch(setChapters([]));
  };

  const onDenyChapter = () => {
    dispatch(uiCloseModalDelete());
    dispatch(surveyCleanActive());
    dispatch(chapterCleanActive());
    dispatch(setChapters([]));
  };

  const onDenyDelete = () => {
    dispatch(surveyCleanActive());
    dispatch(uiCloseModalAlert());
  };

  const closeSuccess = () => {
    dispatch(uiCloseAlert());
    dispatch(uiCloseDeleteSuccess());
  };

  const handleDeleteSurvey = async () => {
    // Lógica para eliminar encuesta
    setLoading(true);
    await dispatch(startDeleteSurvey(survey.idSurvey));
    setLoading(false);
  };

  return (
    <AppAnimate animation="transition.slideUpIn" delay={200}>
      <Box>
        <Box mb={3} fontSize={20}>
          <Grid container>
            <Grid item xs={5}>
              <Button
                size="large"
                variant="contained"
                color="secondary"
                className={classes.btnRoot}
                type="button"
                onClick={openAddSurveyor}
              >
                <AddOutlinedIcon />
                <FormattedMessage id="AddNewSurvey" />
              </Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={5}>
              <CustomizedSearch data={array} />
            </Grid>
          </Grid>
        </Box>

        <SurveysTable />
        <CustomizedDialog
          open={modalAddOpen}
          cancelBtn={true}
          onDeny={onDenyAdd}
          title={`${intl.formatMessage({ id: "NewSurvey" })}`}
          content={<FormAddSurvey />}
          textButton="Accept"
        />
        <CustomizedDialog
          open={modalEditOpen}
          cancelBtn={true}
          onDeny={onDenyEdit}
          title={title}
          content={<SurveysTabs />}
          textButton="Accept"
        />
        <CustomizedDialog
          open={modalDeleteOpen}
          cancelBtn={true}
          onDeny={onDenyChapter}
          title={`${intl.formatMessage({ id: "AddChapter" })}`}
          content={<FormAddChapter />}
          textButton="Accept"
        />
        <CustomizedDialog
          open={modalAssignOpen}
          cancelBtn={true}
          onDeny={onDenyAssign}
          title={`${intl.formatMessage({ id: "AddQuestion" })}`}
          content={<FormAddQuestion />}
          textButton="Accept"
        />
        <CustomizedDialog
          open={modalAlert}
          cancelBtn={true}
          onDeny={onDenyDelete}
          onConfirm={handleDeleteSurvey}
          title={`${intl.formatMessage({ id: "DeleteSurvey" })}`}
          content={<DeleteSurvey />}
          textButton="YesDelete"
          seeActions
          loading={loading}
        />

        <Box mt={3}>
          <MyAlert
            open={alert}
            typeAlert="success"
            message="StateSurveyUpdated"
            time={2000}
            handleClose={closeSuccess}
          />
        </Box>

        <Box mt={3}>
          <MyAlert
            open={deleteSuccess}
            typeAlert="success"
            message="SurveyDeleted"
            time={2000}
            handleClose={closeSuccess}
          />
        </Box>
      </Box>
    </AppAnimate>
  );
};
