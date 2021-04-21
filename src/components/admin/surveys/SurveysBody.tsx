import { useState } from 'react';

import { TableCell, TableRow } from '@material-ui/core';
import { CustomizedIcons } from '../../custom/CustomizedIcons';
import { AntSwitch } from '../../custom/CustomizedSwitch';
import { useDispatch } from 'react-redux';
import { Survey } from '../../../interfaces/Survey';
import { uiOpenModalEdit, uiOpenModalAssign } from '../../../actions/ui';

export const SurveysBody = (survey: Partial<Survey>) => {

    const dispatch = useDispatch();

    const [state, setState] = useState({
        checkedA: survey.state
    });

    // Función para cambiar estado
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [ event.target.name ]: event.target.checked});
         // TODO: Actualizar en bd  
    };

    const onEdit = () => {
        dispatch( uiOpenModalEdit() );
    }

    const onQuestion = () => {
        dispatch( uiOpenModalAssign() );
    }

    // const onDelete = () => {
    //     dispatch( uiOpenModalDelete() );
    // }

    return (
        <>
            <TableRow key={survey.code}>
                <TableCell component="th" scope="row">
                    {survey.name}
                </TableCell>
                <TableCell style={{ width: 220 }}>
                    {survey.creationDate}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                
                    <AntSwitch checked={state.checkedA} name="checkedA" onChange={handleChange} />
                </TableCell>
                <TableCell style={{ width: 200 }} align="center">
                    <CustomizedIcons editIcon deleteIcon chapterIcon questionIcon onEdit={onEdit} onQuestion={onQuestion}/>
                </TableCell>
            </TableRow>
        </>
    )
}
