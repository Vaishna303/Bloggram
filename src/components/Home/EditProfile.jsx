import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import UserContext from '../Auth/UserContext';

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [msg, setMsg] = useState('');
  
  // const url = "http://localhost:3002";
  const url = "https://bloggram-2.onrender.com";

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.mail) return;
      try {
        const response = await axios.get(`${url}/getUserDetails/${user.mail}`);
        const { username, phone, password, question, answer } = response.data;
        setUsername(user.username || '');
        setMail(user.mail || ''); 
        setPhone(user.phone || '');
        setPassword(user.password || '');
        setQuestion(user.question || '');
        setAnswer(user.answer || '');
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Error fetching user details. Please try again.');
      }
    };
    fetchUserDetails();
  }, [user?.mail]);

  const saveUserDetails = async () => {
    if (!username || !mail || !phone || !password || !question || !answer) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    try {
      setIsSaving(true);
      const updatedUserDetails = { username, mail, phone, password, question, answer };
      await axios.put(`${url}/api/updateUserDetails/${user.mail}`, updatedUserDetails);
      setSavedSuccessfully(true);
      setMsg("Successfully edited profile...");
      setUser({ ...user, username, mail, phone, password, question, answer });
    } catch (error) {
      console.error('Error saving user details:', error);
      setErrorMessage('Error saving user details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    if (savedSuccessfully) {
      navigate('/profile');
    }
  }, [savedSuccessfully, navigate]);

  return (
    <div className="w-full h-[40rem] grid place-items-center">
      <div className="w-[22rem] h-[30rem] flex-col gap-2 px-2 py-3 mx-auto mt-4">
        <h3 className="font-bold text-slate-50 text-3xl text-center mt-0">EDIT PROFILE</h3>
        <div className="w-full px-4 flex flex-col gap-4 my-5">
          <input type="text" onChange={(e) => setUsername(e.target.value)} title="Username" value={username} placeholder="Username" />
          <input type="text" value={mail} title="email" placeholder="E-mail" readOnly />
          <input
            type="tel"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            pattern="[0-9]{10}"
            title="Phone number must have exactly 10 digits."
            placeholder="Enter Phone-no"
          />
          <input type="password" onChange={(e) => setPassword(e.target.value)} title="password" value={password} placeholder="Enter password" />
          <input type="text" onChange={(e) => setQuestion(e.target.value)} value={question} title="Security Question" placeholder="Set Security question" />
          <input type="text" onChange={(e) => setAnswer(e.target.value)} value={answer} title="Answer" placeholder="Provide the answer" />
        </div>
        <div className="w-full flex flex-col place-items-center gap-4">
          <button
            disabled={isSaving}
            onClick={saveUserDetails}
            className="font-medium border-[1px] duration-300 transition-all ease-in border-black-500 rounded-md text-slate-900 bg-white cursor-pointer px-2 py-2 text-[0.8rem] hover:bg-red-500 bg-transparent hover:text-slate-50 md:text-[1rem]"
          >
            Save
          </button>
          {errorMessage && <p className="text-red-900">{errorMessage}</p>}
          {msg}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;