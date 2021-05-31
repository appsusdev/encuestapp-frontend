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
import { excelToJson } from "../../../helpers/excelToJson";

export const UploadDB = () => {
  const classes = useStyles();
  const [labelImage, setLabelImage] = useState("");
  const [citizensFile, setCitizensFile] = useState<File | null>(null);
  const [noValid, setNoValid] = useState<boolean>(false)

  const handleUpload = () => {
    console.log("Upload");
    //console.log(citizensFile);
  };
  const handleSelectFile = async (e: any) => {
    const SUPPORTED_FORMATS = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
    const file = e.target.files[0] as File;
    if(file && SUPPORTED_FORMATS.includes(file.type)){

      let jsonResponse:any = await excelToJson(file);
      let parseData:any[] = JSON.parse(jsonResponse)
  
      console.log(parseData.length)
      setCitizensFile(file);
      setLabelImage(e.target.files[0].name);
      setNoValid(false)

    }else{
      setNoValid(true)
    }
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
              <FormattedMessage id="DownloadExcelTemplate" />
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
                // value={survey}
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
                  style={{ marginTop: "27px" }}
                  className={clsx(classes.btnAction, classes.save)}
                  size="medium"
                  component="span"
                >
                  <FormattedMessage id="Attach" />
                </Button>
              </label>
            </Grid>
            {noValid && (
                <Grid item xs={12}>
                  <Box mt={-2} ml={2} style={{ fontSize: 12, color: "red" }}>
                    <FormattedMessage id="OnlyExcelFile" />
                  </Box>
                </Grid>
              )}

          
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
