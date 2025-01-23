import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Description from "./views/Description.jsx";
import IncomeExample from "./charts/IncomeExample.jsx";

import incomes from "../data/incomes.json"
import incomes_2 from "../data/incomes_2.json"

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Description />} />
                <Route path="/example-1" element={<IncomeExample data={ incomes }/>} />
                <Route path="/example-2" element={<IncomeExample data={ incomes_2 }/>} />
            </Routes>
        </Router>
    )
};

export default App;