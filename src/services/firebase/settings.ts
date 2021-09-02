import { db } from "../../config/firebase/firebase-config";
import { InitialPoint } from "../../hooks/useMapbox";

// Actualizar coordenadas del municipio
export const updateMapData = async (nit: string, coords: InitialPoint) => {
  const { lng, lat, zoom } = coords;
  await db
    .collection("Entidades")
    .doc(nit)
    .set({ lng, lat, zoom }, { merge: true });
};
