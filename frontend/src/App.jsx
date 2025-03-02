import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/layouts";
import { SignIn } from "./pages/auth";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
  
    if (!token) {
      return <Navigate to="/auth/sign-in" replace />;
    }
  
    return children;
  
}

function App() {
  return (
    <Routes>
    <Route path="/auth/sign-in" element={<SignIn/>} />
      {/* <Route path="/auth/*" element={<Auth />} /> */}
      {/* <Route path="sign-in" element={<SignIn/>}/> */}
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;