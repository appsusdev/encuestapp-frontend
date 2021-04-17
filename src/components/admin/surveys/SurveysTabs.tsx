import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { FormAddSurvey } from './FormAddSurvey';
import { SurveyorsData } from './SurveyorsData';
import { Box } from '@material-ui/core';
import { useIntl } from 'react-intl';


interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
  }

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (

<Box p={1}>
{children}
</Box>
      )}
    </div>
  );
}

const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 'auto',
  },
  tabs: {  
      color: '#212529',
      backgroundColor: 'white',
      indicatorColor: '#33b35a', 
      
  },
  tab: {
    textTransform: 'none',
    // minWidth: 80,
    fontFamily: [
      'Poppins',
    ].join(','),
    '&:hover': {
      color: '#0A8FDC',
      opacity: 1,
      borderColor: 'primary'
    },
    '&:focus': {
      color: '#0A8FDC',
    },
  }
}));

export const SurveysTabs = () => {
  const classes = useStyles();
  const intl = useIntl();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
      <div className={classes.root}>
          <AppBar position="static">
              <Tabs 
                className={classes.tabs} 
                value={value} 
                onChange={handleChange}
                variant="fullWidth" centered 
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#0A8FDC"
                  }
                }}
              >
                  <Tab className={classes.tab} label={`${intl.formatMessage({ id: 'GeneralData'})}`} {...a11yProps(0)} />
                  <Tab className={classes.tab} label={`${intl.formatMessage({ id: 'Surveyors'})}`} {...a11yProps(1)} />
                  <Tab className={classes.tab} label={`${intl.formatMessage({ id: 'PreviewSurvey'})}`} {...a11yProps(2)} />
              </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>

              <FormAddSurvey />
          </TabPanel>
          <TabPanel value={value} index={1}>
              <SurveyorsData />
          </TabPanel>
          <TabPanel value={value} index={2}>
              {/* <ReporteComercios/> */}
          </TabPanel>
      </div>
  );
}
