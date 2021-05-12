import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import settingsReducer from './settingsReducer';
import { uiReducer } from "./uiReducer";
import { surveyorsReducer } from './surveyorsReducer';
import { surveysReducer } from './surveysReducer';
import { searchReducer } from './searchReducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    setting: settingsReducer,
    ui: uiReducer,
    surveyor: surveyorsReducer,
    survey: surveysReducer,
    search: searchReducer,
    // TODO: Demás reducers
});

export type AppState = ReturnType<typeof rootReducer>;