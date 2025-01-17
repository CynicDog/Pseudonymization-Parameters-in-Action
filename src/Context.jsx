import { createContext, useContext, useState } from "react";

const ParameterContext = createContext();

export const ParameterProvider = ({ children }) => {
    const [focusedParam, setFocusedParam] = useState({
        id: "P13",
        name: "카운트구간길이",
        value: 10000
    });

    return (
        <ParameterContext.Provider value={{ focusedParam, setFocusedParam }}>
            {children}
        </ParameterContext.Provider>
    );
};

export const useParameter = () => useContext(ParameterContext);
