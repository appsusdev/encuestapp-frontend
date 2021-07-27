import React from "react";
import { useIntl } from "react-intl";

import { AppBar, Tab, Tabs } from "@material-ui/core";
import { a11yProps, TabPanel, useStyles } from "../../custom/Tabs";
import { Home } from "./Home";
import { Georeferencing } from "./Georeferencing";

export const HomeTabs = () => {
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
            label={`${intl.formatMessage({ id: "Homes" })}`}
            {...a11yProps(0)}
          />
          <Tab
            className={classes.tab}
            label={`${intl.formatMessage({ id: "Georeferencing" })}`}
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Home />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Georeferencing />
      </TabPanel>
    </div>
  );
};
