import React from 'react'
import { Cart, CartItem } from './types/Cart'
import { UserInfo } from './types/UserInfo' // Importation: Utilisateur
import { ShippingAddress } from './types/shippingAddress' // Updated import to match the structure

// Définition du type pour l'état de l'application
type AppState = {
  mode: string
  cart: Cart
  userInfo: UserInfo | null
  existingAddresses: ShippingAddress[]; // Updated to match the structure from shippingAddress.ts
}

// Initialisation de l'état de l'application
const initialState: AppState = {
  userInfo: localStorage.getItem('userInfo') // Utilisateur: Obtenir de la mémoire locale
    ? JSON.parse(localStorage.getItem('userInfo')!) // Si existe: Obtenir de la mémoire locale
    : null, // Sinon: Indéfini
  mode: localStorage.getItem('mode') ?? 'light',
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems')!)
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress')!)
      : {} as ShippingAddress, // Updated to match the structure from shippingAddress.ts
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')!
      : 'Card',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
  existingAddresses: localStorage.getItem('existingAddresses') // Add this line
    ? JSON.parse(localStorage.getItem('existingAddresses')!) // Ensure JSON structure matches ShippingAddress[]
    : [], // Initialize as empty array if not found
}

// Définition des actions possibles
type Action =
  | { type: 'SWITCH_MODE' }
  | { type: 'CART_ADD_ITEM'; payload: CartItem }
  | { type: 'CART_REMOVE_ITEM'; payload: CartItem }
  | { type: 'CART_CLEAR' }
  | { type: 'USER_SIGNIN'; payload: UserInfo }
  | { type: 'USER_SIGNOUT' }
  | { type: 'SAVE_SHIPPING_ADDRESS'; payload: ShippingAddress } // Updated payload to match the structure
  | { type: 'SAVE_PAYMENT_METHOD'; payload: string }

// Fonction réducteur pour gérer les actions
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SWITCH_MODE': {
      localStorage.setItem('mode', state.mode === 'light' ? 'dark' : 'light')
      return { ...state, mode: state.mode === 'light' ? 'dark' : 'light' }
    }
    case 'CART_ADD_ITEM': {
      const newItem = action.payload
      const existItem = state.cart.cartItems.find(
        (item: CartItem) => item._id === newItem._id
      )
      const cartItems = existItem
        ? state.cart.cartItems.map((item: CartItem) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem]

      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      return { ...state, cart: { ...state.cart, cartItems } }
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item: CartItem) => item._id !== action.payload._id
      )
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      return { ...state, cart: { ...state.cart, cartItems } }
    }
    case 'CART_CLEAR':
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      }
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload }
    case 'USER_SIGNOUT':
      return {
        mode:
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'dark'
            : 'light',
        cart: {
          cartItems: [],
          paymentMethod: 'Card',
          shippingAddress: {} as ShippingAddress,
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
        existingAddresses: [],
        userInfo: null, // Set userInfo to null on sign out
      }
    case 'SAVE_SHIPPING_ADDRESS': {
      const { payload } = action;
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: payload }, // Updated to directly use the payload
      };
    }
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      }
    default:
      return state
  }
}

// Dispatch par défaut
const defaultDispatch: React.Dispatch<Action> = () => initialState

// Création du contexte de l'application
const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
})

// Fournisseur de contexte pour l'application
function StoreProvider(props: React.PropsWithChildren<Record<string, never>>) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  )

  return <Store.Provider value={{ state, dispatch }} {...props} />
}

// Exportation du contexte et du fournisseur
export { Store, StoreProvider }
