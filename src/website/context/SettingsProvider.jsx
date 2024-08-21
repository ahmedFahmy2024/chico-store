import { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";
import SettingsReducer from "../reducers/SettingsReducer";
import { baseUrl, SETTINGS } from "../../api/Api";

export const SettingsContext = createContext();

const SettingsApi = `${baseUrl}${SETTINGS}`

// reduser
const initialState = {
    isSetLoading: false,
    isSetError: false,
    settings: [],
}
// reduser

const SettingsProvider = ({ children }) => {

    // reduser
    const [state, dispatch] = useReducer(SettingsReducer, initialState)
    // reduser

    // get Settings
    const getSettings = async (url) => {
        dispatch({ type: "SET_LOADING" })
        try {
            const response = await axios.get(url)
            const settings = await response.data
            dispatch({ type: "SET_SETTING_DATA", payload: settings })
            // console.log(response.data)
        } catch (error) {
            dispatch({ type: "API_ERROR" })
            console.log(error)
        }
    }

    useEffect(() => {
        getSettings(SettingsApi)
    }, [])

    return (
        <SettingsContext.Provider value={{ ...state }}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsProvider

// custom hooks
export const useSettings = () => {

    return useContext(SettingsContext)
}