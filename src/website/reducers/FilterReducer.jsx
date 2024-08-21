const FilterReducer = (state, action) => {

    switch (action.type) {
        case "LOAD_FILTER_PRODUCTS":
            return {
                ...state,
                filter_products: [...action.payload],
                all_products: [...action.payload]
            }

        // search
        case "UPDATE_FILTERS_VALUE":
            const { name, value } = action.payload
            return {
                ...state,
                filters: {
                    ...state.filters,
                    [name]: value
                }
            }

        case "FILTER_PRODUCTS":
            const { all_products } = state
            let tempFilterProduct = [...all_products]
            const { text, category } = state.filters

            // search
            if (text) {
                tempFilterProduct = tempFilterProduct.filter((curElem) => {
                    return curElem.Name_en.toLowerCase().includes(text.toLowerCase()) ||
                           curElem.Name_ar.toLowerCase().includes(text.toLowerCase())
                })
            }

            if (category !== "All") {
                tempFilterProduct = tempFilterProduct.filter((curElem) => {
                    return curElem.category.Name_en === category
                })
            }

            return {
                ...state,
                filter_products: tempFilterProduct
            }
        // search

        default:
            return state
    }
}

export default FilterReducer