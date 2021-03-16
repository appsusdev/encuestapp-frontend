import { Provider } from 'react-redux';

import { store } from './store/store';
import { UsersScreen } from './pages/poll/UsersScreen';
import './styles/app.scss';

const App = () => {
  return (
    <Provider store={store}>
      <UsersScreen/>
    </Provider>
  );
}

export default App;
