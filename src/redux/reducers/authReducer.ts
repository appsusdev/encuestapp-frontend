import { AuthAction, IAuth, types } from '../types/types';

const initialState = {
    uid: '',
    displayName: '',
    email: '',
    rol: '',
    municipios: []
}

export const authReducer = ( state: Partial<IAuth> = initialState, action: AuthAction) => {
    switch (action.type) {
        case types.login:
            return {
                uid: action.payload.uid,
                displayName: action.payload.displayName,
                email: action.payload.email, 
                rol: action.payload.rol,
                municipios: action.payload.municipios,
            }
        
        case types.logout:
            return { }
    
        default:
            return state;
    }
}