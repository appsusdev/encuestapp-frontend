import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Box from '@material-ui/core/Box';
import AppContext from '../../../context/AppContext';
import AppContextPropsType from '../../../types/AppContextPropsType';
import { DashboardRouter } from '../../../router/DashboardRouter';
import { RouteTransition } from '../../../shared/constants/AppEnums';
import Scrollbar from '../Scrollbar/Scrollbar';

interface TransitionWrapperProps {
  children: any;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children }) => {
  const { rtAnim } = useContext<AppContextPropsType>(AppContext);
  const location = useLocation();
  if (rtAnim === RouteTransition.NONE) {
    return <>{children}</>;
  }
  return (
    <TransitionGroup appear enter exit>
      <CSSTransition
        key={location.key}
        timeout={{ enter: 300, exit: 300 }}
        classNames={rtAnim}>
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

const ContentView = () => {
  return (
    <Scrollbar >
      <Box
        className='content'
        display='flex'
        flex={1}
        flexDirection='column'>
        <TransitionWrapper><DashboardRouter /></TransitionWrapper>
      </Box>
    </Scrollbar>
  );
};

export default ContentView;
