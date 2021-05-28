import clsx from "clsx";
import { FormattedMessage } from "react-intl";

import {
  Button,
  Divider,
  Paper,
  Box,
  Grid,
  TextField,
  Link,
} from "@material-ui/core";
import { useStyles } from "../../../shared/styles/useStyles";
import { useState } from "react";

export const UploadDB = () => {
  const classes = useStyles();
  const [labelImage, setLabelImage] = useState("");
  const [citizensFile, setCitizensFile] = useState<File | null>(null);

  const handleUpload = () => {
    console.log("Upload");
    console.log(citizensFile);
 
  };
  const handleSelectFile = (e: any) => {
    console.log(e.target.files[0]);
    console.log("FULL PATH--");
    console.log(e.target.value);
    const file = e.target.files[0] as File;
    const fReader = new FileReader();
    fReader.readAsDataURL(file);
    fReader.onloadend = function (event) {
        if(event.target){
        
            console.log(event.target)
        }
    };
    setCitizensFile(file);
    setLabelImage(e.target.files[0].name);
  };

  return (
    <Paper>
      <Box>
        <Box className={clsx(classes.root, classes.title)}>
          <FormattedMessage id="UploadCitizenDB" />
        </Box>
        <Divider variant="middle" />
        <Box className={classes.root}>
          <Box display="flex" justifyContent="flex-end">
            <Link component="button">
              <FormattedMessage id="UploadExcel" />
            </Link>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={9} className={classes.typography}>
              <label className="form-text">
                <FormattedMessage id="UploadExcel" />
              </label>
              <TextField
                className={classes.inputSelect}
                // onChange={handleChange}
                value={labelImage}
                disabled
                size="small"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                id="contained-button-file"
                type="file"
                onChange={handleSelectFile}
                style={{ display: "none" }}
              />
              <label htmlFor="contained-button-file">
                <Button
                  className={clsx(classes.btnAction, classes.save)}
                  size="medium"
                  component="span"
                  //onClick={handleUpload}
                >
                  <FormattedMessage id="Attach" />
                </Button>
              </label>
            </Grid>
          </Grid>

          <Box mt={2} display="flex" flexDirection="row-reverse">
            <Button
              className={clsx(classes.btn, classes.save)}
              onClick={handleUpload}
            >
              <FormattedMessage id="Save" />
            </Button>
            <Button className={clsx(classes.btn, classes.cancel)}>
              <FormattedMessage id="Cancel" />
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
