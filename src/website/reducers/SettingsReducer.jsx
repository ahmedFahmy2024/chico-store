const SettingsReducer = (state, action) => {

    switch (action.type) {

        case "SET_LOADING":
            return {
                ...state,
                isSetLoading: true
            }

        case "SET_SETTING_DATA":
            return {
                ...state,
                isSetLoading: false,
                settings: action.payload
            }

        case "API_ERROR":
            return {
                ...state,
                isSetLoading: false,
                isSetError: true
            }

        default:
            return state
    }
}

export default SettingsReducer