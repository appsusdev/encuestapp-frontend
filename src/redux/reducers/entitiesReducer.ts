import {
  EntitiesAction,
  EntitiesState,
  EntitiesType,
  IEntity,
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
            entityActive:payload as IEntity
        }
    case types.purgeActiveEntity:
        return {
            ...state,
            entityActive:null
        }
      case types.addNewEntity:
        return {
          ...state,
          entities:[payload as IEntity ,...state.entities]
        }
      case types.deleteEntity:{
        return{
          ...state,
          entities:state.entities.filter(entity=> entity.nit !== payload)
        }
      }
      case types.updateEntity:
        let newEntities = [...state.entities];
        const indexEntity = newEntities.findIndex(entity=> entity.nit === (payload as IEntity).nit);
        if(indexEntity !== -1){
          newEntities[indexEntity] = payload as IEntity
        }
        return{
          ...state,
          entities: [...newEntities]
        }

    default:
      return state;
  }
};
