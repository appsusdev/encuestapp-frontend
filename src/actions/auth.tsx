import { firebase } from '../config/firebase/firebase-config';
import { getUserRole } from '../services/auth/auth';
import { types, IAuth, TypeUser } from '../types/types';
import { finishLoading, startLoading, uiOpenAlert } from './ui';

export const startLoginCorreoPassword = ( email:string, password: string) => {

    return (dispatch: any) => {
        dispatch( startLoading() );

        firebase.auth().signInWithEmailAndPassword( email, password )
            .then( async({ user }) => {

                const { rol } = await getUserRole(user?.email);
                 
                if( rol === TypeUser.ADMIN || rol === TypeUser.SUPER_ADMIN) {
                    const userAuth = {
                        uid: user?.uid,
                        displayName: user?.displayName,
                        email: user?.email,
                        rol: rol
                    }
                    dispatch( login(userAuth) );
                } else {
                    dispatch( uiOpenAlert() );
                }
                dispatch( finishLoading() );
            })
            .catch( e => {
                dispatch( uiOpenAlert() );
                dispatch( finishLoading() );
            });
    }
};

export const login = (user: IAuth) => ({
    type: types.login,
    payload: {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        rol: user.rol
    }
});

export const startLogout = () => {
    return async(dispatch: any) => {
        await firebase.auth().signOut();

        dispatch( logout() );

    }
};


export const logout = () => ({ type: types.logout });
