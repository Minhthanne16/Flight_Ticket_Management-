import Homepage from "./pages/Homepage.js";
import SignIn from "./pages/SignIn.js";
import SignUp from "./pages/SignUp.js";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
  );
}

export default App;