import React from 'react';
import AppContextPropsType from '../types/AppContextPropsType';
import defaultConfig from './defaultConfig';

export default React.createContext<AppContextPropsType>(defaultConfig);
