import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./CSS/style.css";

import * as React from "react";

import { ThemeProvider, useTheme } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";

import BlueboardClientProvider from "./Providers/BlueboardClientProvider";
import { BlueboardControlException } from "blueboard-client";
import { BrowserRouter } from "react-router-dom";
import GlobalListeners from "./Boot/GlobalListeners";
import Loading from "react-fullscreen-loading";
import Routes from "./Routes";
import SocketProvider from "./Providers/SocketProvider";
import Swal from "sweetalert2";
import { createTheme } from "react-data-table-component";
import useBlueboardClient from "./Hooks/useBlueboardClient";
import { useDispatch } from "react-redux";
import useLoaderState from "./Hooks/useLoaderState";
import useLogout from "./Hooks/useLogout";
import useRenew from "./Hooks/useRenew";
import useThemePrefs from "./Hooks/useThemePrefs";
import useToken from "./Hooks/useToken";

const ToasterContainer = () => {
  const theme = useTheme();

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={true}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background:
              theme.type === "dark"
                ? theme.palette.accents_2
                : theme.palette.background,
            color: theme.palette.text,
          },
        }}
      />
    </>
  );
};

const ProviderStack = ({ children }) => {
  const theme = useThemePrefs();
  const token = useToken();

  return (
    <ThemeProvider theme={{ type: theme.isDark ? "dark" : "light" }}>
      <BlueboardClientProvider token={token}>
        <SocketProvider token={token}>
          <ToasterContainer />
          <GlobalListeners />
          {children}
        </SocketProvider>
      </BlueboardClientProvider>
    </ThemeProvider>
  );
};

const UIShowContext = React.createContext(false);
const AppBootstrapProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [canShow, setShow] = React.useState(false);
  const [bootstrapInProgress, setBootstrapInProgress] = React.useState(true);

  const dispatch = useDispatch();
  const token = useToken();
  const loader = useLoaderState();
  const client = useBlueboardClient();
  const logout = useLogout();
  /*
        App bootstrap.
        A tököm kivan
    */

  const startRenew = useRenew();

  const fcontrol = async (token) => {
    console.log("DEBUG: Control fetch...");

    return await client.account.control(token).then((res) => {
      dispatch({ type: "control/setControl", payload: res });

      setTimeout(() => setShow(true), 0);
      setTimeout(() => setLoading(false), 300);
    });
  };

  // Próbáljunk csak tokentet alkotni...
  React.useEffect(() => {
    setTimeout(() => setShow(false), 0);
    setTimeout(() => setLoading(true), 0);
    console.log(token);
    if (token !== null) {
      fcontrol(token)
        .then(() => {
          startRenew();
          dispatch({ type: "loader/removeLoader" });
          setBootstrapInProgress(false);
        })
        .catch((err) => {
          if (err instanceof BlueboardControlException) {
            logout().then(() => {
              Swal.fire({
                title: "A Manóba",
                text: "Szóval ömm igen... Úgy tűnik valami elszállt, kérlek jelentkezz be újra.",
                icon: "error",
                confirmButtonText: "Igenis!",
              });
            });
          } else {
            throw err;
          }
        });
    } else {
      client.auth
        .loginWithCookie()
        .then((res) => {
          fcontrol(res.data.token).then(() => {
            startRenew();
            dispatch({ type: "token/setToken", payload: res.data.token });
            dispatch({ type: "loader/removeLoader" });
            setBootstrapInProgress(false);
          });
        })
        .catch((err) => {
          setTimeout(() => setShow(true), 0);
          setTimeout(() => setLoading(false), 300);
        });
    }
  }, []);

  // Gusztustalan, de működik !!!4444!!
  // Ha kell...

  React.useEffect(() => {
    if (!bootstrapInProgress) {
      if (loader) {
        setTimeout(() => setShow(false), 0);
        setTimeout(() => setLoading(true), 0);
      } else {
        setTimeout(() => setShow(true), 0);
        setTimeout(() => setLoading(false), 300);
      }
    }
  }, [loader, bootstrapInProgress]);

  return (
    <UIShowContext.Provider value={canShow}>
      {loading ? (
        <Loading loading background="transparent" loaderColor="whitesmoke" />
      ) : null}
      {children}
    </UIShowContext.Provider>
  );
};

const UIBootstrap = () => {
  const canShow = React.useContext(UIShowContext);

  // Table themes
  // Dark, uses NextUI colors
  createTheme("dark", {
    text: {
      primary: "#fff",
      secondary: "#0070f3",
    },
    background: {
      default: "#111",
    },
    highlightOnHover: {
      default: "#333",
      text: "#fff",
    },
    context: {
      background: "#7928ca",
      text: "#FFFFFF",
    },
    divider: {
      default: "#333",
    },
    button: {
      default: "#0070f3",
      hover: "rgba(0,0,0,.08)",

      focus: "rgba(255,255,255,.12)",

      disabled: "rgba(255, 255, 255, .34)",
    },
    sortFocus: {
      default: "#0070f3",
    },
  });

  // Light, uses NextUI colors
  createTheme("light", {
    text: {
      primary: "#333",
      secondary: "#0070f3",
    },
    background: {
      default: "#fff",
    },
    highlightOnHover: {
      default: "#eaeaea",
      text: "#333",
    },
    context: {
      background: "#7928ca",
      text: "#FFFFFF",
    },
    divider: {
      default: "#eaeaea",
    },
    button: {
      default: "#0070f3",
      hover: "rgba(0,0,0,.08)",

      focus: "rgba(255,255,255,.12)",

      disabled: "rgba(255, 255, 255, .34)",
    },
    sortFocus: {
      default: "#0070f3",
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

const App = () => {
  return (
    <ProviderStack>
      <AppBootstrapProvider>
        <UIBootstrap />
      </AppBootstrapProvider>
    </ProviderStack>
  );
};

export default App;
