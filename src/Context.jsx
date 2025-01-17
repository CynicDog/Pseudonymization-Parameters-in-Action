import { createContext, useContext, useState } from "react";

const ParameterContext = createContext();

export const ParameterProvider = ({ children }) => {
    const [focusedParam, setFocusedParam] = useState(null);

    return (
        <ParameterContext.Provider value={{ focusedParam, setFocusedParam }}>
            {children}
        </ParameterContext.Provider>
    );
};

export const useParameter = () => useContext(ParameterContext);
