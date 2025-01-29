import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Params from './components/Params'
import StockList from './components/StockList'
import Login from './components/Login'
import Header from './components/Header'
import Register from "./components/Register";
import SavedSims from "./components/SavedSims";
import './App.css'

function App() {

  return (
      <Router>
         <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
