import { types, IAuth } from '../types/types';

export const login = (user: IAuth) => ({
    type: types.login,
    payload: user
    
});

export const logout = () => ({ type: types.logout });
