import { Link } from "react-router-dom"
import { FaUserLarge } from "react-icons/fa6";
import { useState, useContext } from 'react';
import Icon from "./Icon";
import UserContext from '../Auth/UserContext'; // Import UserContext

const Navbar = () => {
    const { user } = useContext(UserContext); // Access user from UserContext

    return (
        <nav className="w-full  h-[4rem] flex items-center justify-around px-2 py-1 lg:justify-around  ">
            <h2 className="font-bold text-4xl">BlogGram</h2>

            <ul className=" hidden lg:flex gap-9 font-medium">
                {<>
                 <li key={'/'} className='text-2xl font-medium hover:underline hover:text-3xl'> <Link to={'/'}> Home </Link>   </li>
                 <li key={'/blogs'} className='text-2xl font-medium hover:underline hover:text-3xl'> <Link to={'/blogs'}> Blogs </Link>   </li>
                 <li key={'/signin'} className='text-2xl font-medium hover:underline hover:text-3xl'> <Link to={`/signin`}> Sign In </Link>   </li>
                 </>
                }
            </ul>
            
            <div className="flex gap-9" title="Profile">   
            <Link to="/profile">
              <FaUserLarge/>
            </Link>
            </div>
        </nav>
    )
}

export default Navbar 
