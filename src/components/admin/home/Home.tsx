import React from 'react';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';

import { Box, Button, Grid, TextField, createMuiTheme, ThemeProvider, TableContainer, Table, TableHead, Paper, TableRow, TableCell, TableBody, Divider } from '@material-ui/core';
import { useStyles } from '../../../shared/styles/useStyles';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
});

const citizens = [
    { firstName: 'Karen', secondName: 'Cristina', firstLastName: 'Gomez', secondLastName: 'Munoz', typeDocument: 'CC', document: 10617874772, encuestas: {name: 'Encuesta 1'} },
]

export const Home = () => {

    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        console.log(event.target.value as string);
    };

    const handleSearch = () => {

    }

    return (
        <>

        <Divider variant="fullWidth"/>
        <Paper square className={classes.paper}>
            <Box m={2} mb={2}>

            <Box mb={2}>
                <Grid container spacing={4}>

                    <Grid item xs={9} className={classes.typography}>
                        <label className="form-text"><FormattedMessage id='SelectSurvey' /></label>
                        <TextField
                            className={classes.inputSelect}
                            onChange={handleChange}
                            size="small"
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Button size="medium" className={clsx(classes.btnAction, classes.save)} onClick={handleSearch}>
                            <FormattedMessage id='Search' />
                        </Button>
                    </Grid>

                </Grid>
            </Box>
                                </Box>

            <Box m={2} style={{marginTop: '30px'}}>
                                <ThemeProvider theme={theme}>

                    <TableContainer component={Paper} square>
                        <Table className={classes.table} aria-label="custom pagination table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><FormattedMessage id="FirstName" /> </TableCell>
                                    <TableCell><FormattedMessage id="SecondName" /> </TableCell>
                                    <TableCell><FormattedMessage id="FirstLastName" /> </TableCell>
                                    <TableCell><FormattedMessage id="SecondLastName" /> </TableCell>
                                    <TableCell>TD</TableCell>
                                    <TableCell><FormattedMessage id="Document" /> </TableCell>
                                    <TableCell><FormattedMessage id="Surveys" /> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {citizens.map((citizen) => (

                                    <TableRow key={citizen.firstName}>
                                        <TableCell component="th" scope="row">
                                            {citizen.firstName}
                                        </TableCell>
                                        <TableCell  >
                                            {citizen.secondName}
                                        </TableCell>
                                        <TableCell >
                                            {citizen.firstLastName}
                                        </TableCell>
                                        <TableCell >
                                            {citizen.secondLastName}
                                        </TableCell>
                                        <TableCell >
                                            {citizen.typeDocument}
                                        </TableCell>
                                        <TableCell >
                                            {citizen.document}
                                        </TableCell>
                                        <TableCell >
                                            {citizen.encuestas.name}
                                        </TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                            
                    </TableContainer>
            </ThemeProvider>
            </Box>

            <Box style={{marginTop: '30px'}}></Box>
                                </Paper >
                {/* <Box borderColor="grey.400" borderRadius={4} {...defaultProps}> */}
                {/* </Box> */}

        </>
    )
}
