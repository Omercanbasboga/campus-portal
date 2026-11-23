import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import PropTypes from "prop-types";

const UiContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "DARK_MODE":
      return { ...state, darkMode: action.value };
    case "MINI_SIDENAV":
      return { ...state, miniSidenav: action.value };
    default:
      throw new Error(`unknown action ${action.type}`);
  }
}

// Pass darkMode to make the provider follow a value owned by someone else:
// that's how a remote mirrors the host's theme. Each app bundles its own copy
// of this module, so the host's context is not visible inside a remote.
export function UiProvider({ children, initialDarkMode, darkMode }) {
  const [state, dispatch] = useReducer(reducer, {
    darkMode: darkMode ?? initialDarkMode,
    miniSidenav: false,
  });
  useEffect(() => {
    if (darkMode !== undefined) dispatch({ type: "DARK_MODE", value: darkMode });
  }, [darkMode]);
  const value = useMemo(() => [state, dispatch], [state]);
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

UiProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialDarkMode: PropTypes.bool,
  darkMode: PropTypes.bool,
};
UiProvider.defaultProps = { initialDarkMode: false, darkMode: undefined };

// returns [state, dispatch]; outside a provider (a remote rendered on its own
// without one) it falls back to light mode instead of crashing
export function useUiController() {
  const ctx = useContext(UiContext);
  return ctx || [{ darkMode: false, miniSidenav: false }, () => {}];
}

export const setDarkMode = (dispatch, value) => dispatch({ type: "DARK_MODE", value });
export const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
