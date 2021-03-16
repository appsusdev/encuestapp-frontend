import { Provider } from 'react-redux';

import { store } from './store/store';
import { Home } from './pages/Home';
import './styles/app.scss';

const App = () => {
  return (
    <Provider store={store}>
      <Home/>
    </Provider>
  );
}

export default App;
