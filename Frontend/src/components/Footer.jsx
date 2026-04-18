// // src/components/Footer.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
// import '../styles/Footer.css';

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="container footer-container">
//         <div className="footer-section">
//           <h3>ShopWave</h3>
//           <p>Your one-stop destination for trendy products with amazing deals and fast delivery.</p>
//           <div className="social-icons">
//             <a href="#"><FaFacebook /></a>
//             <a href="#"><FaTwitter /></a>
//             <a href="#"><FaInstagram /></a>
//             <a href="#"><FaYoutube /></a>
//           </div>
//         </div>
//         <div className="footer-section">
//           <h4>Quick Links</h4>
//           <Link to="/about">About Us</Link>
//           <Link to="/contact">Contact</Link>
//           <Link to="/shop">Shop</Link>
//         </div>
//         <div className="footer-section">
//           <h4>Customer Service</h4>
//           <Link to="#">FAQ</Link>
//           <Link to="#">Returns Policy</Link>
//           <Link to="#">Shipping Info</Link>
//         </div>
//         <div className="footer-section">
//           <h4>Contact Info</h4>
//           <p>Email: support@shopwave.com</p>
//           <p>Phone: +1 234 567 890</p>
//           <p>Address: 123 Commerce St, NY</p>
//         </div>
//       </div>
//       <div className="footer-bottom">
//         <p>&copy; 2026 ShopWave. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;






// src/components/Footer.jsx (modified)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  const location = useLocation();
  const authRoutes = ['/login', '/register', '/forgot-password', '/change-password'];
  if (authRoutes.includes(location.pathname)) {
    return null;
  }

  return (
      <footer className="footer">
      <div className="container footer-container">
       <div className="footer-section">
           <h3>ShopWave</h3>
           <p>Your one-stop destination for trendy products with amazing deals and fast delivery.</p>
           <div className="social-icons">
             <a href="#"><FaFacebook /></a>
             <a href="#"><FaTwitter /></a>
             <a href="#"><FaInstagram /></a>
             <a href="#"><FaYoutube /></a>
           </div>
         </div>
        <div className="footer-section">
           <h4>Quick Links</h4>
       <Link to="/about">About Us</Link>
           <Link to="/contact">Contact</Link>
           <Link to="/shop">Shop</Link>
         </div>
         <div className="footer-section">           <h4>Customer Service</h4>
           <Link to="#">FAQ</Link>
           <Link to="#">Returns Policy</Link>
           <Link to="#">Shipping Info</Link>
         </div>
         <div className="footer-section">
           <h4>Contact Info</h4>
           <p>Email: support@shopwave.com</p>
           <p>Phone: +1 234 567 890</p>
           <p>Address: 123 Commerce St, NY</p>
         </div>       </div>
       <div className="footer-bottom">
         <p>&copy; 2026 ShopWave. All rights reserved.</p>
       </div>
     </footer>
  );
};

export default Footer;