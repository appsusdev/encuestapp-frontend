import { useField } from 'formik';
import { TextField } from '@material-ui/core';

export const MyTextField = (props: any) => {
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : '';
    return (
        <TextField
            size="small"
            {...props}
            {...field}
            onChange={(e:any)=>  console.log(e.target.files[0])}
            helperText={errorText}
            error={!!errorText}
            autoComplete="off"
        />
    );
};