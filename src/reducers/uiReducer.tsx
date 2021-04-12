import { IUi, types, UiAction } from '../types/types';

const initialState = {
    modalAddOpen: false,
    modalEditOpen: false,
    modalDeleteOpen: false,
    modalAssignOpen: false,
}

export const uiReducer = ( state: IUi = initialState, action: UiAction) => {
    switch (action.type) {
        case types.uiOpenModalAdd:
            return {
                ...state,
                modalAddOpen: true
            }
        
        case types.uiCloseModalAdd:
            return {
                ...state,
                modalAddOpen: false
            }

        case types.uiOpenModalEdit:
            return {
                ...state,
                modalEditOpen: true
            }
        
        case types.uiCloseModalEdit:
            return {
                ...state,
                modalEditOpen: false
            }

        case types.uiOpenModalDelete:
            return {
                ...state,
                modalDeleteOpen: true
            }
        
        case types.uiCloseModalDelete:
            return {
                ...state,
                modalDeleteOpen: false
            }

        case types.uiOpenModalAssign:
            return {
                ...state,
                modalAssignOpen: true
            }
        
        case types.uiCloseModalAssign:
            return {
                ...state,
                modalAssignOpen: false
            }

        default:
            return state;
    }
}