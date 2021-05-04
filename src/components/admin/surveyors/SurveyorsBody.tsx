import { useState } from 'react';

import { TableCell, TableRow } from '@material-ui/core';
import { CustomizedIcons } from '../../custom/CustomizedIcons';
import { AntSwitch } from '../../custom/CustomizedSwitch';
import { Surveyor } from '../../../interfaces/Surveyor';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModalEdit, uiOpenModalDelete, uiOpenModalAssign, uiOpenSuccessAlert } from '../../../redux/actions/uiActions';
import { activeSurveyors, startLoadingSurveyors } from '../../../redux/actions/surveyorsActions';
import { db } from '../../../config/firebase/firebase-config';
import { AppState } from '../../../redux/reducers/rootReducer';

export const SurveyorsBody = (surveyor: Partial<Surveyor>) => {

    const dispatch = useDispatch();
    const { municipios } = useSelector<AppState, AppState['auth']>(state => state.auth);

    const [state, setState] = useState({
        checkedA: surveyor.state
    });

    // Función para cambiar estado
    const handleChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [ event.target.name ]: event.target.checked});
        console.log(surveyor.email);
        
        await db.collection('Usuarios').doc(surveyor.email).update({activo: !state.checkedA})
        dispatch( uiOpenSuccessAlert() );
        if(municipios) {
            dispatch( startLoadingSurveyors(municipios[0]));
        }
    };

    const onEdit = () => {
        dispatch( activeSurveyors(surveyor.email, surveyor));
        dispatch( uiOpenModalEdit() );
    }

    const onDelete = () => {
        dispatch( uiOpenModalDelete() );
    }

    const onAssign = () => {
        dispatch( uiOpenModalAssign() );
    }

    return (
        <>
            <TableRow key={surveyor.username}>
                <TableCell component="th" scope="row" style={{ width: 170, textTransform: 'capitalize' }}>
                    {(surveyor.username)}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                    {surveyor.typeDoc}
                </TableCell>
                <TableCell style={{ width: 120 }}>
                    {surveyor.document}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                    {surveyor.email}
                </TableCell>
                <TableCell style={{ width: 30 }} align="center">
                    <AntSwitch id={surveyor.id} checked={surveyor.state} name="checkedA" onChange={handleChange} />
                </TableCell>
                <TableCell style={{ width: 130 }} align="center">
                    <CustomizedIcons editIcon deleteIcon assignIcon onEdit={onEdit} onDelete={onDelete} onAssign={onAssign}/>
                </TableCell>
            </TableRow>
        </>
    )
}
