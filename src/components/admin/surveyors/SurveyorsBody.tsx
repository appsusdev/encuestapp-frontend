import { useState } from "react";

import { TableCell, TableRow } from "@material-ui/core";
import { CustomizedIcons } from "../../custom/CustomizedIcons";
import { AntSwitch } from "../../custom/CustomizedSwitch";
import { Surveyor } from "../../../interfaces/Surveyor";
import { useDispatch } from "react-redux";
import {
  uiOpenModalEdit,
  uiOpenModalAssign,
  uiOpenAlert,
  uiOpenModalAlert,
} from "../../../redux/actions/uiActions";
import {
  activeSurveyors,
  updateSurveyor,
} from "../../../redux/actions/surveyorsActions";
import { db } from "../../../config/firebase/firebase-config";
import { uiOpenModalDelete } from "../../../redux/actions/uiActions";

export const SurveyorsBody = (surveyor: Partial<Surveyor>) => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    checkedA: surveyor.state,
  });

  // Función para cambiar estado
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    const check = event.target.checked;

    // Actualizacion en BD
    await db
      .collection("Usuarios")
      .doc(surveyor.email)
      .set({ activo: check }, { merge: true });
    dispatch(updateSurveyor({ ...surveyor, state: check }));
    dispatch(uiOpenAlert());
  };

  const onEdit = () => {
    dispatch(activeSurveyors(surveyor.email, surveyor));
    dispatch(uiOpenModalEdit());
  };

  const onAssign = () => {
    dispatch(activeSurveyors(surveyor.email, surveyor));
    if (surveyor.state) {
      dispatch(uiOpenModalAssign());
    } else {
      dispatch(uiOpenModalAlert());
    }
  };

  const onDelete = () => {
    dispatch(uiOpenModalDelete());
  };

  return (
    <>
      <TableRow key={surveyor.username}>
        <TableCell
          component="th"
          scope="row"
          style={{ width: 170, textTransform: "capitalize" }}
        >
          {surveyor.username}
        </TableCell>
        <TableCell style={{ width: 160 }}>{surveyor.typeDoc}</TableCell>
        <TableCell style={{ width: 120 }}>{surveyor.document}</TableCell>
        <TableCell style={{ width: 160 }}>{surveyor.email}</TableCell>
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
            assignIcon
            deleteIcon
            onEdit={onEdit}
            onAssign={onAssign}
            onDelete={onDelete}
          />
        </TableCell>
      </TableRow>
    </>
  );
};
