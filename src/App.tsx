import { FC } from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl'

import { store } from './store/store';
import { AppRouter } from './router/AppRouter';
import messages_es from './translations/es.json';
import messages_en from './translations/en.json';

import './styles/app.scss';

const App: FC = () => {

  let messages = {};
  const currentLocale = navigator.language.split(/[-_]/)[0];

  (currentLocale === 'es') ? messages = messages_es : messages = messages_en;
    
  return (
    <Provider store={store}>
      <IntlProvider locale={currentLocale} messages={messages} >
        <AppRouter/>
      </IntlProvider>
    </Provider>
  );
}

export default App;