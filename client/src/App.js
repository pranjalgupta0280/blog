// import logo from './logo.svg';
// import './App.css';
import { useState } from 'react';
import DataProvider from "./context/DataProvider";
import {BrowserRouter,Routes,Route, Navigate, Outlet} from 'react-router-dom';
import Login from "./components/account/Login";
import Home from "./components/home/home";
import Header from "./header/Header";
const PrivateRoute = ({ isAuthenticated, ...props }) => {
  const token = sessionStorage.getItem('accessToken');
  return isAuthenticated && token ? 
    <>
      <Header />
      <Outlet />
    </> : <Navigate replace to='/login' />
};
function App() {
    const [isAuthenticated, isUserAuthenticated] = useState(false);
  return (
   
      <DataProvider>
        <BrowserRouter>
      
         <div style={{marginTop:64}}>
          <Routes>
            <Route path="/login" element={<Login isUserAuthenticated={isUserAuthenticated}/>}/>
            <Route path="/"element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
              <Route path='/' element={<Home />} /></Route>
          </Routes>
      </div>
      </BrowserRouter>
      </DataProvider>
    
  );
}

export default App;
