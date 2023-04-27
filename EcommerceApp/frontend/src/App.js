import React from 'react';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRegister from './components/Register/userRegister';
import SellerRegister from './components/Register/sellerRegister';
import UserLogin from './components/Login/userLogin';
import SellerLogin from './components/Login/sellerLogin';
import UploadProduct from './components/Products/productUpload';
import DisplayProduct from './components/Products/productDisplay';
import DisplayCart from './components/Cart/cartDisplay';
import DisplayOrder from './components/Orders/orderDisplay';
import ReturnRequest from './components/Orders/returnRequest';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={
          <>
            
            
          </>
        } />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/sellerregister" element={<SellerRegister />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/sellerlogin" element={<SellerLogin />} />
        <Route path="/productupload" element={<UploadProduct />} />
        <Route path="/productdisplay" element={<DisplayProduct />} />
        <Route path="/cartdisplay" element={<DisplayCart />} />
        <Route path="/orderdisplay" element={<DisplayOrder />} />
        <Route path="/orderdisplay" element={<DisplayOrder />} />
        <Route path="/returnrequest" element={<ReturnRequest />} />
        {/* <Route path="/redirect" element={<Redirect />} /> */}
      </Routes>
    </Router>


  );
}
export default App;


/*

*/
