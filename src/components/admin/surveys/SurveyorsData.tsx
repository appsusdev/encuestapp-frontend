import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import clsx from "clsx";

import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  Tooltip,
  IconButton,
  createMuiTheme,
  ThemeProvider,
  Button,
} from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { TablePaginationAct } from "../../custom/TablePaginationAct";
import { uiCloseModalEdit } from "../../../redux/actions/uiActions";
import { useStyles } from "../../../shared/styles/useStyles";
import { AppState } from "../../../redux/reducers/rootReducer";
import { Surveyor } from "../../../interfaces/Surveyor";
import { Survey } from "../../../interfaces/Survey";
import { startAssignSurvey } from "../../../redux/actions/surveyorsActions";
import { activeSurvey } from "../../../redux/actions/surveysActions";
import { Alert } from "@material-ui/lab";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Poppins",
    fontSize: 13,
  },
});

const defaultProps = {
  bgcolor: "background.paper",
  style: { width: "100%", height: "100%" },
};

export const SurveyorsData = () => {
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();

  const { surveyors } = useSelector<AppState, AppState["surveyor"]>(
    (state) => state.surveyor
  );
  const { activeSurvey: active } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const list: Surveyor[] = surveyors;
  const survey: Survey = active;
  let arraySurveyors: string[] = [];

  survey && (arraySurveyors = survey.surveyors);

  const surveyorsFilter = list.filter((surveyor: Surveyor) =>
    arraySurveyors.includes(surveyor.email)
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, surveyorsFilter.length - page * rowsPerPage);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onDelete = async (email: string) => {
    const action = false;
    const newSurveyors = arraySurveyors.filter(
      (surveyor) => surveyor !== email
    );
    dispatch(activeSurvey({ ...survey, surveyors: newSurveyors }));
    dispatch(startAssignSurvey(survey.idSurvey, email, action));
  };

  const onClose = () => {
    dispatch(uiCloseModalEdit());
  };

  return (
    <Box>
      {surveyorsFilter.length > 0 ? (
        <ThemeProvider theme={theme}>
          <Box borderColor="grey.400" borderRadius={4} {...defaultProps}>
            <TableContainer component={Paper}>
              <Table
                className={classes.table}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <FormattedMessage id="AssignedSurveys" />{" "}
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="DocumentType" />{" "}
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="Document" />{" "}
                    </TableCell>
                    <TableCell align="center">
                      <FormattedMessage id="Delete" />{" "}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? surveyorsFilter.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : surveyorsFilter
                  ).map((surveyor) => (
                    <TableRow key={surveyor.document}>
                      <TableCell size="small" component="th" scope="row">
                        {surveyor.username}
                      </TableCell>
                      <TableCell style={{ width: 140 }}>
                        {surveyor.typeDoc}
                      </TableCell>
                      <TableCell style={{ width: 120 }}>
                        {surveyor.document}
                      </TableCell>
                      <TableCell size="small" align="center">
                        <Tooltip
                          title={`${intl.formatMessage({ id: "Delete" })}`}
                        >
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => onDelete(surveyor.email)}
                          >
                            {" "}
                            <DeleteOutlineOutlinedIcon />{" "}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 23 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[4]}
                      colSpan={6}
                      count={surveyorsFilter.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationAct}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </ThemeProvider>
      ) : (
        <Alert severity="info" color="info">
          <FormattedMessage id="NoAssignedSurveyors" />
        </Alert>
      )}

      <Box mt={2} display="flex" flexDirection="row-reverse">
        <Button
          className={clsx(classes.btn, classes.save)}
          autoFocus
          onClick={onClose}
        >
          <FormattedMessage id="Accept" />
        </Button>
        <Button className={clsx(classes.btn, classes.cancel)} onClick={onClose}>
          <FormattedMessage id="Cancel" />
        </Button>
      </Box>
    </Box>
  );
};
