// import React, { useContext, useState, useEffect } from 'react';
// // import { store } from '../../App';
// import { Link, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// // import './Myprofile.css';

// const Myprofile = () => {
// //   const [token, setToken] = useContext(store);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const storedToken = Cookies.get('authToken');

//     if (storedToken) {
//       setToken(storedToken);

//       axios
//         .get('https://backendloginpage.onrender.com/myprofile', {
//           headers: {
//             'x-token': storedToken,
//           },
//         })
//         .then((res) => (setData(res.data) ,console.log(res.data)))
//         .catch((err) => console.error(err));
        
//     }
//     // console.log()
//   }, [setToken]);

//   const handleLogout = () => {
//     Cookies.remove('authToken');
//     setToken(null);
//   };

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   return (
//     <div className='mai'>
//       {data && (
//         <center>
//           Welcome to the Dashboard {data.username}<br />
//           <button className='styled-link' onClick={handleLogout}>Logout</button>
//           <button className='styled-link' ><Link className='lik' to='/expence'>Register car</Link></button>
//         </center>
//       )}
//     </div>
//   );
// };

// export default Myprofile;

