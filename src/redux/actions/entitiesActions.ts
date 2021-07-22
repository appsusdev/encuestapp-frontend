import { loadAllEntities } from "../../services/firebase/entities";
import { EntitiesAction, types, EntitiesType, IEntities } from "../types/types";

const loadEntities = (entities: EntitiesType): EntitiesAction => ({
  type: types.entitiesLoad,
  payload: entities,
});
export const startLoadEntities = () => {
  return async (dispatch: any) => {
    //consultar todos los usuarios admin de la bd
    const Entities = await loadAllEntities();
    dispatch(loadEntities(Entities as EntitiesType));
  };
};
export const setActiveEntity = (entity: IEntities): EntitiesAction => ({
  type: types.setActiveEntity,
  payload: entity,
});
export const purgeActiveEntity = (): EntitiesAction => ({
  type: types.purgeActiveEntity,
});
