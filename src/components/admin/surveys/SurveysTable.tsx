import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { createMuiTheme, Paper, Table, TableCell, TableContainer, TableFooter, TablePagination, TableRow, TableHead, ThemeProvider, TableBody } from '@material-ui/core';
import { TablePaginationAct } from '../../custom/TablePaginationAct';
import { useStyles } from '../../../shared/styles/useStyles';
import { SurveysBody } from './SurveysBody';

const surveys = [
    { code: '111ABC', name: 'LEVANTAMIENTO DE LÍNEA BASE', creationDate: "15/04/2021", state: true },
    { code: '222ABC', name: 'CREACIÓN DE POBLACIÓN VICTIMA', creationDate: "15/04/2021", state: false },
];

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
});

export const SurveysTable = () => {

    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, surveys.length - page * rowsPerPage);

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
                            <TableCell><FormattedMessage id="CreationDate" /> </TableCell>
                            <TableCell align="center"><FormattedMessage id="State" /> </TableCell>
                            <TableCell align="center"><FormattedMessage id="Actions" /> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? surveys.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : surveys
                        ).map((survey) => (
                            <SurveysBody key={survey.code} {...survey}/>
                            // <SurveyorsBody key={surveyor.username} {...surveyor}/>

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
                                count={surveys.length}
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