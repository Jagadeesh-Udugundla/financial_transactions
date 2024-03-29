import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import "./register.css"
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";

const Register = () => {
    const navigate=useNavigate()
    const [data,setData]=useState({
        username:"",
        email:"",
        password:"",
        confirmpassword:""
    })
    const [loader,setLoader]=useState(false)
    const changehandler=(e)=>{
        setData({...data,[e.target.name]:e.target.value})
    }

    const submit=(e)=>{
        e.preventDefault()
        setLoader(true)
        axios.post("https://financialtransactions.onrender.com/register",data)
        .then(
            res=>{
                if (res.data) {
                    navigate("/login");
                    Swal.fire({
                      icon: "success",
                      title: "Register successfully!",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Registration failed",
                      text: "There was an issue with the registration process.",
                    });
                  }
            }
        ).catch((err)=>{
            if (err.response){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Give All correct Details!",
                  });
                }
        }).finally(()=>{
            setLoader(false)
        })
    }
  return (
    <div className='d'>
        <center>
        <form onSubmit={submit}>
            <h1>Register Page</h1>
            <label id="username">UserName :</label>
            <input htmlFor="username" type='text' onChange={changehandler} name="username" placeholder='User Name' />
            <label id="email">Email :</label>
            <input htmlFor="email" type='email' onChange={changehandler} name="email" placeholder='Email' />
            <label id="password">Password :</label>
            <input htmlFor="password" type='password' onChange={changehandler} name="password" placeholder='Password' />
            <label id="confirm">Confirm Password :</label>
            <input htmlFor="confirm" type='password' onChange={changehandler} name="confirmpassword" placeholder='Confirm Password' />
            <input type='submit' value="Register" style={{cursor:"pointer"}} /><br/>
        </form>
        {loader && <p>Loading Please Wait</p>}
        <br/>
        <Link className="styled-link" to='/'>Home</Link>
        <Link className="styled-link" to='/login'>Login</Link>
        </center>
    </div>
  )
}

export default Register