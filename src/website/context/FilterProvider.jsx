import { createContext, useContext, useReducer, useEffect } from "react";
import { useProduct } from '../context/ProductProvider';
import FilterReducer from "../reducers/FilterReducer";

export const FilterContext = createContext()

const initialState = {
    filter_products: [],
    all_products: [],
    filters: {
        text: "",
        category: "All",
    }
}

const FilterProvider = ({ children }) => {
    const { products } = useProduct();
    const [state, dispatch] = useReducer(FilterReducer, initialState)

    // update filter value
    const updateFilterValue = (e) => {
        let name = e.target.name
        let value = e.target.value
        return dispatch({ type: "UPDATE_FILTERS_VALUE", payload: { name, value } })
    }
    // update filter value

    // to update filters whenever there's a change
    useEffect(() => {
        dispatch({ type: "FILTER_PRODUCTS" })
    }, [ products, state.filters])

    // to load all products initially for grid and list view.
    useEffect(() => {
        dispatch({ type: "LOAD_FILTER_PRODUCTS", payload: products })
    }, [products])

    return (
        <FilterContext.Provider value={{ ...state, updateFilterValue }}>
            {children}
        </FilterContext.Provider>
    )
}

export default FilterProvider

// custom hooks
export const useFilter = () => {
    return useContext(FilterContext)
}