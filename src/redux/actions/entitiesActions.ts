import { loadAllEntities } from "../../services/firebase/entities";
import { EntitiesAction, types, EntitiesType, IEntity } from "../types/types";

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
export const setActiveEntity = (entity: IEntity): EntitiesAction => ({
  type: types.setActiveEntity,
  payload: entity,
});
export const purgeActiveEntity = (): EntitiesAction => ({
  type: types.purgeActiveEntity,
});
export const startAddNewEntity = (entity: IEntity): EntitiesAction => ({
  type: types.addNewEntity,
  payload: entity,
});
export const deleteEntity = (nit: string): EntitiesAction => ({
  type: types.deleteEntity,
  payload: nit,
});
export const updateEntity = (entity: IEntity): EntitiesAction => ({
  type: types.updateEntity,
  payload: entity,
});
