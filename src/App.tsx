import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Params from './components/Params'
import StockList from './components/StockList'
import Header from './components/Header'
import SavedSims from "./components/SavedSims";
import './App.css'
import LogInRegisterForm from "./components/auth/LogInRegisterForm";

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
              path="*"
              element={
                <ProtectedRoute>
                  <>
                    <Header/>
                    <Routes>
                      <Route path="/simulate" element={
                        <>
                          <Params />
                          <StockList />
                        </>
                      }/>
                      <Route path="/saved-sims" element={
                        <SavedSims />
                      }/>
                    </Routes>
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
