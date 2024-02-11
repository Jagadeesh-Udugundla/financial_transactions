import React, { useState, useContext, useEffect } from 'react';
// import { store } from '../../App';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import Swal from "sweetalert2";


const Login = () => {
  const navigate=useNavigate()
  // const [token, setToken] = useContext(store);
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const t=Cookies.get("authToken")

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
        alert('Please enter both email and password');
        return;
      }
    setLoading(true);

    try {
      const response = await axios.post('https://financialtransactions.onrender.com/login', data);
      const authToken = response.data;
      Cookies.set('authToken', authToken);
      console.log(response,"response")
      navigate("/expence")

      // setToken(authToken);
    // alert("login success")
    
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Give correct email and Password Details!",
      });
      // alert(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user is already logged in
    const adminUsername = Cookies.get("authToken");
    if (adminUsername) {
      navigate("/expence");
    }
  }, []);

  return (
    <div className='dv'>
      <center>
        <form onSubmit={submitHandler}>
          <h1>Login</h1>
          <label id="email">Email :</label>
          <input htmlFor="email" type="email" className='lef' onChange={changeHandler} name="email" placeholder="Email" /><br />
          <label id="password">Password :</label>
          <input htmlFor="password" type="password" onChange={changeHandler} name="password" placeholder="Password" /><br />
          <input type="submit" value="Login" style={{cursor:"pointer"}} /><br />
        </form>
        {loading && <p>Loading...</p>}
        <br/>
        <Link className="styled-link" to='/'>Home</Link>
        
        <Link className="styled-link" to='/register'>Register</Link>
      </center>
    </div>
  );
};

export default Login;