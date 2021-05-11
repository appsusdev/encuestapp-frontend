import React from "react";
import { useIntl } from "react-intl";

import { AppBar, Tab, Tabs } from "@material-ui/core";
import { FormAddSurvey } from "./FormAddSurvey";
import { SurveyorsData } from "./SurveyorsData";
import { a11yProps, TabPanel, useStyles } from "../../custom/Tabs";
import { MyAlert } from '../../custom/MyAlert';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducers/rootReducer';
import { uiCloseSuccessAlert, uiCloseModalEdit } from '../../../redux/actions/uiActions';

export const SurveysTabs = () => {
  const classes = useStyles();
  const intl = useIntl();
  const [value, setValue] = React.useState(0);
  const { successAlert } = useSelector<AppState, AppState['ui']>(state => state.ui);
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const closeSuccess = () => {
    dispatch( uiCloseModalEdit() );
    dispatch( uiCloseSuccessAlert() );
}

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          className={classes.tabs}
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          centered
          TabIndicatorProps={{
            style: {
              backgroundColor: "#0A8FDC",
            },
          }}
        >
          <Tab
            className={classes.tab}
            label={`${intl.formatMessage({ id: "GeneralData" })}`}
            {...a11yProps(0)}
          />
          <Tab
            className={classes.tab}
            label={`${intl.formatMessage({ id: "Surveyors" })}`}
            {...a11yProps(1)}
          />
          <Tab
            className={classes.tab}
            label={`${intl.formatMessage({ id: "PreviewSurvey" })}`}
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>
      <div style={{ marginTop: "20px" }}>
        <TabPanel value={value} index={0}>
          <FormAddSurvey />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SurveyorsData />
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* Previsualizar Encuesta */}
        </TabPanel>
      </div>

      <MyAlert open={successAlert} typeAlert="success" message="UpdatedSurvey" time={2000} handleClose={closeSuccess}/>
    </div>
  );
};
