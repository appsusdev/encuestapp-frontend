import React, { useContext } from 'react';
import clsx from 'clsx';

import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import AppContext from '../../../context/AppContext';
import AppContextPropsType from '../../../types/AppContextPropsType';
import { LayoutType } from '../../../shared/constants/AppEnums';
import ContentView from '../ContentView/ContentView';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import useStyles from './layout.styles';

interface LayoutProps { }

const Layout: React.FC<LayoutProps> = () => {
  const { footer, themeStyle, layoutType, footerType } = useContext<
    AppContextPropsType
  >(AppContext);
  const classes = useStyles({ footer, themeStyle });

  return (
    <Box
      className={clsx(
        classes.appMain,
        layoutType === LayoutType.BOXED ? classes.boxedLayout : '',
        {
          appMainFooter: footer && footerType === 'fluid',
          appMainFixedFooter: footer && footerType === 'fixed',
        },
      )}>
      <Sidebar />

      <Box className={classes.mainContent}>
        <Hidden mdDown>
          <Box className={classes.mainContainer}>
            <Header />
            <ContentView />
          </Box>
        </Hidden>

        <Hidden lgUp>
          <Box className={classes.mainContainerFull}>
            <Header />
            <ContentView />
          </Box>
        </Hidden>
      </Box>
    </Box>
  );
};

export default Layout;
