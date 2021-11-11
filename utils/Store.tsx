import Cookies from 'js-cookie';
import { createContext, Dispatch, ReactNode, useReducer } from 'react';

interface ContextProviderProps {
  children: ReactNode;
}
interface CartItemType {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
interface InitialStateType {
  darkMode: boolean;
  cart: {
    cartItems: Array<CartItemType>;
  };
}

export interface DarkModeOn {
  type: 'DARK_MODE_ON';
}
export interface DarkModeOff {
  type: 'DARK_MODE_OFF';
}
export interface AddAcartItem {
  type: 'CART_ADD_ITEM';
  payload: CartItemType;
}

export type ActionType = DarkModeOn | DarkModeOff | AddAcartItem;

const initialState: InitialStateType = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems: [],
  },
};

export const StoreContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducer = (state: InitialStateType, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'CART_ADD_ITEM':
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((item) => item.name === newItem.name);
      const cartItems = existItem
        ? state.cart.cartItems.map((item) => (item.name === existItem.name ? newItem : item))
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }: ContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};
