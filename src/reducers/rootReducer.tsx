import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import settingsReducer from './settingsReducer';


export const rootReducer = combineReducers({
    auth: authReducer,
    setting: settingsReducer
    // TODO: Demás reducers
});

export type AppState = ReturnType<typeof rootReducer>;