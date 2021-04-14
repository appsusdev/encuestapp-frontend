import { useState } from 'react';
import clsx from 'clsx';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, Button, Grid, makeStyles, MenuItem, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Tooltip, IconButton, createMuiTheme, ThemeProvider } from '@material-ui/core';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { Fonts } from '../../../shared/constants/AppEnums';
import { TablePaginationAct } from '../../custom/TablePaginationAct';

const useStyles = makeStyles(() => ({
    inputSelect: {
        width: '100%',
        marginTop: 8,
    },
    btn: {
        width: '100%',
        fontWeight: Fonts.REGULAR,
        textTransform: 'capitalize',
        color: 'white',
        fontSize: 14,
        marginTop: '30px',
        borderRadius: '4px'
    },
    save: {
        background: '#0A8FDC',
        '&:hover': {
            background: '#0A6DDC'
        }
    },
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
    table: {
        minWidth: 500,
    },
}));

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 13,
    },
});

const defaultProps = {
    bgcolor: 'background.paper',
    // m: 1,
    border: 1,
    style: { width: '100%', height: '100%' },
};

const surveys = [
    { name: 'Caracterización población victima 2020' },
    { name: 'Línea Base agropecuaria 2021' }
]

export const AssignSurvey = () => {
    const classes = useStyles();
    const intl = useIntl();

    const [survey, setSurvey] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);

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

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSurvey(event.target.value as string);
    };

    const handleAssign = () => {
        console.log(survey);
    }

    const onDelete = () => {
        console.log('Eliminar encuesta');
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
                            <MenuItem className={classes.typography} value={10}>Caracterización población victima 2020</MenuItem>
                            <MenuItem className={classes.typography} value={20}>Linea Base Agropecuaria 2021</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={3}>
                        <Button size="medium" className={clsx(classes.btn, classes.save)} onClick={handleAssign}>
                            <FormattedMessage id='Assign' />
                        </Button>
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
                                    ? surveys.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : surveys
                                ).map((survey) => (

                                    <TableRow key={survey.name}>
                                        <TableCell size="small" component="th" scope="row">
                                            {survey.name}
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
                </Box>
            </ThemeProvider>

        </Box >
    )
}
