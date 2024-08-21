import { createContext, useState, useContext, useEffect } from "react";

export const CheckOutContext = createContext('')

const CheckOutProvider = ({ children }) => {
    const [personalInfo, setPersonalInfo] = useState({
        FullName: '',
        Phone: '',
        Country: '',
        AddressDetails: '',
    })

    const [recommendations, setRecommendations] = useState([])

    function handleForm(e) {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
    }

    // Modified setRecommendations function
    const setRecommendationsWithStorage = (newRecommendations) => {
        setRecommendations(newRecommendations);
        localStorage.setItem('recommendations', JSON.stringify(newRecommendations));
    }

    // Load recommendations from local storage on component mount
    useEffect(() => {
        const storedRecommendations = localStorage.getItem('recommendations');
        if (storedRecommendations) {
            setRecommendations(JSON.parse(storedRecommendations));
        }
    }, []);

    return (
        <CheckOutContext.Provider value={{ personalInfo, setPersonalInfo, handleForm, recommendations, setRecommendations:setRecommendationsWithStorage }}>
            {children}
        </CheckOutContext.Provider>
    )
}

export default CheckOutProvider

// custom hooks
export const useCheckOut = () => {

    return useContext(CheckOutContext)
}