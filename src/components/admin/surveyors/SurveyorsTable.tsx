import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { createMuiTheme, Paper, Table, TableCell, TableContainer, TableFooter, TablePagination, TableRow, TableHead, ThemeProvider, TableBody } from '@material-ui/core';
import { SurveyorsBody } from './SurveyorsBody';
import { TablePaginationAct } from '../../custom/TablePaginationAct';
import { useStyles } from '../../../shared/styles/useStyles';

const surveyors = [
    { username: 'Usuario 1', typeDoc: 'CC', document: "1061787572", email: 'test1@gmail.com', state: true },
    { username: 'Usuario 2', typeDoc: 'CC', document: "1061787572", email: 'test2@gmail.com', state: false },
    { username: 'Usuario 3', typeDoc: 'CC', document: "1061787572", email: 'test3@gmail.com', state: false },
    { username: 'Usuario 4', typeDoc: 'CC', document: "1061787572", email: 'test4@gmail.com', state: true },
    { username: 'Usuario 5', typeDoc: 'CC', document: "1061787572", email: 'test5@gmail.com', state: false },
    { username: 'Usuario 6', typeDoc: 'CC', document: "1061787572", email: 'test6@gmail.com', state: true },
];

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
});

export const SurveyorsTable = () => {

    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);

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

    return (
        <ThemeProvider theme={theme}>
            <TableContainer component={Paper} >
                <Table className={classes.table} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow >
                            <TableCell><FormattedMessage id="Name" /> </TableCell>
                            <TableCell><FormattedMessage id="DocumentType" /> </TableCell>
                            <TableCell><FormattedMessage id="Identification" /> </TableCell>
                            <TableCell><FormattedMessage id="Email" /> </TableCell>
                            <TableCell align="center"><FormattedMessage id="State" /> </TableCell>
                            <TableCell align="center"><FormattedMessage id="Actions" /> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? surveyors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : surveyors
                        ).map((surveyor) => (

                            <SurveyorsBody key={surveyor.username} {...surveyor}/>

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
                                rowsPerPageOptions={[4]}
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
        </ThemeProvider>

    );
}