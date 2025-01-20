import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Description from "./views/Description.jsx";
import Example1 from "./views/Example1.jsx";
import incomes from "../data/incomes.json"

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Description />} />
                <Route path="/example-1" element={<Example1 data={ incomes }/>} />
            </Routes>
        </Router>
    )
};

export default App;