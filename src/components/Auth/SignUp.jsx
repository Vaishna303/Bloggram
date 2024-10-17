import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom"
import UserContext from './UserContext';

const SignUp = () => {
  //const [user, setUser] = useContext();
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [question, setquestion] = useState('');
  const [answer, setanswer] = useState('');
  
  
  //const url = "https://bloggram-duh7.onrender.com";
  const url = "https://localhost:3002";
  
  const handleOnSubmit = async () => {
    try {
      setErrorMessage('');
      if (!username || !mail || !phone || !password || !question || !answer) {
        setErrorMessage('Please make sure all fields are entered.');
        return;
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(mail)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      //Number validation
      if (!/^\d{10}$/.test(phone)) {
        setErrorMessage('Phone number must have exactly 10 digits.');
        return;
      }

      // Password validation
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      const current = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const currentDate = current.toLocaleDateString('en-US', options);
        await axios.post(`${url}/api/signup`, {
        username, mail, phone, password, question, answer, createdAt: currentDate
      });

      setIsSignedUp(true);     
        setUsername('');
        setMail('');
        setPhone('');
        setPassword('');
        setquestion('');
        setanswer('');
        setErrorMessage('');

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data. Please try again.');
    }
  };
  const handleMail = (e)=>{
    setMail(e.target.value);
    setErrorMessage('');
  }
  const handlePass = (e)=>{
    setPassword(e.target.value);
    setErrorMessage('');  
  }
  
  const handlePhone = (e)=>{
    setPhone(e.target.value);
    setErrorMessage('');  
  }

  return (
    <div className="w-full h-[40rem] grid place-items-center">
      
      <div className="w-[22rem] h-[36rem] flex-col gap-2 px-2 py-3 mx-auto mt-4">
        <h3 className="font-bold text-slate-50 text-3xl text-center mt-0">Get On Board</h3>
        <div className="w-full px-4 flex flex-col gap-4 my-5">
          <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Username" />
          <input type="text" onChange={(e) => handleMail(e)} value={mail} placeholder="E-mail" />
          <input type="tel" onChange={(e) => handlePhone(e)} value={phone} pattern="[0-9]{10}" title="Phone number must have exactly 10 digits." placeholder="Enter Phone-no" />
          <input type="password" onChange={(e) => handlePass(e)} value={password} placeholder="Enter password" />
          <input type="text" onChange={(e) => setquestion(e.target.value)} value={question} placeholder="Set Security question" />
          <input type="text" onChange={(e) => setanswer(e.target.value)} value={answer} placeholder="Provide the answer" />
          
        </div>
        
        <div className="w-full flex flex-col place-items-center gap-4">
          <button onClick={handleOnSubmit} className={`font-medium border-[1px] duration-300 transition-all ease-in border-black-500  rounded-md text-slate-900 bg-white cursor-pointer px-2 py-2 text-[0.8rem] hover:bg-red-500  bg-transparent hover:text-slate-50 md:text-[1rem] `}> SignUp </button>         
          <p className="text-red-900">{errorMessage}</p>
          {isSignedUp && <p>You've successfully signed up! <Link className="text-indigo-500 text-medium text-xl" to="/signin">Sign In</Link></p>}
          {!isSignedUp && 
          <p>Already an account ? <Link className="text-indigo-500 text-medium text-xl" to="/signin">Sign In</Link></p>
          }
        </div>
      </div>
    </div>
  );
}

export default SignUp;