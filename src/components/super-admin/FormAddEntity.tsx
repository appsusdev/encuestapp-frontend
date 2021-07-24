import React, { FC, useEffect, useState } from "react";
import Axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import { IEntity } from "../../redux/types/types";
import { useStyles } from "../../shared/styles/useStyles";
import * as yup from "yup";
import { MyTextField } from "../custom/MyTextField";
import { TextField } from "@material-ui/core";
import clsx from "clsx";
import { registerWithEmailPassword } from "../../services/firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  uiCloseModalAdd,
  uiOpenErrorAlert,
  uiOpenSuccessAlert,
} from "../../redux/actions/uiActions";
import {
  purgeActiveEntity,
  startAddNewEntity,
} from "../../redux/actions/entitiesActions";
import { addNewEntity } from "../../services/firebase/entities";
import { AppState } from "../../redux/reducers/rootReducer";
interface ILocationData {
  departamento: string;
  c_digo_dane_del_departamento: string;
  municipio: string;
  c_digo_dane_del_municipio: string;
}
interface EntityFormProps {
  edit?: boolean;
}
export const FormAddEntity: FC<EntityFormProps> = ({ edit = false }) => {
  const [departmentSelected, setDepartmentSelected] = useState<string>("");
  const [departments, setDepartments] = useState<ILocationData[]>([]);
  const [municipioSelected, setMunicipioSelected] = useState<string>("");
  const [filteredTowns, setFilteredTowns] = useState<ILocationData[]>([]);
  const { entityActive } = useSelector((state: AppState) => state.entities);
  const [initialValues, setInitialValues] = useState<Partial<IEntity>>({
    razonSocial: "",
    nit: "",
    direccion: "",
    celular: "",
    departamento: "", //CONSULYTAR AL API LOS DEPARTAMENTOS Y SELECCIONAR ANTIOQUIA POR DEFECTO
    municipio: "",
    codigoSigep: "",
    codigoDane: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    identificacion: "",
  });
  const dispatch = useDispatch();
  const intl = useIntl();
  const classes = useStyles();

  const validationSchema = yup.object({
    razonSocial: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    nit: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`)
      .min(6, `${intl.formatMessage({ id: "MinimumPassword" })}`),
    direccion: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    celular: yup
      .number()
      .typeError(`${intl.formatMessage({ id: "NumericValue" })}`)
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    primerNombre: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    primerApellido: yup
      .string()
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    email: yup
      .string()
      .email(`${intl.formatMessage({ id: "InvalidEmail" })}`)
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
    identificacion: yup
      .number()
      .typeError(`${intl.formatMessage({ id: "NumericValue" })}`)
      .required(`${intl.formatMessage({ id: "RequiredFile" })}`),
  });

  useEffect(() => {
    //MADAR PETICION AL API DE LOS DEPARTAMENTOS Y MUNICIPIOS
    Axios.get(
      "https://www.datos.gov.co/resource/xdk5-pm3f.json?$select=departamento&$group=departamento&$order=departamento%20ASC"
    )
      .then((response) => {
        const { data } = response;
        setDepartments(data);
        return data;
        //setDepartmentSelected(data[0].departamento);
      })
      .then((data) => {
        if (edit && entityActive) {
          const {
            departamento,

            municipio,
          } = entityActive;
          setDepartmentSelected(departamento);
          setMunicipioSelected(municipio);
          setInitialValues({ ...entityActive });
        } else {
          setDepartmentSelected(data[0].departamento);
        }
      });
  }, []);

  useEffect(() => {
    if (departmentSelected.length > 0) {
      Axios.get(
        `https://www.datos.gov.co/resource/xdk5-pm3f.json?$select=departamento,c_digo_dane_del_departamento,municipio,c_digo_dane_del_municipio&$where=departamento=%27${departmentSelected}%27`
      ).then(async (response) => {
        const { data } = response;
        await setFilteredTowns(data);
        setMunicipioSelected(data[0].municipio);
      });
    }
  }, [departmentSelected]);
  const handleCreateEntity = async (entity: IEntity) => {
    const { email, identificacion } = entity;
    console.log("AGREGANDO...");

    try {
      //crear el usuario
      await registerWithEmailPassword(email, identificacion.toString());
      //agregarlo a la bd
      //crear la collection del municipio que se acaba de crear con los datos del admin y el departamento al cual pertenece
      const { ok } = await addNewEntity(entity);
      //agregarlo al state del redux

      if (ok) {
        dispatch(startAddNewEntity({ ...entity, activo: true }));
        dispatch(purgeActiveEntity());
        dispatch(uiCloseModalAdd());
        dispatch(uiOpenSuccessAlert());
      }
    } catch (error) {
      console.log(error);
      dispatch(uiOpenErrorAlert());
    }
  };

  return (
    <Box m={1}>
      <Formik
        enableReinitialize
        validateOnChange
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={(values, { setSubmitting }) => {
          //setSubmitting(true);
          /* if (!noValid) {
              setEmail(values.email);
              values.profileImage = profileFile;
              await dispatch(startNewSurveyor(values));
              setSubmitting(false);
            } else {
              setSubmitting(false);
            } */

          console.log("ENTRA SUBMIT-----------------");
          console.log(values);
          values.departamento = departmentSelected;
          values.municipio = municipioSelected;
          handleCreateEntity(values as IEntity);
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className={classes.input}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="BusinessName" />*
                </label>
                <MyTextField
                  name="razonSocial"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>
              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="Nit" />*
                </label>
                <MyTextField
                  name="nit"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>
              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="Address" />*
                </label>
                <MyTextField
                  name="direccion"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>
              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="Phone" />*
                </label>
                <MyTextField
                  name="celular"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>
              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="Department" />
                </label>
                <TextField
                  size="small"
                  name="departamento"
                  variant="outlined"
                  select
                  value={departmentSelected}
                  onChange={(e: any) => setDepartmentSelected(e.target.value)}
                  className={classes.myTextFieldRoot}
                  autoComplete="off"
                >
                  {departments.map((department) => (
                    <MenuItem
                      key={department.departamento}
                      value={department.departamento}
                    >
                      <p>{department.departamento}</p>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="Town" />
                </label>
                <TextField
                  size="small"
                  name="municipio"
                  variant="outlined"
                  select
                  value={municipioSelected}
                  onChange={(e: any) => setMunicipioSelected(e.target.value)}
                  className={classes.myTextFieldRoot}
                >
                  {filteredTowns.map((town) => (
                    <MenuItem key={town.municipio} value={town.municipio}>
                      <p>{town.municipio}</p>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* DATOS DEL ADMIN */}
              <Grid item xs={12}>
                <h4>{<FormattedMessage id="SystemAdmin" />}</h4>
                <Divider light />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="FirstName" />*
                </label>
                <MyTextField
                  name="primerNombre"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="SecondName" />
                </label>
                <MyTextField
                  name="segundoNombre"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="FirstLastName" />*
                </label>
                <MyTextField
                  name="primerApellido"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>

              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="SecondLastName" />
                </label>
                <MyTextField
                  name="segundoApellido"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>
              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="Email" />*
                </label>
                <MyTextField
                  name="email"
                  variant="outlined"
                  className={classes.myTextFieldRoot}
                />
              </Grid>
              <Grid item xs={6}>
                <label className="form-text">
                  <FormattedMessage id="DocumentNumber" />*
                </label>
                <MyTextField
                  name="identificacion"
                  variant="outlined"
                  type="number"
                  className={classes.myTextFieldRoot}
                />
              </Grid>
              <Box mt={2} display="flex">
                {!isSubmitting ? (
                  <Button
                    className={clsx(classes.btn, classes.save)}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="Save" />
                  </Button>
                ) : (
                  <Button
                    className={clsx(classes.btn, classes.save)}
                    autoFocus
                    type="button"
                    disabled={true}
                  >
                    <CircularProgress className={classes.btnLoading} />
                  </Button>
                )}
                <Button
                  className={clsx(classes.btn, classes.cancel)}
                  onClick={() => dispatch(uiCloseModalAdd())}
                >
                  <FormattedMessage id="Cancel" />
                </Button>
              </Box>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
