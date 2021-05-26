import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TableCell, TableRow } from '@material-ui/core';
import { CustomizedIcons } from '../../custom/CustomizedIcons';
import { AntSwitch } from '../../custom/CustomizedSwitch';
import { db } from '../../../config/firebase/firebase-config';
import { convertDate } from '../../../helpers/convertDate';
import { Survey } from '../../../interfaces/Survey';
import { uiOpenModalEdit, uiOpenModalAssign, uiOpenAlert, uiOpenModalDelete } from '../../../redux/actions/uiActions';
import { activeSurvey, startLoadingSurveys } from '../../../redux/actions/surveysActions';
import { AppState } from '../../../redux/reducers/rootReducer';

export const SurveysBody = (survey: Partial<Survey>) => {

    const dispatch = useDispatch();
    const { municipios } = useSelector<AppState, AppState['auth']>(state => state.auth);
    const [state, setState] = useState({
        checkedA: survey.state
    });
    const date = convertDate(survey.creationDate);

    // Función para cambiar estado
    const handleChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [ event.target.name ]: event.target.checked});
        const check = event.target.checked;

        // Actualizacion en BD
        await db.collection('Municipios').doc(survey.idTown).collection('Encuestas').doc(survey.idSurvey).set({activo: check}, {merge: true});
        
        dispatch( uiOpenAlert() );
        (municipios) && await dispatch(startLoadingSurveys(municipios[0])); 
    };

    const onEdit = () => {
        dispatch( activeSurvey(survey));
        dispatch( uiOpenModalEdit() );
    }

    const onQuestion = () => {
        dispatch( activeSurvey(survey));
        dispatch( uiOpenModalAssign() );
    }

    const onChapter = () => {
        dispatch( activeSurvey(survey));
        dispatch( uiOpenModalDelete() );
    }

    return (
        <>
            <TableRow key={survey.code}>
                <TableCell component="th" scope="row">
                    {survey.name}
                </TableCell>
                <TableCell style={{ width: 220 }} align="center">
                    {date}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                    <AntSwitch checked={state.checkedA} name="checkedA" onChange={handleChange} />
                </TableCell>
                <TableCell style={{ width: 200 }} align="center">
                    <CustomizedIcons editIcon deleteIcon chapterIcon questionIcon onEdit={onEdit} onQuestion={onQuestion} onChapter={onChapter}/>
                </TableCell>
            </TableRow>
        </>
    )
}
