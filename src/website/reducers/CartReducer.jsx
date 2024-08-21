const CartReducer = (state, action) => {

    if (action.type === "ADD_TO_CART") {
        let { id, amount, product } = action.payload;
        // console.log("product", product)

        // check if product is already in cart
        let existingProduct = state.cart.find((item) => item.id === id);
        if (existingProduct) {
            let updatedProduct = state.cart.map((item) => {
                if (item.id === id) {
                    let newAmount = item.amount + amount
                    // check if amount is greater than stock
                    if (newAmount > item.max) {
                        newAmount = item.max
                    }
                    return { ...item, amount: newAmount }
                } else {
                    return item
                }
            })
            return {
                ...state,
                cart: updatedProduct
            }
        }

        let cartProduct;
        cartProduct = {
            id: id,
            amount: amount,
            nameEn: product.Name_en,
            nameAr: product.Name_ar,
            image: product.images.split(',')[0],
            salePrice: product.sale_price,
            price: product.price,
            max: product.stock,
            CategoryId: product.category_id
        }

        return {
            ...state,
            cart: [...state.cart, cartProduct],
        }
    }

    // increase and decrease item in cart
    if (action.type === "SET_DECREASE") {
        let updatedProduct = state.cart.map((item) => {
            if (item.id === action.payload) {
                let decAmount = item.amount - 1
                if (decAmount < 1) {
                    decAmount = 1
                }
                return { ...item, amount: decAmount };
            } else {
                return item
            }
        });
        return {
            ...state,
            cart: updatedProduct
        }
    }

    if (action.type === "SET_INCREASE") {
        let updatedProduct = state.cart.map((item) => {
            if (item.id === action.payload) {
                let incAmount = item.amount + 1
                if (incAmount > item.max) {
                    incAmount = item.max
                }
                return { ...item, amount: incAmount };
            } else {
                return item
            }
        });
        return {
            ...state,
            cart: updatedProduct
        }
    }

    if (action.type === "REMOVE_ITEM") {
        let updatedCart = state.cart.filter((item) => item.id !== action.payload)
        return {
            ...state,
            cart: updatedCart,
        }
    }

    if (action.type === "CLEAR_CART") {
        return {
            ...state,
            cart: [],
            lastPurchased: state.cart // Save last purchased products before clearing the cart
        }
    }

    // ============== cart total item ==============
    if (action.type === "CART_TOTAL_ITEM") {
        let updatedTotalItem = state.cart.reduce((initial, current) => {
            let { amount } = current
            initial = initial + amount
            return initial
        }, 0)
        return {
            ...state,
            total_items: updatedTotalItem
        }
    }

    // ============= cart total price ==============
    if (action.type === "CART_TOTAL_PRICE") {
        let updatedTotalPrice = state.cart.reduce((initial, current) => {
            let { amount, salePrice, price } = current
            let itemPrice = salePrice ? salePrice : price;
            // Calculate the discounted amount
            let discountMultiplier = 1;
            if (amount === 2) {
                discountMultiplier = 0.9; // 10% discount
            } else if (amount >= 3) {
                discountMultiplier = 0.85; // 15% discount
            }
            initial = initial + (itemPrice * amount * discountMultiplier);
            return initial;
        }, 0)
        return {
            ...state,
            total_price: updatedTotalPrice
        }
    }

    return state

}

export default CartReducer