import React, { useState } from "react";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";

import {
  Box,
  Button,
  Grid,
  TextField,
  createMuiTheme,
  ThemeProvider,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@material-ui/core";
import { useStyles } from "../../../shared/styles/useStyles";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useSelector } from "react-redux";
import { TablePagination, TableFooter } from "@material-ui/core";
import { CitizensType, ICitizen } from "../../../interfaces/Citizens";
import { TablePaginationAct } from "../../custom/TablePaginationAct";
import { Alert } from "@material-ui/lab";
import { Link } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Poppins",
    fontSize: 14,
  },
});

export const Home = () => {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [existsCitizens, setExistsCitizens] = useState(true);
  const [list, setList] = useState<ICitizen[] | []>([]);
  const [valid, setValid] = useState(true);
  const { citizens } = useSelector<AppState, AppState["citizens"]>(
    (state) => state.citizens
  );
  let array: CitizensType = citizens;

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

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
  };

  const handleSearch = () => {
    if (value.length >= 3) {
      if (array.length > 0) {
        setValid(true);
        const newData = array.filter((data) => {
          let search = "";

          const firstName = data.primerNombre.toUpperCase();
          const secondName = data.segundoNombre.toUpperCase();
          const firstLastName = data.primerApellido.toUpperCase();
          const secondLastName = data.segundoApellido.toUpperCase();
          const doc = data.identificacion;
          search =
            firstName +
            " " +
            secondName +
            " " +
            firstLastName +
            " " +
            secondLastName +
            " " +
            doc;

          const valueSearch = value.toUpperCase();
          return search.indexOf(valueSearch) > -1;
        });

        if (newData.length === 0) {
          setExistsCitizens(false);
          setList([]);
        } else {
          setExistsCitizens(true);
          const idCitizens: string[] = [];
          newData.forEach((citizen) => idCitizens.push(citizen.identificacion));

          console.log(idCitizens);
          setList(newData);
        }
      }
    } else {
      setValid(false);
      setList([]);
    }
  };

  const handlePress = (e: any) => {
    if (e.code === "Enter") {
      handleSearch();
    }
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
                  <FormattedMessage id="SearchCitizen" />:
                </label>
                <TextField
                  className={classes.inputSelect}
                  onChange={handleChange}
                  onKeyPress={handlePress}
                  size="small"
                  variant="outlined"
                />
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
              {!valid && (
                <Box
                  mt={-1}
                  ml={2}
                  mb={2}
                  style={{ fontSize: 12, color: "red" }}
                >
                  *<FormattedMessage id="CitizensField" />*
                </Box>
              )}
            </Grid>
          </Box>
        </Box>
      </Paper>
      <Box style={{ marginTop: "50px" }}>
        {list.length > 0 && (
          <ThemeProvider theme={theme}>
            <TableContainer component={Paper}>
              <Table
                className={classes.table}
                aria-label="custom pagination table"
                style={{ tableLayout: "auto" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <FormattedMessage id="FirstName" />{" "}
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="SecondName" />{" "}
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="FirstLastName" />{" "}
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="SecondLastName" />{" "}
                    </TableCell>
                    <TableCell>TD</TableCell>
                    <TableCell>
                      <FormattedMessage id="Document" />{" "}
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="Surveys" />{" "}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? list.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : list
                  ).map((citizen, index) => (
                    <TableRow key={index} className={classes.capitalize}>
                      <TableCell component="th" scope="row">
                        {citizen.primerNombre.toLowerCase()}
                      </TableCell>
                      <TableCell>
                        {citizen.segundoNombre.toLowerCase()}
                      </TableCell>
                      <TableCell>
                        {citizen.primerApellido.toLowerCase()}
                      </TableCell>
                      <TableCell>
                        {citizen.segundoApellido.toLowerCase()}
                      </TableCell>
                      <TableCell>
                        {citizen.tipoIdentificacion === "1" && "CC"}
                        {citizen.tipoIdentificacion === "2" && "TI"}
                        {citizen.tipoIdentificacion === "3" && "CE"}
                        {citizen.tipoIdentificacion === "4" && "RC"}
                        {citizen.tipoIdentificacion === "NIT" && "NIT"}
                        {citizen.tipoIdentificacion === "Otro" && "Otro"}
                      </TableCell>
                      <TableCell>{citizen.identificacion}</TableCell>
                      <TableCell>
                        <Link component="button">
                          <FormattedMessage id="SeeSurveys" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[3]}
                      colSpan={6}
                      count={list.length}
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
          </ThemeProvider>
        )}
        {!existsCitizens && (
          <Alert severity="info" color="info">
            <FormattedMessage id="CitizenNotFound" />
          </Alert>
        )}
      </Box>
    </>
  );
};
