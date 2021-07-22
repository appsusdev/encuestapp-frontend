import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import AppAnimate from "../../components/ui/AppAnimate/AppAnimate";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { FormattedMessage, useIntl } from "react-intl";
import { CustomizedSearch } from "../../components/custom/CustomizedSearch";
import { Fonts } from "../../shared/constants/AppEnums";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducers/rootReducer";
import { EntitiesTable } from "../../components/super-admin/EntitiesTable";
import CustomizedDialog from "../../components/custom/CustomizedDialog";
import { uiCloseModalAdd, uiCloseModalDelete, uiCloseModalEdit, uiOpenModalAdd } from "../../redux/actions/uiActions";
import { FormAddEntity } from "../../components/super-admin/FormAddEntity";
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

export const HomeScreen = () => {
  const classes = useStyles();
  const intl = useIntl();

  const {entities:Entities} = useSelector((state: AppState) => state.entities);
  const dispatch = useDispatch();
  const { modalAddOpen, modalEditOpen, modalDeleteOpen, modalAssignOpen, modalAlert } = useSelector<AppState, AppState['ui']>(state => state.ui);
const onAdd = ()=>{
  dispatch( uiOpenModalAdd() )
}
  // Cerrar modal crear encuestador
const onDenyAdd = () => {
    dispatch(uiCloseModalAdd());
  }

  // Cerra modal editar encuestador
  const onDenyEdit = () => {
    dispatch(uiCloseModalEdit());
  }

  // Cerrar modal eliminar encuestador
  const onDenyDelete = () => {
    dispatch(uiCloseModalDelete());
  }
  useEffect(() => {
    console.log("HOME SCREEN SUPER ADMIN ---------------------------");
    console.log(Entities);
  }, []);

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
                <FormattedMessage id="AddNewSurveyor" />
              </Button>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={5}>
              <CustomizedSearch data={Entities} />
            </Grid>
          </Grid>
        </Box>
        <EntitiesTable/>
        <CustomizedDialog open={modalAddOpen} cancelBtn={true} onDeny={onDenyAdd} title={`${intl.formatMessage({ id: 'CreateNewEntity' })}`} content={<FormAddEntity/>} width textButton="Accept" />
        <CustomizedDialog open={modalEditOpen} cancelBtn={true} onDeny={onDenyEdit} title={`${intl.formatMessage({ id: 'EditEntity' })}`} content={<> <h1>EDITAR ENTIDAD</h1>   </>} width textButton="Accept" />
        <CustomizedDialog open={modalDeleteOpen} cancelBtn={true} onDeny={onDenyDelete} title={`${intl.formatMessage({ id: 'DeleteEntity' })}`} content={<> <h1>BORRAR ENTIDAD</h1>   </>} seeActions textButton="Accept" />
      </Box>
    </AppAnimate>
  );
};
