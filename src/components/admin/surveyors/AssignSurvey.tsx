import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import clsx from 'clsx';

import { Box, Button, Grid, MenuItem, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Tooltip, IconButton, createMuiTheme, ThemeProvider, CircularProgress } from '@material-ui/core';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { TablePaginationAct } from '../../custom/TablePaginationAct';
import { useStyles } from '../../../shared/styles/useStyles';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducers/rootReducer';
import { Survey } from '../../../interfaces/Survey';
import { startAssignSurvey } from '../../../redux/actions/surveyorsActions';
import { Surveyor } from '../../../interfaces/Surveyor';
import { MyAlert } from '../../custom/MyAlert';
import { uiCloseSuccessAlert, uiCloseErrorAlert } from '../../../redux/actions/uiActions';
import { startLoadingCompleteSurveys } from '../../../redux/actions/surveysActions';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 13,
    },
});

const defaultProps = {
    bgcolor: 'background.paper',
    border: 1,
    style: { width: '100%', height: '100%' },
};


export const AssignSurvey = () => {
    const classes = useStyles();
    const intl = useIntl();
    const dispatch = useDispatch();

    const [survey, setSurvey] = useState('');
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [assign, setAssign] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const { municipios } = useSelector<AppState, AppState['auth']>(state => state.auth);
    const { dataSurveys } = useSelector<AppState, AppState['survey']>(state => state.survey);
    const { activeSurveyor } = useSelector<AppState, AppState['surveyor']>(state => state.surveyor);
    const { successAlert, errorAlert } = useSelector<AppState, AppState['ui']>(state => state.ui);
    let list: Survey[] = dataSurveys;
    const surveyor: Surveyor = activeSurveyor;
    let action: boolean = true;

    const surveysAssign = list.filter( (survey: Survey) => survey.surveyors.includes(surveyor.email));

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, surveysAssign.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSurvey(event.target.value as string);
    };

    const handleAssign = async() => {
        setLoading(true);
        setAssign(true);
        (survey.trim()) && await dispatch(startAssignSurvey(survey, surveyor.email, action));
        setLoading(false);
        municipios && await dispatch(startLoadingCompleteSurveys(municipios[0]));
    }

    const onDelete = async(id: string) => {
        action = false;
        setAssign(false);
        await dispatch( startAssignSurvey(id, surveyor.email, action));
        municipios && await dispatch(startLoadingCompleteSurveys(municipios[0]));
    }

    // Cerrar success alert
    const closeSuccess = () => {
        dispatch( uiCloseSuccessAlert() );
        dispatch( uiCloseErrorAlert() );
    }

    return (
        <Box m={1}>

            <Box mb={2}>
                <Grid container spacing={4}>

                    <Grid item xs={9} className={classes.typography}>
                        <label className="form-text"><FormattedMessage id='SelectSurvey' /></label>
                        <TextField
                            className={classes.inputSelect}
                            onChange={handleChange}
                            value={survey}
                            select
                            size="small"
                            variant="outlined"
                        >
                            {
                                list.map( survey => (
                                    <MenuItem key={survey.code} className={classes.typography} value={survey.code}>{survey.name}</MenuItem>
                                ))
                            }
                        </TextField>
                    </Grid>

                    <Grid item xs={3}>
                        {!loading ? (
                            <Button
                                autoFocus
                                className={clsx(classes.btnAction, classes.save)}
                                disabled={loading}
                                onClick={handleAssign}
                                size="medium"
                                style={{marginTop: '27px'}}
                                type="submit"
                            >
                                <FormattedMessage id="Assign" />
                            </Button>
                        ) : (
                            <Button
                                autoFocus
                                className={clsx(classes.btnAction, classes.save)}
                                disabled={true}
                                size="medium"
                                style={{marginTop: '27px'}}
                                type="button"
                            >
                                <CircularProgress className={classes.btnLoading} />
                            </Button>
                        )}
                    </Grid>

                </Grid>
            </Box>

            <ThemeProvider theme={theme}>
                <Box borderColor="grey.400" borderRadius={4} {...defaultProps}>

                    <TableContainer component={Paper} >
                        <Table className={classes.table} aria-label="custom pagination table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><FormattedMessage id="AssignedSurveys" /> </TableCell>
                                    <TableCell align="center"><FormattedMessage id="Delete" /> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? surveysAssign.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : surveysAssign
                                ).map((survey) => (

                                    <TableRow key={survey.name}>
                                        <TableCell size="small" component="th" scope="row">
                                            {survey.name}
                                        </TableCell>
                                        <TableCell size="small" align="center">
                                            <Tooltip title={`${intl.formatMessage({ id: 'Delete' })}`} >
                                                <IconButton aria-label="expand row" size="small" onClick={() => onDelete(survey.code)}> <DeleteOutlineOutlinedIcon /> </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>

                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 43 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[3]}
                                        colSpan={6}
                                        count={surveysAssign.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: { 'aria-label': 'rows per page' },
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

            <MyAlert open={successAlert} typeAlert="success" message={(assign) ? "AssignedSurvey" : "SurveyDeleted"} time={2000} handleClose={closeSuccess}/>
            <MyAlert open={errorAlert} typeAlert="error" message="ErrorAssignedSurvey" time={2000} handleClose={closeSuccess}/>
            {/* <MyAlert open={modalAlert} typeAlert="success" message="SurveyDeleted" time={2000} handleClose={closeSuccess}/>  */}

        </Box >
    )
}
