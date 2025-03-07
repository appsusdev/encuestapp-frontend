import { GenderEnum, TypeDocEnum } from "../enums/enums";

export interface ICitizen {
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  segundoNombre: string;
  tipoIdentificacion: TypeDocEnum | string;
  identificacion: string;
  telefono: string;
  correo: string;
  fechaNacimiento: string;
  genero: GenderEnum;
}
export type CitizensType = ICitizen[];

export interface IMap {
  lat: number;
  lng: number;
  zoom: number;
}