import { TableCell, TableRow } from "@material-ui/core";
import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { db } from "../../config/firebase/firebase-config";
import {
  setActiveEntity,
  updateEntity,
} from "../../redux/actions/entitiesActions";
import {
  uiOpenAlert,
  uiOpenModalEdit,
} from "../../redux/actions/uiActions";
import { IEntity } from "../../redux/types/types";
import { CustomizedIcons } from "../custom/CustomizedIcons";
import { AntSwitch } from "../custom/CustomizedSwitch";
interface Props {
  entity: IEntity;
}
export const EntitiesBody: FC<Props> = ({ entity }) => {
  const [state, setState] = useState({
    checkedA: entity.activo,
  });
  const dispatch = useDispatch();
  // Función para cambiar estado
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    const check = event.target.checked;

    // Actualizacion en BD
    await db
      .collection("Usuarios")
      .doc(entity.nit)
      .set({ activo: check }, { merge: true });
    //Actualizar la lista de las entidades
    dispatch(updateEntity({ ...entity, activo: check }));
    dispatch(uiOpenAlert());
  };

  const onEdit = () => {
    dispatch(setActiveEntity(entity));
    dispatch(uiOpenModalEdit());
  };
 /*  const onDelete = () => {
    dispatch(uiOpenModalDelete());
  }; */
  return (
    <>
      <TableRow key={entity.nit}>
        <TableCell
          component="th"
          scope="row"
          style={{ width: 170, textTransform: "capitalize" }}
        >
          {entity.razonSocial}
        </TableCell>
        <TableCell style={{ width: 160 }}>{entity.departamento}</TableCell>
        <TableCell style={{ width: 120 }}>{entity.municipio}</TableCell>
        <TableCell style={{ width: 160 }}>{entity.nit}</TableCell>
        <TableCell style={{ width: 30 }} align="center">
          <AntSwitch
            checked={state.checkedA}
            name="checkedA"
            onChange={handleChange}
          />
        </TableCell>
        <TableCell style={{ width: 130 }} align="center">
          <CustomizedIcons
            editIcon
            //deleteIcon
            onEdit={onEdit}
            //onDelete={onDelete}
          />
        </TableCell>
      </TableRow>
    </>
  );
};
