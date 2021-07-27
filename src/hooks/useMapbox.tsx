import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useCallback } from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoibmF0YWxpYW04IiwiYSI6ImNraWprMjFzazAwbmkyenU2empiNWR2NXYifQ.FBcmRw4_j_sPvaMxpn7a1g";

export interface InitialPoint {
  lng: number;
  lat: number;
  zoom: number;
}

export const useMapbox = (initialPoint: InitialPoint, showMarker: boolean) => {
  //Referencia al DIV del mapa
  const mapDiv = useRef() as React.MutableRefObject<HTMLInputElement>;
  const setRef = useCallback((node) => {
    mapDiv.current = node;
  }, []);

  // Referencia a los marcadores
  // let markers: any[] = [];
  const [markers, setMarkers] = useState<any[]>([]);

  // Mapa y coords
  const [coords, setCoords] = useState(initialPoint);
  const map = useRef() as React.MutableRefObject<mapboxgl.Map>;

  const removeMarkers = () => {
    markers.forEach( marker => marker.remove());
    setMarkers([])
  }

  //  Funcion para agregar marcadores
  const addMarker = useCallback((ev) => {
    const { lat, lng } = ev;
    if (lat && lng) {
      const marker = new mapboxgl.Marker();

      marker.setLngLat([lng, lat]).addTo(map.current).setDraggable(true);

      setMarkers(oldMarkers => [...oldMarkers,marker]);
    }
  }, []);
  // console.log(markers)

  useEffect(() => {
    const mapConfig = new mapboxgl.Map({
      container: mapDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [initialPoint.lng, initialPoint.lat],
      zoom: initialPoint.zoom,
    });

    map.current = mapConfig;
  }, [initialPoint]);

  // Cuando se mueve el mapa
  useEffect(() => {
    map.current?.on("move", () => {
      const { lng, lat } = map.current.getCenter();
      setCoords({
        lng: parseFloat(lng.toFixed(4)),
        lat: parseFloat(lat.toFixed(4)),
        zoom: parseFloat(map.current.getZoom().toFixed(2)),
      });
    });
  }, []);

  // Agregar marcadores
  useEffect(() => {
    if (showMarker) {
      map.current?.on("load", () => {
        const marker = new mapboxgl.Marker();

        marker
          .setLngLat([coords.lng, coords.lat])
          .addTo(map.current)
          .setDraggable(true);

        markers.push(marker);
      });
    } 
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!showMarker) {
      map.current?.on("data", addMarker);
    }
  }, [addMarker,showMarker]);


  return { coords, setRef, addMarker, removeMarkers };
};
