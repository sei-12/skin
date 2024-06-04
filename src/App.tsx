import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeScreen } from "./Home/Home";
import { SplashScreen } from "./SplashScreen/SplashScreen";

import "./color.css"

function App() {
	return (
		<div className="container">
			<BrowserRouter>
				<Routes>
					<Route path="/Home" element={<HomeScreen></HomeScreen>}></Route>
					<Route path="/*" element={<SplashScreen></SplashScreen>}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
