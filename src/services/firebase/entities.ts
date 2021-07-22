import { db } from "../../config/firebase/firebase-config";
import { TypeUser } from "../../enums/enums";
import { EntitiesType, IEntities } from "../../redux/types/types";


export const loadAllEntities = ():Promise<EntitiesType | []>=>{
    return db.collection('Usuarios').where('rol','==',TypeUser.ADMIN).get().then(snapShot=>{
        let Response:EntitiesType | [] = []
        snapShot.forEach(doc=>{
            Response = [...Response,(doc.data() as IEntities)]
        });
        return Response;
    })
}