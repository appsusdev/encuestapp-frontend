import { useState } from 'react';

import { TableCell, TableRow } from '@material-ui/core';
import { CustomizedIcons } from '../../custom/CustomizedIcons';
import { AntSwitch } from '../../custom/CustomizedSwitch';
import { Surveyor } from '../../../models/Surveyor';
import { useDispatch } from 'react-redux';
import { uiOpenModalEdit, uiOpenModalDelete, uiOpenModalAssign } from '../../../actions/ui';

export const SurveyorsBody = (surveyor: Partial<Surveyor>) => {

    const dispatch = useDispatch();

    const [state, setState] = useState({
        checkedA: surveyor.state
    });

    // Función para cambiar estado
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [ event.target.name ]: event.target.checked});
         // TODO: Actualizar en bd  
    };

    const onEdit = () => {
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
                <TableCell component="th" scope="row">
                    {surveyor.username}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                    {surveyor.typeDoc}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                    {surveyor.document}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                    {surveyor.email}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                
                    <AntSwitch checked={state.checkedA} name="checkedA" onChange={handleChange} />
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                    <CustomizedIcons editIcon deleteIcon assignIcon onEdit={onEdit} onDelete={onDelete} onAssign={onAssign}/>
                </TableCell>
            </TableRow>
        </>
    )
}
