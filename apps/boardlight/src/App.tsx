import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './CSS/style.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from '@nextui-org/react';
import { createTheme } from 'react-data-table-component';
import useToken from './Hooks/useToken';
import useThemePrefs from './Hooks/useThemePrefs';
import GlobalListeners from './Boot/GlobalListeners';
import AppBootstrapProvider, { AppBootstrapContext } from './Boot/AppBootstrapProvider';
import { BlueboardClientInit } from 'blueboard-client-react';
import CheckBlueboard from './Boot/CheckBlueboard';

const [BlueboardProvider] = BlueboardClientInit(
    process.env.REACT_APP_BLUEBOARD_URL as string,
    process.env.REACT_APP_BLUEBOARD_SOKETI_HOST as string,
    process.env.REACT_APP_BLUEBOARD_SOKETI_KEY as string,
    true,
);

const ToasterContainer = (): JSX.Element => {
    const theme = useTheme();

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={true}
                gutter={8}
                containerStyle={{ zIndex: '2147483647' }}
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 5000,
                    style: {
                        background:
                            theme.type === 'dark'
                                ? theme.palette.accents_2
                                : theme.palette.background,
                        color: theme.palette.text,
                    },
                }}
            />
        </>
    );
};

const ProviderStack = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const theme = useThemePrefs();
    const token = useToken();
    return (
        <ThemeProvider theme={{ type: theme.isDark ? 'dark' : 'light' }}>
            <BlueboardProvider token={token}>
                <CheckBlueboard>
                    <AppBootstrapProvider>
                        <ToasterContainer />
                        <GlobalListeners />
                        {children}
                    </AppBootstrapProvider>
                </CheckBlueboard>
            </BlueboardProvider>
        </ThemeProvider>
    );
};
const UIBootstrap = (): JSX.Element => {
    const canShow: boolean = React.useContext(AppBootstrapContext);

    // Table themes
    // Dark, uses NextUI colors
    createTheme('dark', {
        text: {
            primary: '#fff',
            secondary: '#0070f3',
        },
        background: {
            default: '#111',
        },
        highlightOnHover: {
            default: '#333',
            text: '#fff',
        },
        context: {
            background: '#7928ca',
            text: '#FFFFFF',
        },
        divider: {
            default: '#333',
        },
        button: {
            default: '#0070f3',
            hover: 'rgba(0,0,0,.08)',

            focus: 'rgba(255,255,255,.12)',

            disabled: 'rgba(255, 255, 255, .34)',
        },
        sortFocus: {
            default: '#0070f3',
        },
    });

    // Light, uses NextUI colors
    createTheme('light', {
        text: {
            primary: '#333',
            secondary: '#0070f3',
        },
        background: {
            default: '#fff',
        },
        highlightOnHover: {
            default: '#eaeaea',
            text: '#333',
        },
        context: {
            background: '#7928ca',
            text: '#FFFFFF',
        },
        divider: {
            default: '#eaeaea',
        },
        button: {
            default: '#0070f3',
            hover: 'rgba(0,0,0,.08)',

            focus: 'rgba(255,255,255,.12)',

            disabled: 'rgba(255, 255, 255, .34)',
        },
        sortFocus: {
            default: '#0070f3',
        },
    });

    return (
        <>
            {canShow ? (
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            ) : null}
        </>
    );
};

const App = (): JSX.Element => {
    return (
        <ProviderStack>
            <UIBootstrap />
        </ProviderStack>
    );
};

export default App;
