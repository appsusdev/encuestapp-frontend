import { Surveyor } from "../../interfaces/Surveyor";
import { SurveyorsAction, types } from "../types/types";
const initialState = {
  surveyors: [],
  activeSurveyor: null,
  assignedSurveys: [],
  surveyorFromDB: null,
  surveysTransmitted: [],
  infoSurveysTransmitted: [],
  idResponsibleCitizens: [],
};

export const surveyorsReducer = (
  state = initialState,
  action: SurveyorsAction
) => {
  switch (action.type) {
    case types.surveyorAddNew:
      return {
        ...state,
        surveyors: [...state.surveyors, action.payload],
      };

    case types.surveyorUpdated:
      return {
        ...state,
        surveyors: state.surveyors.map((surveyor: Partial<Surveyor>) =>
          surveyor.id === action.payload.id ? action.payload : surveyor
        ),
      };
    case types.surveyorFromDB:
      return {
        ...state,
        surveyorFromDB: { ...action.payload },
      };

    case types.surveyorsLoad:
      return {
        ...state,
        surveyors: [...action.payload],
      };

    case types.surveyorActive:
      return {
        ...state,
        activeSurveyor: {
          ...action.payload,
        },
      };

    case types.surveyorCleanActive:
      return {
        ...state,
        activeSurveyor: null,
      };

    case types.surveyorsLoadAssignedSurveys:
      return {
        ...state,
        assignedSurveys: [...action.payload],
      };

    case types.surveyorsAddNewAssignedSurveys:
      return {
        ...state,
        assignedSurveys: [...state.assignedSurveys, action.payload],
      };

    case types.surveyorsDeleteAssignedSurveys:
      return {
        ...state,
        assignedSurveys: state.assignedSurveys.filter(
          (data: any) => data.id !== action.payload
        ),
      };

    case types.surveyorsUpdatedAssignedSurveys:
      return {
        ...state,
        assignedSurveys: state.assignedSurveys.map(
          (surveyAssigned: Partial<Surveyor>) =>
            surveyAssigned.id === action.payload.id
              ? action.payload
              : surveyAssigned
        ),
      };

    case types.surveyorsTransmittedSurveys:
      return {
        ...state,
        surveysTransmitted: [...action.payload],
      };

    case types.surveyorsInfoTransmittedSurveys:
      return {
        ...state,
        infoSurveysTransmitted: [...action.payload],
      };

    case types.surveyorsIdResponsibleCitizens:
      return {
        ...state,
        idResponsibleCitizens: [...action.payload],
      };

    case types.surveyorDelete:
      return {
        ...state,
        surveyors: state.surveyors.filter(
          (surveyor: Surveyor) => surveyor.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
