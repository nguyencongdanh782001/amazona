import Cookies from 'js-cookie';
import { createContext, Dispatch, ReactNode, useReducer } from 'react';

interface ContextProviderProps {
  children: ReactNode;
}
interface InitialStateType {
  darkMode: boolean;
}

export interface DarkModeOn {
  type: 'DARK_MODE_ON';
}
export interface DarkModeOff {
  type: 'DARK_MODE_OFF';
}
export type DarkModeAction = DarkModeOn | DarkModeOff;

const initialState: InitialStateType = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
};

export const StoreContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<DarkModeAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducer = (state: InitialStateType, action: DarkModeAction): InitialStateType => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }: ContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};
