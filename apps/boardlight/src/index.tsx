import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './State';
import { Provider } from 'react-redux';
import register from './Helpers/Console';
// import reportWebVitals from './reportWebVitals';

export const VERSION = '1.0.0';

const root = createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <App />
    </Provider>,
);

register();

// reportWebVitals(console.log);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
