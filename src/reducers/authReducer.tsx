import { AuthAction, IAuth, types } from '../types/types';

const initialState = {
    uid: '123',
    name: 'Natalia Meneses',
    email: 'nmeneses8@gmail.com'
}

export const authReducer = ( state: IAuth = initialState, action: AuthAction) => {
    switch (action.type) {
        case types.login:
            return {
                uid: action.payload.uid,
                name: action.payload.name,
                email: action.payload.email
            }
        
        case types.logout:
            return {}
    
        default:
            return state;
    }
}