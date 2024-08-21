import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import ProductsReducer from "../reducers/ProductsReducer";
import { baseUrl, CATEGORIES, PRODUCTS } from "../../api/Api";

export const ProductContext = createContext()

const ProductsApi = `${baseUrl}${PRODUCTS}`;
const CategoriesApi = `${baseUrl}${CATEGORIES}`


// reduser
const initialState = {
    isLoading: false,
    isError: false,
    products: [],
    categories: [],
    isSingleLoading: false,
    singleProduct: {},
}
// reduser

const ProductProvider = ({ children }) => {

    // reduser
    const [state, dispatch] = useReducer(ProductsReducer, initialState)
    // reduser

    // get categories
    const getCategories = async (url) => {
        dispatch({ type: "SET_LOADING" })
        try {
            const response = await axios.get(url)
            const categories = await response.data.categories
            dispatch({ type: "SET_CATEGORY_DATA", payload: categories })
            // console.log('categoryContext', response.data.categories)
        } catch (error) {
            dispatch({ type: "API_ERROR" })
            console.log(error)
        }
    }

    // get products
    const getProducts = async (url) => {
        dispatch({ type: "SET_LOADING" })
        try {
            const response = await axios.get(url)
            const products = await response.data.products
            dispatch({ type: "SET_PRODUCT_DATA", payload: products })
            // console.log('productContext', response.data.products)
        } catch (error) {
            dispatch({ type: "API_ERROR" })
            console.log(error)
        }
    }

        // get one product
        const getSingleProduct = async (url) => {
            dispatch({ type: "SET_SINGLE_LOADING" })
            try {
                const response = await axios.get(url)
                const singleProduct = await response.data
                dispatch({ type: "SET_SINGLE_PRODUCT", payload: singleProduct })
                // console.log(response.data.product)
            } catch (error) {
                dispatch({ type: "SET_SINGLE_ERROR" })
                console.log(error)
            }
        }

        useEffect(() => {
            getProducts(ProductsApi)
            getCategories(CategoriesApi)
        }, [])

    return (
        <ProductContext.Provider value={{ ...state, getSingleProduct }}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductProvider

// custom hooks
export const useProduct = () => {

    return useContext(ProductContext)
}