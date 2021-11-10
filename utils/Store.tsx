import { createContext, ReactNode, useReducer } from 'react';

interface ContextProviderProps {
  children: ReactNode;
}

export interface InitialStateType {
  darkMode: boolean;
}

const initialState: InitialStateType = {
  darkMode: false,
};

export const StoreContext = createContext<{ state: InitialStateType; dispatch: any }>({
  state: initialState,
  dispatch: () => undefined,
});

const reducer = (state: InitialStateType, action: any): InitialStateType => {
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
