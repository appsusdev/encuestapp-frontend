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
import {  useMemo, useState } from "react";
import { excelToJson } from "../../../helpers/excelToJson";
import { uploadJsonCitizens } from "../../../helpers/uploadCitizens";
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
import { TypeUser } from "../../../enums/enums";
import { firebase } from "../../../config/firebase/firebase-config";
import { setCitizens as loadCitizens } from "../../../redux/actions/citizensActions";
//import axios from "axios";

export const UploadDB = () => {
  const classes = useStyles();
  const { progress } = useSelector((state: AppState) => state.ui);
  const { municipio, rol, nit } = useSelector((state: AppState) => state.auth);
  //const [progress, setProgress] = useState(0)

  const [fileToConvert, setFileToConvert] = useState<File | null>(null);
  const [, setCitizens] = useState<CitizensType | null>(null);
  const [noValid, setNoValid] = useState<boolean>(false);
  const [loading, setloading] = useState(false);
  const [url, setUrl] = useState("");
  const { successAlert, errorAlert } = useSelector(
    (state: AppState) => state.ui
  );
  const dispatch = useDispatch();
/*   const getCitizenData = async()=>{
    try {
      
      const urlJsonCitizens = await firebase.storage().ref(`json/${nit}/citizens.json`).getDownloadURL()
      console.log(urlJsonCitizens)
      axios.get(urlJsonCitizens)
      .then(response=>{
        console.log(response.data.find((el:any)=>el.identificacion ==="10345041"))
      })
    } catch (error) {
      console.log("la url no existe")
    }
  }
  useEffect(() => {
    getCitizenData()
  }, []); */

  // Cerrar success alert
  const closeSuccess = () => {
    dispatch(uiCloseSuccessAlert());
    dispatch(uiCloseErrorAlert());
  };

  const handleSetprogress = useMemo(
    () => async (totalInterted: number, lengthData: number) => {
      if (lengthData > 0) {
        const lastPorcent = Math.round(
          ((totalInterted - 1) / lengthData) * 100
        );
        const progresPorcent = Math.round((totalInterted / lengthData) * 100);
        if (progresPorcent > lastPorcent) {
          dispatch(setProgress(progresPorcent));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress]
  );

  const handleUpload = async () => {
    try {
      if (fileToConvert && rol === TypeUser.ADMIN && municipio) {
        setloading(true);
        const jsonResponse: any = await excelToJson(
          fileToConvert,
          handleSetprogress
        );
        //GUARDAR EL JSON EN FIREBASE STORAGE PARA NO TENER PROBLEMAS CON LA CANTIDAD DE DATOS

        nit && (await uploadJsonCitizens(jsonResponse, nit));

        const parseData = JSON.parse(jsonResponse);
        await setFileToConvert(null);
        await setloading(false);
        await setCitizens(null);
        dispatch(loadCitizens(parseData));
        (
          document.getElementById("contained-button-file") as HTMLInputElement
        ).value = "";
        dispatch(uiOpenSuccessAlert());
        dispatch(setProgress(0));
        // const parseJson = JSON.parse(jsonResponse);
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
      "text/csv",
    ];
    const file = e.target.files[0] as File;
    if (file && SUPPORTED_FORMATS.includes(file.type)) {
      setFileToConvert(file);
      setNoValid(false);
    } else {
      setNoValid(true);
    }
  };

  const handleDownload = async () => {
    const url = await firebase
      .storage()
      .ref("formatoExcelPlantilla/PlantillaCiudadanos.csv")
      .getDownloadURL();
    setUrl(url);

    let content = document.getElementById("downloadExcel");
    content?.click();
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
            <Link component="button" onClick={handleDownload}>
              <FormattedMessage id="DownloadExcelTemplate" />
            </Link>
            <a id="downloadExcel" style={{ display: "none" }} href={url}>
              {url}
            </a>
          </Box>

          <Grid container spacing={1}>
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
                style={{ width: "35%" }}
                className={clsx(classes.btnAction, classes.save)}
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
