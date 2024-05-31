import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeScreen } from "./Home/Home";

function App() {
	return (
		<div className="container">
			<BrowserRouter>
				<Routes>
					<Route path="/*" element={<HomeScreen></HomeScreen>}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
