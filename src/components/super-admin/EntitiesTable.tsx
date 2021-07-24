import { createMuiTheme, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, ThemeProvider } from '@material-ui/core';
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers/rootReducer';
import { EntitiesType } from '../../redux/types/types';
import { useStyles } from '../../shared/styles/useStyles';
import { TablePaginationAct } from '../custom/TablePaginationAct';
import { EntitiesBody } from './EntitiesBody';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
});

export const EntitiesTable = () => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const {entities:ENTITIES} = useSelector((state:AppState) => state.entities);
    const {data,value} = useSelector((state:AppState) => state.search);
    const list: EntitiesType = ENTITIES;

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
            <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table" style={{ tableLayout: "auto" }}>
                    <TableHead>
                        <TableRow >
                            <TableCell><FormattedMessage id="NameEntity" /> </TableCell>
                            <TableCell><FormattedMessage id="Department" /> </TableCell>
                            <TableCell><FormattedMessage id="Town" /> </TableCell>
                            <TableCell><FormattedMessage id="Nit" /> </TableCell>
                            <TableCell align="center"><FormattedMessage id="State" /> </TableCell>
                            <TableCell align="center"><FormattedMessage id="Actions" /> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(!value.trim()) ?
                            (rowsPerPage > 0
                                ? list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : list
                            ).map((entity) => (
                                <EntitiesBody key={entity.nit} entity={entity} />
                            ))
                            :
                            (data) &&
                            (rowsPerPage > 0
                                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : data
                            ).map((entity) => (
                                <EntitiesBody key={entity.nit} entity={entity} />
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
    )
}
