import { firebase } from '../../config/firebase/firebase-config';
import { TypeUser } from '../../enums/enums';
import { getUserRole } from '../../services/firebase/auth';
import { types, IAuth } from '../types/types';
import { finishLoading, startLoading, uiOpenErrorAlert } from './uiActions';

export const startLoginCorreoPassword = ( email:string, password: string) => {

    return (dispatch: any) => {
        dispatch( startLoading() );

        firebase.auth().signInWithEmailAndPassword( email, password )
            .then( async({ user }) => {

                const { rol, municipio } = await getUserRole(user?.email);
                if(rol) {

                    if( rol === TypeUser.ADMIN || rol === TypeUser.SUPER_ADMIN) {
                        const userAuth = {
                            uid: user?.uid,
                            displayName: user?.displayName,
                            email: user?.email,
                            rol: rol,
                            municipio: municipio       
                        }
                        dispatch( login(userAuth) );
                        window.location.reload();
                    } else {
                        dispatch( uiOpenErrorAlert() );
                    }
                    dispatch( finishLoading() );
                } else {
                    dispatch( uiOpenErrorAlert() );
                }
                 
            })
            .catch( e => {
                dispatch( uiOpenErrorAlert() );
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
        rol: user.rol,
        municipio: user.municipio
    }
});

export const startLogout = () => {
    return async(dispatch: any) => {
        await firebase.auth().signOut();

        dispatch( logout() );

    }
};


export const logout = () => ({ type: types.logout });
