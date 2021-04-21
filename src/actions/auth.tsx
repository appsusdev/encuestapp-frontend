import { firebase } from '../config/firebase/firebase-config';
import { types, IAuth } from '../types/types';
import Swal from 'sweetalert2';
import { finishLoading, startLoading } from './ui';

export const startLoginCorreoPassword = ( email:string, password: string) => {

    return (dispatch: any) => {
        dispatch( startLoading() );

        firebase.auth().signInWithEmailAndPassword( email, password )
            .then( ({ user }) => {
                const userAuth = {
                    uid: user?.uid,
                    displayName: user?.displayName,
                    email: user?.email
                }

                dispatch( login(userAuth));
                dispatch( finishLoading() );
            })
            .catch( e => {
                Swal.fire({title: 'Error!', text: 'Correo o contraseña incorrectos'});
                dispatch( finishLoading() );
            });
    }
};

const login = (user: IAuth) => ({
    type: types.login,
    payload: {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email
    }
});

export const logout = () => ({ type: types.logout });
