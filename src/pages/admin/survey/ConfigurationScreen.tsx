import { Box } from "@material-ui/core";
import AppAnimate from "../../../components/ui/AppAnimate/AppAnimate";
import { UploadDB } from "../../../components/admin/configuration/UploadDB";
import { MapContainer } from "../../../components/admin/configuration/MapConfiguration";
import { MyAlert } from "../../../components/custom/MyAlert";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/reducers/rootReducer";
import {
  uiCloseModalAlert,
  uiCloseAlert,
} from "../../../redux/actions/uiActions";

export const ConfigurationScreen = () => {
  const dispatch = useDispatch();
  const { modalAlert, alert } = useSelector(
    (state: AppState) => state.ui
  );

  // Cerrar success alert
  const closeSuccess = () => {
    dispatch(uiCloseModalAlert());
    dispatch(uiCloseAlert());
  };
  return (
    <AppAnimate animation="transition.slideUpIn" delay={200}>
      <Box display="flex" justifyContent="space-between">
        <Box mr={2} mb={3} fontSize={16} width={1}>
          <MapContainer />
        </Box>

        <Box mb={3} fontSize={16} width={1}>
          <UploadDB />
        </Box>
      <MyAlert
        open={modalAlert}
        typeAlert="success"
        message={"MessageUpdateMap"}
        time={2000}
        handleClose={closeSuccess}
      />
      <MyAlert
        open={alert}
        typeAlert="error"
        message="SavingDataError"
        time={2000}
        handleClose={closeSuccess}
      />
      </Box>
    </AppAnimate>
  );
};
