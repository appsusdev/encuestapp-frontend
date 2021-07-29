import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import AppAnimate from "../../components/ui/AppAnimate/AppAnimate";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { FormattedMessage, useIntl } from "react-intl";
import { CustomizedSearch } from "../../components/custom/CustomizedSearch";
import { Fonts } from "../../shared/constants/AppEnums";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducers/rootReducer";
import { EntitiesTable } from "../../components/super-admin/EntitiesTable";
import CustomizedDialog from "../../components/custom/CustomizedDialog";
import {
  uiCloseAlert,
  uiCloseErrorAlert,
  uiCloseModalAdd,
  uiCloseModalDelete,
  uiCloseModalEdit,
  uiCloseSuccessAlert,
  uiOpenModalAdd,
} from "../../redux/actions/uiActions";
import { FormEntity } from "../../components/super-admin/FormEntity";
import { MyAlert } from '../../components/custom/MyAlert';


export const useStyles = makeStyles((theme) => ({
  btnRoot: {
    background: theme.palette.error.main,
    display: "flex",
    borderRadius: "4px",
    width: "20rem",
    fontWeight: Fonts.REGULAR,
    fontSize: 16,
    textTransform: "none",
    "&:hover": {
      background: theme.palette.error.dark,
    },
    [theme.breakpoints.down("sm")]: {
      width: "20%",
      heigth: "200px",
      textShadow: "transparent",
      fontSize: 0,
    },
  },
}));
export const EntitiesScreen = () => {
  const classes = useStyles();
  const intl = useIntl();

  const { entities: Entities } = useSelector(
    (state: AppState) => state.entities
  );
  const dispatch = useDispatch();
  const {
    modalAddOpen,
    modalEditOpen,
    modalDeleteOpen,
  } = useSelector<AppState, AppState["ui"]>((state) => state.ui);
  const { alert } = useSelector<AppState, AppState['ui']>(state => state.ui);

  const { successAlert, errorAlert } = useSelector(
    (state: AppState) => state.ui
  );
  const onAdd = () => {
    dispatch(uiOpenModalAdd());
  };
  // Cerrar modal crear encuestador
  const onDenyAdd = () => {
    dispatch(uiCloseModalAdd());
  };

  // Cerra modal editar encuestador
  const onDenyEdit = () => {
    dispatch(uiCloseModalEdit());
  };

  // Cerrar modal eliminar encuestador
  const onDenyDelete = () => {
    dispatch(uiCloseModalDelete());
  };
  // Cerrar success alert
  const closeSuccess = () => {
    dispatch(uiCloseSuccessAlert());
    dispatch(uiCloseErrorAlert());
    dispatch(uiCloseAlert())
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
                onClick={onAdd}
              >
                <AddOutlinedIcon />
                <FormattedMessage id="CreateNewEntity" />
              </Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={5}>
              <CustomizedSearch data={Entities} />
            </Grid>
          </Grid>
        </Box>
        {<EntitiesTable />}
        <CustomizedDialog
          open={modalAddOpen}
          cancelBtn={true}
          onDeny={onDenyAdd}
          title={`${intl.formatMessage({ id: "CreateNewEntity" })}`}
          content={<FormEntity />}
          width
          textButton="Accept"
        />
        <CustomizedDialog
          open={modalEditOpen}
          cancelBtn={true}
          onDeny={onDenyEdit}
          title={`${intl.formatMessage({ id: "EditEntity" })}`}
          content={
            <FormEntity edit />
          }
          width
          textButton="Accept"
        />
        <CustomizedDialog
          open={modalDeleteOpen}
          cancelBtn={true}
          onDeny={onDenyDelete}
          title={`${intl.formatMessage({ id: "DeleteEntity" })}`}
          content={
            <>
              {" "}
              <h1>BORRAR ENTIDAD</h1>{" "}
            </>
          }
          seeActions
          textButton="Accept"
        />
        <MyAlert
          open={successAlert}
          typeAlert="success"
          message={"SavingEntitySuccess"}
          time={2000}
          handleClose={closeSuccess}
        />
        <MyAlert
          open={errorAlert}
          typeAlert="error"
          message="SavingDataError"
          time={2000}
          handleClose={closeSuccess}
        />
    
      <Box mt={3}>
          <MyAlert open={alert} typeAlert="success" message="StateSurveyorUpdated" time={2000} handleClose={closeSuccess}/>
        </Box>
      </Box>
    </AppAnimate>
  );
}
