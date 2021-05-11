import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import clsx from 'clsx';

import { Box, Grid, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Tooltip, IconButton, createMuiTheme, ThemeProvider, Button } from '@material-ui/core';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { TablePaginationAct } from '../../custom/TablePaginationAct';
import { CustomizedSearch } from '../../custom/CustomizedSearch';
import { uiCloseModalEdit } from '../../../redux/actions/uiActions';
import { useStyles } from '../../../shared/styles/useStyles';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 13,
    },
});

const defaultProps = {
    bgcolor: 'background.paper',
    style: { width: '100%', height: '100%' },
};

const surveyors = [
    { name: 'Encuestador 1', typeDoc: 'CC', document: 1061715070 },
    { name: 'Encuestador 2', typeDoc: 'CC', document: 1061715071 },
    { name: 'Encuestador 2', typeDoc: 'CC', document: 1061715072 },
]

export const SurveyorsData = () => {
    const classes = useStyles();
    const intl = useIntl();
    const dispatch = useDispatch();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, surveyors.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onDelete = () => {
        console.log('Eliminar encuesta');
    }

    const onClose = () => {
        dispatch( uiCloseModalEdit() );
    }

    return (
        <Box >

            <Grid container>
                <Grid item xs={8}>
                    <Box mb={2}>
                        <CustomizedSearch />
                    </Box>
                </Grid>
            </Grid>

            <ThemeProvider theme={theme}>
                <Box borderColor="grey.400" borderRadius={4} {...defaultProps}>

                    <TableContainer component={Paper} >
                        <Table className={classes.table} aria-label="custom pagination table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><FormattedMessage id="AssignedSurveys" /> </TableCell>
                                    <TableCell><FormattedMessage id="DocumentType" /> </TableCell>
                                    <TableCell><FormattedMessage id="Document" /> </TableCell>
                                    <TableCell align="center"><FormattedMessage id="Delete" /> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? surveyors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : surveyors
                                ).map((surveyor) => (

                                    <TableRow key={surveyor.document}>
                                        <TableCell size="small" component="th" scope="row">
                                            {surveyor.name}
                                        </TableCell>
                                        <TableCell style={{ width: 140 }}>
                                            {surveyor.typeDoc}
                                        </TableCell>
                                        <TableCell style={{ width: 120 }}>
                                            {surveyor.document}
                                        </TableCell>
                                        <TableCell size="small" align="center">
                                            <Tooltip title={`${intl.formatMessage({ id: 'Delete' })}`}>
                                                <IconButton aria-label="expand row" size="small" onClick={onDelete}> <DeleteOutlineOutlinedIcon /> </IconButton>
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
                                        count={surveyors.length}
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

            <Box mt={2} display="flex" flexDirection="row-reverse">
                <Button className={clsx(classes.btn, classes.save)} autoFocus onClick={onClose}>
                    <FormattedMessage id="Accept" />
                </Button>
                <Button className={clsx(classes.btn, classes.cancel)} onClick={onClose}>
                    <FormattedMessage id="Cancel" />
                </Button>
            </Box>

        </Box >
    )
}
