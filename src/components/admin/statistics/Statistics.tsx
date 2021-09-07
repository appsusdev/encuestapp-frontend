import React, { useState } from "react";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";

import {
  Box,
  Button,
  Grid,
  TextField,
  Paper,
  Divider,
  MenuItem,
} from "@material-ui/core";
import { useStyles } from "../../../shared/styles/useStyles";

export const Statistics = () => {
  const classes = useStyles();
  const intl = useIntl();
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
  };

  const handleSearch = () => {
    console.log(value);
  };

  return (
    <>
      <Divider variant="fullWidth" />
      <Paper square className={classes.paper}>
        <Box m={2} mb={2}>
          <Box mb={2}>
            <Grid container spacing={4}>
              <Grid item xs={9} className={classes.typography}>
                <label className="form-text">
                  <FormattedMessage id="SelectSurvey" />
                </label>
                <TextField
                  className={classes.myTextFieldRoot}
                  InputLabelProps={{ shrink: false }}
                  name="value"
                  onChange={handleChange}
                  select
                  size="small"
                  value={value}
                  variant="outlined"
                >
                  <MenuItem value={"Encuesta 1"}>Encuesta 1</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={3}>
                <Button
                  style={{ marginTop: "27px" }}
                  size="medium"
                  className={clsx(classes.btnAction, classes.save)}
                  onClick={handleSearch}
                >
                  <FormattedMessage id="Search" />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </>
  );
};
