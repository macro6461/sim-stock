import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Params from './components/Params'
import StockList from './components/StockList'
import Header from './components/Header'
import SavedSims from "./components/SavedSims";
import './App.css'
import LogInRegisterForm from "./components/auth/LogInRegisterForm";
import ChatWindow from "./components/ChatWindow"
import Profile from "./components/Profile";
import ForgotPassword from "./components/auth/ForgotPassword";

function App() {

  return (
      <Router>
         <AuthProvider>
          <Routes>
            <Route path="/login" element={
              <LogInRegisterForm 
                header="Log In"
                path="/register" 
                linkText="Don't have an account? Register!" 
                route="login" />
            }/>
            <Route 
              path="/register" element={
                <LogInRegisterForm 
                  header="Register"
                  path="/login" 
                  linkText="Already have an account? Log In!" 
                  route="register"/>
            }/>
            <Route 
              path="/forgot-password" element={
                <ForgotPassword />
            }/>
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <>
                    <Header/>
                    <Routes>
                      <Route path="/" element={<Navigate to="/simulate" replace />} />
                      <Route path="/profile" element={<Profile/>} />
                      <Route path="/simulate" element={
                        <>
                          <h1>Simulate</h1>
                          <Params />
                          <StockList />
                        </>
                      }/>
                      <Route path="/saved-sims" element={
                        <SavedSims />
                      }/>
                    </Routes>
                    <ChatWindow/>
                  </>
                </ProtectedRoute>
            }
          />
          </Routes>
         </AuthProvider>
    </Router>
       
  )
}

export default App
