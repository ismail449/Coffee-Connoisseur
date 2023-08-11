import { CoffeeStore } from "@/lib/coffee-stores";
import {
  Dispatch,
  ReactNode,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from "react";

type initialStateType = {
  latLong: { lat: number; long: number };
  coffeeStoresNearby: CoffeeStore[];
};

const initialState: initialStateType = {
  coffeeStoresNearby: [],
  latLong: { lat: 0, long: 0 },
};
type initialContextType = initialStateType & {
  dispatch: Dispatch<StoreAction>;
};

const initialContext: initialContextType = {
  latLong: { lat: 0, long: 0 },
  coffeeStoresNearby: [],
  dispatch: () => {},
};
type ProviderProps = {
  children: ReactNode;
};

const StoreContext = createContext(initialContext);

export const useStoreContext = () => {
  return useContext(StoreContext);
};

export enum ACTION_TYPES {
  SET_LAT_LONG = "SET_LAT_LONG",
  SET_COFFEE_STORES = "SET_COFFEE_STORES",
}

type StoreAction = {
  type: ACTION_TYPES;
  payload: { lat: number; long: number } | CoffeeStore[];
};

const storeReducer: Reducer<initialStateType, StoreAction> = (
  state,
  action
) => {
  const { payload, type } = action;
  switch (type) {
    case ACTION_TYPES.SET_COFFEE_STORES:
      return { ...state, coffeeStoresNearby: payload as CoffeeStore[] };
    case ACTION_TYPES.SET_LAT_LONG:
      return { ...state, latLong: payload as { lat: number; long: number } };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
