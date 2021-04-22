import { IUi, types, UiAction } from '../types/types';

const initialState = {
    modalAddOpen: false,
    modalEditOpen: false,
    modalDeleteOpen: false,
    modalAssignOpen: false,
    loading: false,
    alert: false
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
        
        case types.uiStartLoading:
            return {
                ...state,
                loading: true
            }

        case types.uiFinishLoading:
            return {
                ...state,
                loading: false
            }

        case types.uiOpenAlert:
            return {
                ...state,
                alert: true
            }

        case types.uiCloseAlert:
            return {
                ...state,
                alert: false
            }
    

        default:
            return state;
    }
}