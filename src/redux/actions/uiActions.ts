import { TypeUser } from '../../enums/enums';
import { types } from '../types/types';

export const uiOpenModalAdd = () => ({ type: types.uiOpenModalAdd });

export const uiCloseModalAdd = () => ({ type: types.uiCloseModalAdd });

export const uiOpenModalEdit = () => ({ type: types.uiOpenModalEdit });

export const uiCloseModalEdit = () => ({ type: types.uiCloseModalEdit });

export const uiOpenModalDelete = () => ({ type: types.uiOpenModalDelete });

export const uiCloseModalDelete = () => ({ type: types.uiCloseModalDelete });

export const uiOpenModalAssign = () => ({ type: types.uiOpenModalAssign });

export const uiCloseModalAssign = () => ({ type: types.uiCloseModalAssign });

export const uiOpenModalAlert = () => ({ type: types.uiOpenModalAlert });

export const uiCloseModalAlert = () => ({ type: types.uiCloseModalAlert });

export const startLoading = () => ({ type: types.uiStartLoading });

export const finishLoading = () => ({ type: types.uiFinishLoading });

export const uiOpenAlert = () => ({ type: types.uiOpenAlert });

export const uiCloseAlert = () => ({ type: types.uiCloseAlert });

export const uiOpenSuccessAlert = () => ({ type: types.uiOpenSuccessAlert });

export const uiCloseSuccessAlert = () => ({ type: types.uiCloseSuccessAlert });

export const uiOpenErrorAlert = () => ({ type: types.uiOpenErrorAlert });

export const uiCloseErrorAlert = () => ({ type: types.uiCloseErrorAlert });

export const uiOpenQuestion = () => ({ type: types.uiOpenQuestion });

export const uiCloseQuestion = () => ({ type: types.uiCloseQuestion });


export const uiChangeRole = (role: TypeUser) => ({ 
    type: types.uiChangeRole,
    payload: role
});