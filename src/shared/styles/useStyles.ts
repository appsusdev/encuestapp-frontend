import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { Fonts } from "../constants/AppEnums";
import { Colors } from "../constants/Colors";

export const useStyles = makeStyles((theme: Theme) => ({
  input: {
    fontSize: 14,
    "& input::placeholder": {
      fontSize: 16,
      color: theme.palette.background.default,
      fontWeight: Fonts.MEDIUM,
    },
  },
  inputSelect: {
    width: "100%",
    marginTop: 8,
  },
  myTextFieldRoot: {
    width: "100%",
    marginTop: 8,
    "& label": {
      color: `${theme.palette.grey[800]} !important`,
      fontFamily: "Poppins",
      fontSize: 15,
    },
  },
  btn: {
    fontWeight: Fonts.REGULAR,
    textTransform: "capitalize",
    color: theme.palette.common.white,
    fontSize: 14,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: "4px",
    width: "10vw",
    marginLeft: "5px",
  },
  btnAction: {
    width: "100%",
    fontWeight: Fonts.REGULAR,
    textTransform: "capitalize",
    color: theme.palette.common.white,
    fontSize: 14,
    borderRadius: "4px",
  },
  cancel: {
    background: Colors.ACCENT,
    "&:hover": {
      background: Colors.LIGTH_ACCENT,
    },
  },
  save: {
    background: Colors.DARK_BUTTON,
    "&:hover": {
      background: Colors.PRIMARY,
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  typography: {
    fontFamily: "Poppins",
    fontSize: 14,
  },
  table: {
    minWidth: 500,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  card: {
    height: "247px !important",
    marginTop: "12px",
    maxWidth: 345,
  },
  cardPDF: {
    height: "350px",
    maxWidth: "100%",
    objectFit: "cover",
    objectPosition: "center center",
  },
  paper: {
    minHeight: "400px",
  },
  root: {
    margin: 0,
    padding: theme.spacing(2),
    fontFamily: "Poppins",
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 18,
    fontWeight: Fonts.MEDIUM,
    color: theme.palette.grey[800],
  },
  titlePDF: {
    fontSize: 22,
    fontWeight: Fonts.BOLD,
    color: theme.palette.grey[800],
  },
  swal: {
    height: "50hv",
  },
  colorLoading: {
    color: Colors.DARK_BUTTON,
  },
  rootLoading: {
    flexGrow: 1,
  },
  paperLoading: {
    height: "100%",
    width: "100%",
  },
  btnLoading: {
    color: theme.palette.common.white,
    height: "25px !important",
    width: "25px !important",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  helperText: {
    color: "red",
  },
  mapContainer: {
    bottom: 0,
    height: "100%",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1250,
  },
  infoMap: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: "20px",
    color: theme.palette.common.white,
    fontSize: 10,
    padding: "8px",
    position: "fixed",
    zIndex: 1251,
    marginTop: "5px",
    marginLeft: "5px",
  },
}));
