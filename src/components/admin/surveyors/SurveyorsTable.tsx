import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { createMuiTheme, Paper, Table, TableCell, TableContainer, TableFooter, TablePagination, TableRow, TableHead, ThemeProvider, TableBody } from '@material-ui/core';
import { SurveyorsBody } from './SurveyorsBody';
import { TablePaginationAct } from '../../custom/TablePaginationAct';
import { useStyles } from '../../../shared/styles/useStyles';
import { AppState } from '../../../redux/reducers/rootReducer';
import { Surveyor } from '../../../interfaces/Surveyor';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
});

export const SurveyorsTable = () => {

    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const { surveyors } = useSelector<AppState, AppState['surveyor']>(state => state.surveyor);
    const { data, value } = useSelector<AppState, AppState['search']>(state => state.search);
    const list: Surveyor[] = surveyors;
    let count: number = 0;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, list.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if(!value.trim()) {
        count = list.length;
    } else {
        if(data) { count = data.length };
    }

    return (
        <ThemeProvider theme={theme}>
            <TableContainer component={Paper} >
                <Table className={classes.table} aria-label="custom pagination table" style={{ tableLayout: "auto" }}>
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
                        {(!value.trim()) ?
                            (rowsPerPage > 0
                                ? list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : list
                            ).map((surveyor) => (
                                <SurveyorsBody key={surveyor.email} {...surveyor} />
                            ))
                            :
                            (data) &&
                            (rowsPerPage > 0
                                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : data
                            ).map((surveyor) => (
                                <SurveyorsBody key={surveyor.email} {...surveyor} />
                            ))
                        }
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
                                count={count}
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