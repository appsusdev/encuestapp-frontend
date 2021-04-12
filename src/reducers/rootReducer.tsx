import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import settingsReducer from './settingsReducer';
import { uiReducer } from "./uiReducer";


export const rootReducer = combineReducers({
    auth: authReducer,
    setting: settingsReducer,
    ui: uiReducer,
    // TODO: Demás reducers
});

export type AppState = ReturnType<typeof rootReducer>;