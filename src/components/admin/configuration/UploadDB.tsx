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
import {
  uploadCitizens,
  uploadJsonCitizens,
} from "../../../helpers/uploadCitizens";
import { CitizensType } from "../../../interfaces/Citizens";
import { useDispatch, useSelector } from "react-redux";
import { MyAlert } from "../../custom/MyAlert";
import {
  setProgress,
  uiCloseErrorAlert,
  uiCloseSuccessAlert,
  uiOpenErrorAlert,
  uiOpenSuccessAlert,
} from "../../../redux/actions/uiActions";
import { AppState } from "../../../redux/reducers/rootReducer";
import CircularProgressWithLabel from "../../custom/CircularProgressWithLabel";

export const UploadDB = () => {
  const classes = useStyles();
  const { progress } = useSelector((state: AppState) => state.ui);

  const [fileToConvert, setFileToConvert] = useState<File | null>(null);
  const [citizens, setCitizens] = useState<CitizensType | null>(null);
  const [noValid, setNoValid] = useState<boolean>(false);
  const [loading, setloading] = useState(false);
  const { successAlert, errorAlert } = useSelector(
    (state: AppState) => state.ui
  );
  const dispatch = useDispatch();

  // Cerrar success alert
  const closeSuccess = () => {
    dispatch(uiCloseSuccessAlert());
    dispatch(uiCloseErrorAlert());
  };

  const handleSetprogress = async (totalInterted: number,lengthData:number) => {
    if (lengthData>0) {
      const progresPorcent = Math.round(
        (totalInterted / lengthData) * 100
      );
      await dispatch(setProgress(progresPorcent));
    }
  };

  const handleUpload = async () => {
    try {
      if (fileToConvert) {
        setloading(true);
        const jsonResponse: any = await excelToJson(
          fileToConvert,
          handleSetprogress
        );
        //const parseData: any[] = JSON.parse(jsonResponse);
        //await uploadCitizens(citizens, handleSetprogress);
        await dispatch(setProgress(100));
        await uploadJsonCitizens(JSON.stringify(jsonResponse));

        await setFileToConvert(null);
        await setloading(false);
        await setCitizens(null);
        (
          document.getElementById("contained-button-file") as HTMLInputElement
        ).value = "";
        dispatch(uiOpenSuccessAlert());
        dispatch(setProgress(0));
      }
    } catch (error) {
      dispatch(uiOpenErrorAlert());
      setloading(false);
    }
  };
  const handleSelectFile = async (e: any) => {
    const SUPPORTED_FORMATS = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const file = e.target.files[0] as File;
    if (file && SUPPORTED_FORMATS.includes(file.type)) {
      setFileToConvert(file);
      setNoValid(false);
    } else {
      setNoValid(true);
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
                value={fileToConvert ? fileToConvert.name : ""}
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

          <Box
            mt={2}
            display="flex"
            flexDirection="row-reverse"
            justifyContent="center"
            alignItems="center"
          >
            {loading ? (
              <>
                <CircularProgressWithLabel value={progress} />
                <FormattedMessage id="SavingData" />
              </>
            ) : (
              <Button
                className={clsx(classes.btn, classes.save)}
                onClick={handleUpload}
                disabled={loading}
              >
                <FormattedMessage id="Save" />
              </Button>
            )}
          </Box>
        </Box>
        <MyAlert
          open={successAlert}
          typeAlert="success"
          message={"SavingDataSucces"}
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
      </Box>
    </Paper>
  );
};
