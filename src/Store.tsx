import React from 'react'
import { Cart, CartItem } from './types/Cart'
import { UserInfo } from './types/UserInfo' // Importation: Utilisateur

// Définition du type pour l'état de l'application
type AppState = {
  mode: string
  cart: Cart
  userInfo?: UserInfo
}

// Initialisation de l'état de l'application
const initialState: AppState = {
  userInfo: localStorage.getItem('userInfo') // Utilisateur: Obtenir de la mémoire locale
    ? JSON.parse(localStorage.getItem('userInfo')!) // Si existe: Obtenir de la mémoire locale
    : null, // Sinon: Indéfini
  mode: localStorage.getItem('mode')
    ? localStorage.getItem('mode')
    : window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'dark'
    : 'light',
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems')!)
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress')!)
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')!
      : 'Card',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
}

// Définition des actions possibles
type Action =
  | { type: 'SWITCH_MODE' }
  | { type: 'CART_ADD_ITEM'; payload: CartItem }
  | { type: 'CART_REMOVE_ITEM'; payload: CartItem }
  | { type: 'USER_SIGNIN'; payload: UserInfo } // Type: Action
  | { type: 'USER_SIGNOUT' } // Type: Action

// Fonction réducteur pour gérer les actions
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SWITCH_MODE':
      return { ...state, mode: state.mode === 'light' ? 'dark' : 'light' }
    case 'CART_ADD_ITEM':
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
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item: CartItem) => item._id !== action.payload._id
      ) // Articles du panier: Filtrer les articles du panier
      localStorage.setItem('cartItems', JSON.stringify(cartItems)) // Panier: Définir le panier dans la mémoire locale
      return { ...state, cart: { ...state.cart, cartItems } } // Retourner: Nouveau panier
    }

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload } // Retourner: Nouvel utilisateur

    default:
      return state
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
          shippingAddress: {
            fullName: '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
          },
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      }
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
function StoreProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  )

  return <Store.Provider value={{ state, dispatch }} {...props} />
}

// Exportation du contexte et du fournisseur
export { Store, StoreProvider }
