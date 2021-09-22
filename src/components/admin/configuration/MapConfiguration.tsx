import clsx from "clsx";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Divider,
  Paper,
  Button,
  CircularProgress,
} from "@material-ui/core";

import { useMapbox } from "../../../hooks/useMapbox";
import { setMapInfo } from "../../../redux/actions/citizensActions";
import { AppState } from "../../../redux/reducers/rootReducer";
import { updateMapData } from "../../../services/firebase/settings";
import { useStyles } from "../../../shared/styles/useStyles";
import {
  uiOpenModalAlert,
  uiOpenAlert,
} from "../../../redux/actions/uiActions";

const initialPoint = {
  lat: 2.495,
  lng: -73.781,
  zoom: 4.32,
};

export const MapContainer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { nit } = useSelector((state: AppState) => state.auth);
  const { mapData } = useSelector<AppState, AppState["citizens"]>(
    (state) => state.citizens
  );
  const { coords, setRef } = useMapbox(mapData ? mapData : initialPoint, true);
  const [loading, setLoading] = useState(false);

  const updateMap = async () => {
    setLoading(true);
    if (nit) {
      try {
        await updateMapData(nit, coords);
        dispatch(setMapInfo(coords));
        dispatch(uiOpenModalAlert());
      } catch (error) {
        dispatch(uiOpenAlert());
      }
    }
    setLoading(false);
  };

  return (
    <Paper>
      <Box>
        <Box className={clsx(classes.root, classes.title)}>
          <FormattedMessage id="Maps" />
        </Box>
        <Divider variant="middle" />
        <Box className={classes.root} style={{ height: "55vh" }}>
          <Box zIndex="tooltip" className={classes.infoMap}>
            Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
          </Box>

          <div ref={setRef} className={classes.mapContainer}></div>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          {loading ? (
            <Button
              className={clsx(classes.btnAction, classes.save)}
              autoFocus
              type="button"
              disabled={true}
              style={{
                marginRight: "15px",
                marginBottom: "15px",
                width: "35%",
              }}
            >
              <CircularProgress className={classes.btnLoading} />
            </Button>
          ) : (
            <Button
              style={{
                marginRight: "15px",
                marginBottom: "15px",
                width: "35%",
              }}
              className={clsx(classes.btnAction, classes.save)}
              size="medium"
              component="span"
              onClick={updateMap}
            >
              <FormattedMessage id="UpdateMap" />
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
