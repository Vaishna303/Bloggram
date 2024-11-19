import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Prof from '../Home/Prof';
import UserContext from './UserContext';
const SignIn = () => {
  const { user, setUser } = useContext(UserContext);
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [msg, setmsg]=useState('');
  const [incor, setincor] = useState(false);
  
  //const url = "http://localhost:3002";
  const url = "https://bloggram-2.onrender.com";
    
  const handleOnSubmit = async () => {
    try {
      
      if (!mail || !password) {
        setmsg('Please make sure all fields are entered');
        return;
      }
  
      const response = await axios.post(`${url}/api/signIn`, { mail, password });
  
      if (response.status === 200) {
        setUser(response.data.user);
        setSignInSuccess(true);
        setmsg(`${mail} SIGNED IN....`);
        setMail('');
        setPassword('');
      }
    } catch (error) {
      if (error.response) {
        // Handle different response status codes
        if (error.response.status === 404) {
          setmsg('Email not registered. Please sign up.');
        } else if (error.response.status === 401) {
          setmsg('Incorrect password. Please try again.');
          setincor(true);
        } else {
          setmsg('An unexpected error occurred. Please try again later.');
        }
      } else {
        setmsg('Unable to connect to the server. Please try again.');
      }
    }
  };
  
  const handleMail = (e)=>{
    setMail(e.target.value);
    setmsg('');
    setincor(false);
  }
  const handlePass = (e)=>{
    setPassword(e.target.value);
    setmsg('');
    setincor(false);
  }

  return (
    <>
    {!user ? (
    <div className="w-full h-[35rem] grid place-items-center">
      
      <div className="w-[24rem] h-[30rem] flex-col gap-2 px-2 py-3 mx-auto items-center justify-center ">
        <h3 className="font-bold text-slate-50 text-3xl text-center mt-5">Hello there, Welcome back</h3>
        <div className="w-full px-4 flex flex-col gap-8 my-5">
        <input type="text" onChange={(e)=>handleMail(e)} value={mail} placeholder="E-mail"></input>
        <input type="password" onChange={(e) => handlePass(e)} value={password} placeholder="Enter password"></input>
        </div>
        <div className="w-full flex flex-col place-items-center gap-4">
          <button onClick={handleOnSubmit} className="font-medium border-[1px] duration-300 transition-all ease-in border-black-500 rounded-md text-slate-900 bg-white cursor-pointer px-2 py-2 text-[0.8rem] hover:bg-red-500 bg-transparent hover:text-slate-50 md:text-[1rem] "> Sign In</button>
          <p>Don't have an account ? <Link className="text-indigo-500 text-medium text-xl" to="/signup">Sign Up</Link></p>
          {!signInSuccess && <>
              <p>{msg}</p>
              </>}
          
                <p><Link className="text-indigo-500 text-medium text-xl" to="/signin/forgotpwd">Forgot Password ?</Link></p>
          
          
          </div>
          

      </div>
    </div>  
    ) : <Prof />}
    </>
  );
};

export default SignIn;