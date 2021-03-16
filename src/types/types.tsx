export const types = {
    login: '[Auth] Login',
    logout: '[Auth] Logout'
}

export interface IAuth {
    uid: string,
    name: string,
    email: string,
}

export type AuthAction = {
    type: string,
    payload: IAuth
}