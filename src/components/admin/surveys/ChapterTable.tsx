import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { TablePaginationAct } from '../../custom/TablePaginationAct';
import { useStyles } from '../../../shared/styles/useStyles';
import { AppState } from '../../../redux/reducers/rootReducer';
import { Chapter, Survey } from '../../../interfaces/Survey';
import { CustomizedIcons } from '../../custom/CustomizedIcons';
import { chapterActive, startDeleteChapter } from '../../../redux/actions/surveysActions';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
});

const defaultProps = {
    style: { width: '100%', height: '100%' },
};

export const ChapterTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { surveys, activeSurvey } = useSelector<AppState, AppState['survey']>(state => state.survey);
    const surveysDB: Survey[] = surveys;
    const surveyActive: Survey = activeSurvey;
    let surveyFilter: Survey[] = [];
    let list: Chapter[] = [];

    if (surveysDB && activeSurvey) {
        surveyFilter = surveysDB.filter( survey => survey.idSurvey === surveyActive.idSurvey);
        list = surveyFilter[0].chapters;
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);

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

    const onDelete = (idChapter: string) => {
        dispatch(startDeleteChapter(surveyActive.idSurvey, idChapter));
    }

    const onEdit = (chapter: any) => {
        dispatch( chapterActive(chapter));
    }

    return (
        <Box mt={2}>

            {  
                (list.length > 0)
                &&

                <ThemeProvider theme={theme}>
                    <Box {...defaultProps}>

                        <TableContainer component={Paper} >
                            <Table className={classes.table} aria-label="custom pagination table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '10%' }}><FormattedMessage id="Number" /> </TableCell>
                                        <TableCell style={{ width: '70%' }}><FormattedMessage id="ChapterName" /> </TableCell>
                                        <TableCell style={{ width: '20%' }}><FormattedMessage id="Actions" /> </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : list
                                    ).map((chapter) => (

                                        <TableRow key={chapter.id}>
                                            <TableCell size="small" component="th" scope="row">
                                                {chapter.number}
                                            </TableCell>
                                            <TableCell style={{ width: 140 }}>
                                                {chapter.name}
                                            </TableCell>
                                            <TableCell size="small" align="center">
                                                <CustomizedIcons editIcon deleteIcon onEdit={() => onEdit(chapter)} onDelete={() => onDelete(chapter.id)}/>
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
                                            rowsPerPageOptions={[2]}
                                            colSpan={6}
                                            count={list.length}
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
            }

        </Box >
    )
}
