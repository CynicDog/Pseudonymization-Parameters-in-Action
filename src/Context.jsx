import { createContext, useContext, useState } from "react";

const ParameterContext = createContext();

export const ParameterProvider = ({ children }) => {
    const [focusedParam, setFocusedParam] = useState({
        id: "P13",
        name: "카운트구간길이",
        value: 10000,
        description: "연속형 데이터를 구간별로 그룹화(빈ning)하거나 카운트를 수행할 때 사용하는 윈도우 크기"
    });

    return (
        <ParameterContext.Provider value={{ focusedParam, setFocusedParam }}>
            {children}
        </ParameterContext.Provider>
    );
};

export const useParameter = () => useContext(ParameterContext);
