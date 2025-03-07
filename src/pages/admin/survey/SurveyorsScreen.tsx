import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";

import {
  Box,
  Button,
  Dialog,
  Grid,
  makeStyles,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { AssignSurvey } from "../../../components/admin/surveyors/AssignSurvey";
import { DeleteSurveyor } from "../../../components/admin/surveyors/DeleteSurveyor";
import { FormAddSurveyor } from "../../../components/admin/surveyors/FormAddSurveyor";
import { FormEditSurveyor } from "../../../components/admin/surveyors/FormEditSurveyor";
import { SurveyorsTable } from "../../../components/admin/surveyors/SurveyorsTable";
import CustomizedDialog from "../../../components/custom/CustomizedDialog";
import { CustomizedSearch } from "../../../components/custom/CustomizedSearch";
import { MyAlert } from "../../../components/custom/MyAlert";
import AppAnimate from "../../../components/ui/AppAnimate/AppAnimate";
import {
  uiOpenModalAdd,
  uiCloseModalAdd,
  uiCloseModalEdit,
  uiCloseModalDelete,
  uiCloseModalAssign,
  uiCloseAlert,
  uiCloseModalAlert,
  uiCloseDeleteSuccess,
} from "../../../redux/actions/uiActions";
import { AppState } from "../../../redux/reducers/rootReducer";
import { Fonts } from "../../../shared/constants/AppEnums";
import { Surveyor } from "../../../interfaces/Surveyor";
import { useStyles as Styles } from "../../../shared/styles/useStyles";
import { surveyorCleanActive } from "../../../redux/actions/surveyorsActions";
import { Colors } from "../../../shared/constants/Colors";
import { uiCloseDeleteError } from "../../../redux/actions/uiActions";

export const useStyles = makeStyles((theme) => ({
  btnRoot: {
    background: Colors.ACCENT,
    display: "flex",
    borderRadius: "4px",
    width: "20rem",
    fontWeight: Fonts.REGULAR,
    fontSize: 16,
    textTransform: "none",
    "&:hover": {
      background: Colors.LIGTH_ACCENT,
    },
    [theme.breakpoints.down("sm")]: {
      width: "20%",
      heigth: "200px",
      textShadow: "transparent",
      fontSize: 0,
    },
  },
}));

export const SurveyorsScreen: FC = () => {
  const classes = useStyles();
  const classesFont = Styles();
  const intl = useIntl();
  const dispatch = useDispatch();
  const {
    deleteError,
    deleteSuccess,
    modalAddOpen,
    modalEditOpen,
    modalDeleteOpen,
    modalAssignOpen,
    modalAlert,
  } = useSelector<AppState, AppState["ui"]>((state) => state.ui);
  const { surveyors, activeSurveyor } = useSelector<
    AppState,
    AppState["surveyor"]
  >((state) => state.surveyor);
  const { alert } = useSelector<AppState, AppState["ui"]>((state) => state.ui);
  let array: Surveyor[] = surveyors;
  const surveyor: Surveyor = activeSurveyor;

  useEffect(() => {
    dispatch(uiCloseAlert());
  }, [dispatch]);

  // Abrir modal crear encuestador
  const openAddSurveyor = () => {
    dispatch(uiOpenModalAdd());
  };

  // Cerrar modal crear encuestador
  const onDenyAdd = () => {
    dispatch(uiCloseModalAdd());
  };

  // Cerra modal editar encuestador
  const onDenyEdit = () => {
    dispatch(uiCloseModalEdit());
    dispatch(surveyorCleanActive());
  };

  // Cerrar modal eliminar encuestador
  const onDenyDelete = () => {
    dispatch(uiCloseModalDelete());
    dispatch(uiCloseDeleteError());
    dispatch(surveyorCleanActive());
  };

  // Cerra modal asignar encuestas
  const onDenyAssign = () => {
    dispatch(uiCloseModalAssign());
    dispatch(surveyorCleanActive());
  };

  // Cerrar alert
  const closeSuccess = () => {
    dispatch(uiCloseAlert());
    dispatch(uiCloseDeleteSuccess());
  };

  // Cerrar modal de alerta
  const closeDialog = () => {
    dispatch(uiCloseModalAlert());
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
                <FormattedMessage id="AddNewSurveyor" />
              </Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={5}>
              <CustomizedSearch data={array} />
            </Grid>
          </Grid>
        </Box>

        <SurveyorsTable />
        <CustomizedDialog
          open={modalAddOpen}
          cancelBtn={true}
          onDeny={onDenyAdd}
          title={`${intl.formatMessage({ id: "CreateNewSurveyor" })}`}
          content={<FormAddSurveyor />}
          textButton="Accept"
        />
        <CustomizedDialog
          open={modalEditOpen}
          cancelBtn={true}
          onDeny={onDenyEdit}
          title={`${intl.formatMessage({ id: "EditSurveyor" })}`}
          content={<FormEditSurveyor />}
          width
          textButton="Accept"
        />
        <CustomizedDialog
          open={modalDeleteOpen}
          cancelBtn={false}
          onConfirm={onDenyDelete}
          onDeny={onDenyDelete}
          title={`${intl.formatMessage({ id: "DeleteSurveyor" })}`}
          content={<DeleteSurveyor existsAssigned={false} />}
          seeActions
          textButton="Return"
        />
        <CustomizedDialog
          open={deleteError}
          cancelBtn={false}
          onConfirm={onDenyDelete}
          onDeny={onDenyDelete}
          title={`${intl.formatMessage({ id: "DeleteSurveyor" })}`}
          content={<DeleteSurveyor existsAssigned={true} />}
          seeActions
          textButton="Return"
        />
        <CustomizedDialog
          open={modalAssignOpen}
          cancelBtn={true}
          onConfirm={onDenyAssign}
          onDeny={onDenyAssign}
          title={`${intl.formatMessage({ id: "AssignSurvey" })}`}
          content={<AssignSurvey />}
          seeActions
          textButton="Accept"
        />

        <Box mt={3}>
          <MyAlert
            open={alert}
            typeAlert="success"
            message="StateSurveyorUpdated"
            time={2000}
            handleClose={closeSuccess}
          />

          <MyAlert
            open={deleteSuccess}
            typeAlert="success"
            message="SurveyorDeleted"
            time={2000}
            handleClose={closeSuccess}
          />
        </Box>

        {surveyor && (
          <Dialog
            open={modalAlert}
            onClose={closeDialog}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogContent>
              <DialogContentText className={classesFont.typography}>
                <FormattedMessage id="MessageAssignSurveyOne" /> <br />
                <FormattedMessage id="MessageAssignSurveyTwo" />
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{ marginTop: "-10px" }}>
              <Button autoFocus onClick={closeDialog} color="primary">
                <FormattedMessage id="Accept" />
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </AppAnimate>
  );
};
