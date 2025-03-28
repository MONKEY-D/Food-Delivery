import { Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import Sidebar from "./component/Sidebar/Sidebar";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Add from "./pages/Add/Add";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
// import { StoreContext } from "../../frontend/src/context/StoreContext";
// import { useContext } from "react";

const App = () => {

  // const { url } = useContext(StoreContext);
  const url = "https://food-delivery-backend-smf6.onrender.com";

  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/add' element={<Add url={url}/>}/>
          <Route path="/list" element={<List url={url}/>}/>
          <Route path="/orders" element={<Orders url={url}/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;
