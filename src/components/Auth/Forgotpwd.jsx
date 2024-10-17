import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import UserContext from './UserContext';

const Forgotpwd = ()=>
{
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [mail, setmail] = useState('');
    const [question, setquestion] = useState('');
    const [answer, setanswer] = useState('');
    const [finalanswer, setfinalanswer] = useState('');
    const [msg, setmsg] = useState('');

    const url = "https://bloggram-duh7.onrender.com";
    //const url = "https://localhost:3002";
  

    const [is, setis] = useState(true);
     const getQuestion = async ()=>{
        try{  
          if (!mail) {
            setmsg('Please enter email...');
            return;
          }
        
            const response = await axios.get(`${url}/api/getUserDetails`, {params : {mail}});
            
            setUser(response.data);
            console.log('USR = '+response.data.username);
          
            setquestion(response.data.question);
            setfinalanswer(response.data.answer);
        }catch (error) {
            console.error('Error fetching user details:', error);
            setmsg('Email not registered...?\nSign Up');
            setis(false);
          }
    }

    const submit = ()=>
    {
        if (answer==finalanswer) {
            console.log("LOGG IN");
          
            navigate('/profile');
            return null; 
        }
        else
        {
            setmsg("Wrong Answer...");
        }
    }

    const handleMail = (e)=>{
      setmail(e.target.value);
      setquestion('');
      setanswer('');
      setmsg('');
      setis(true);
    }
    const handleanswer = (e)=>{
      setanswer(e.target.value);
      setmsg('');
    }
    return (
        <div className="w-full h-[40rem] grid place-items-center">
      
      <div className="w-[24rem] h-[30rem] flex-col gap-2 px-2 py-3 mx-auto items-center justify-center ">
        <h3 className="font-bold text-slate-50 text-3xl text-center mt-5">Forgot Password ?</h3>
        <div className="w-full px-4 flex flex-col gap-8 my-5">
          <input type="text" value={mail} onChange={(e)=>handleMail(e)} placeholder="Enter Registered Email"/>
          <button onClick={getQuestion} onChange={(e)=>setanswer(e.target.value)} className={`font-medium border-[1px] duration-300 transition-all ease-in border-black-500  rounded-md text-slate-900 bg-white cursor-pointer px-2 py-2 text-[0.8rem] hover:bg-red-500  bg-transparent hover:text-slate-50 md:text-[1rem] `}> Next </button>         
          <input type="text" value={question} readOnly/>
          <input type="text" value={answer} onChange={(e)=>handleanswer(e)} placeholder="Enter answer" />
        </div>
        <div className="w-full flex flex-col place-items-center gap-4">
          <div>
          {/* <button onClick={submit} className="font-medium border-[1px] duration-300 transition-all ease-in border-black-500 rounded-md text-slate-900 bg-white cursor-pointer px-2 py-2 text-[0.8rem] hover:bg-red-500 bg-transparent hover:text-slate-50 md:text-[1rem] "> 
          Sign In</button> */}
          {!is ?(
          <Link to='/signup'><button className="font-medium border-[1px] duration-300 transition-all ease-in border-black-500 rounded-md text-slate-900 bg-white cursor-pointer px-2 py-2 text-[0.8rem] hover:bg-red-500 bg-transparent hover:text-slate-50 md:text-[1rem] "> 
          Sign Up</button></Link>
          ):<button onClick={submit} className="font-medium border-[1px] duration-300 transition-all ease-in border-black-500 rounded-md text-slate-900 bg-white cursor-pointer px-2 py-2 text-[0.8rem] hover:bg-red-500 bg-transparent hover:text-slate-50 md:text-[1rem] "> 
          Sign In</button>
          }
          </div>
          <p>{msg}</p>
          </div>
          

      </div>
    </div>  
    )
}

export default Forgotpwd;