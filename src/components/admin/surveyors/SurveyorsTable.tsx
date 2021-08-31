import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import {
  Box,
  createMuiTheme,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  ThemeProvider,
  TableBody,
} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { SurveyorsBody } from "./SurveyorsBody";
import { TablePaginationAct } from "../../custom/TablePaginationAct";
import { useStyles } from "../../../shared/styles/useStyles";
import { AppState } from "../../../redux/reducers/rootReducer";
import { Surveyor } from "../../../interfaces/Surveyor";
import { Colors } from "../../../shared/constants/Colors";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Poppins",
    fontSize: 13,
  },
});

export const SurveyorsTable = () => {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { surveyors } = useSelector<AppState, AppState["surveyor"]>(
    (state) => state.surveyor
  );
  const { data, value } = useSelector<AppState, AppState["search"]>(
    (state) => state.search
  );
  const list: Surveyor[] = surveyors;
  let count: number = 0;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, list.length - page * rowsPerPage);

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

  if (!value.trim()) {
    count = list.length;
  } else {
    if (data) {
      count = data.length;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        {list.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ height: 200 }}
            className={classes.title}
          >
            <InfoOutlinedIcon style={{ fontSize: 30, color: Colors.ACCENT }} />
            <FormattedMessage id={"NoRegisteredSurveyors"} />
          </Box>
        ) : (
          <Table
            className={classes.table}
            aria-label="custom pagination table"
            style={{ tableLayout: "auto" }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="Name" />{" "}
                </TableCell>
                <TableCell>
                  <FormattedMessage id="DocumentType" />{" "}
                </TableCell>
                <TableCell>
                  <FormattedMessage id="Identification" />{" "}
                </TableCell>
                <TableCell>
                  <FormattedMessage id="Email" />{" "}
                </TableCell>
                <TableCell align="center">
                  <FormattedMessage id="State" />{" "}
                </TableCell>
                <TableCell align="center">
                  <FormattedMessage id="Actions" />{" "}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!value.trim()
                ? (rowsPerPage > 0
                    ? list.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : list
                  ).map((surveyor: Partial<Surveyor>) => (
                    <SurveyorsBody key={surveyor.email} {...surveyor} />
                  ))
                : data &&
                  (rowsPerPage > 0
                    ? data.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : data
                  ).map((surveyor) => (
                    <SurveyorsBody key={surveyor.email} {...surveyor} />
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
                  rowsPerPageOptions={[5]}
                  colSpan={6}
                  count={count}
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
        )}
      </TableContainer>
    </ThemeProvider>
  );
};
