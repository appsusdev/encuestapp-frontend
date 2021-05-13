import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { createMuiTheme, Paper, Table, TableCell, TableContainer, TableFooter, TablePagination, TableRow, TableHead, ThemeProvider, TableBody } from '@material-ui/core';
import { TablePaginationAct } from '../../custom/TablePaginationAct';
import { useStyles } from '../../../shared/styles/useStyles';
import { SurveysBody } from './SurveysBody';
import { AppState } from '../../../redux/reducers/rootReducer';
import { Survey } from '../../../interfaces/Survey';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
});

export const SurveysTable: FC = () => {

    const classes = useStyles();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const { surveys } = useSelector<AppState, AppState['survey']>(state => state.survey);
    const { data, value } = useSelector<AppState, AppState['search']>(state => state.search);
    let list: Survey[] = surveys;
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
                <Table className={classes.table} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow >
                            <TableCell><FormattedMessage id="Name" /> </TableCell>
                            <TableCell align="center"><FormattedMessage id="CreationDate" /> </TableCell>
                            <TableCell align="center"><FormattedMessage id="State" /> </TableCell>
                            <TableCell align="center"><FormattedMessage id="Actions" /> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(!value.trim()) ?
                            (rowsPerPage > 0
                                ? list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : list
                            ).map((survey) => (
                                <SurveysBody key={survey.code} {...survey}/>
                            ))
                            :
                            (data) &&
                            (rowsPerPage > 0
                                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : data
                            ).map((survey) => (
                                <SurveysBody key={survey.code} {...survey}/>
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