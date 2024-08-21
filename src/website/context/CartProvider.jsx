import { createContext, useReducer, useContext, useEffect } from "react";
import CartReducer from "../reducers/CartReducer";

const getLocalCartData = () => {
    let LocalCartData = localStorage.getItem("cart")
    if ( LocalCartData === null || LocalCartData === undefined ) {
        return []
    } else {
        return JSON.parse(LocalCartData)
    }
}

const initialState = {
    // cart: [],
    cart : getLocalCartData(),
    total_items: "",
    total_price: "",
    shipping_fee: 0,
    discount: 0,
}

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CartReducer, initialState)

    // =========== to add item to cart ===========
    const addToCart = (id, amount, product) => {
        dispatch({ type: "ADD_TO_CART", payload: { id, amount, product } })
    }

    // =========== to increase and decrease item in cart ===========
    const setDecrease = (id) => {
        dispatch({ type: "SET_DECREASE", payload: id })
    }

    const setIncrease = (id) => {
        dispatch({ type: "SET_INCREASE", payload: id })
    }

    // =========== to remove item from cart ===========
    const handleRemove = (id) => {
        dispatch({ type: "REMOVE_ITEM", payload: id })
    }

    // ============= to clear cart =============
    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" })
    }

    // ============== to add data in localstorage =============
    // =========== set vs get ===========
    useEffect(() => {
        dispatch({ type: "CART_TOTAL_ITEM" })
        dispatch({ type: "CART_TOTAL_PRICE" })
        localStorage.setItem("cart", JSON.stringify(state.cart))
    }, [state.cart]) 

    return (
        <CartContext.Provider value={{ ...state, addToCart, handleRemove, clearCart, setDecrease, setIncrease }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider

// custom hooks
export const useCart = () => {
    return useContext(CartContext)
}