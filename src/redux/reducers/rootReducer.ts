import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import settingsReducer from './settingsReducer';
import { uiReducer } from "./uiReducer";
import { surveyorsReducer } from './surveyorsReducer';


export const rootReducer = combineReducers({
    auth: authReducer,
    setting: settingsReducer,
    ui: uiReducer,
    surveyor: surveyorsReducer
    // TODO: Demás reducers
});

export type AppState = ReturnType<typeof rootReducer>;