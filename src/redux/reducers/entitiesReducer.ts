import {
  EntitiesAction,
  EntitiesState,
  EntitiesType,
  IEntities,
  types,
} from "../types/types";
const initialState: EntitiesState = {
  entities: [],
  entityActive: null,
};
export const entitiesReducer = (
  state = initialState,
  action: EntitiesAction
): EntitiesState => {
  const { type, payload } = action;
  switch (type) {
    case types.entitiesLoad:
      return {
        ...state,
        entities: payload as EntitiesType,
      };

    case types.purgeEntities:
      return {
        entities: [],
        entityActive: null,
      };
    case types.setActiveEntity:
        return{
            ...state,
            entityActive:payload as IEntities
        }
    case types.purgeActiveEntity:
        return {
            ...state,
            entityActive:null
        }

    default:
      return state;
  }
};
