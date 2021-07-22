import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, InputBase }from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { valueSearched, arraySearch } from '../../redux/actions/searchActions';
import { convertDate } from '../../helpers/convertDate';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: "100%",
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
}));

interface PropsSearch {
    data?: any[],
}

export const CustomizedSearch = (props: PropsSearch) => {

    const classes = useStyles();
    const intl = useIntl();
    const dispatch = useDispatch();
    const { data } = props;
    let array = data;

    useEffect(() => {
        dispatch(valueSearched(''));
        dispatch(arraySearch([]));
    }, [dispatch]);
        
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = event.target.value;
        dispatch( valueSearched(searchText));
        
        if( searchText.length > 0 ){
            if(array){
                const newData = array.filter( data => {
                    let search = '';
                    // Surveys
                    if(data.name) {
                        const name = data.name.toUpperCase();
                        const date = convertDate(data.creationDate);
                        search = name+" "+date;
                    }

                    // Surveyors
                    if(data.username) {
                        const username = data.username.toUpperCase();
                        const email = data.email.toUpperCase();
                        const doc = data.document;
                        search = username+" "+email+" "+doc;
                    }
                    //ENTITIES
                    if(data.nit){
                        const razonSocial = data.razonSocial.toUpperCase();
                        const departamento = data.departamento.toUpperCase()
                        search = data.nit+" "+razonSocial+" "+departamento
                    }
                    const value = searchText.toUpperCase();
                    return search.indexOf(value) > -1;
                });
                dispatch( arraySearch(newData));  
            }
        } else {
            dispatch( arraySearch([]));  
        }
    }
    return (
        <Paper className={classes.root}>
            <InputBase
                className={classes.input}
                placeholder={`${intl.formatMessage({ id: 'Search'})} ...`}
                inputProps={{ 'aria-label': 'search' }}
                onChange={ handleInputChange }
            />
            <IconButton className={classes.iconButton} aria-label='search'>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}