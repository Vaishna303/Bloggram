import { Link } from "react-router-dom"
import { FaUserLarge } from "react-icons/fa6";
import { useContext } from 'react';
import UserContext from '../Auth/UserContext';

const Navbar = () => {
    const { user } = useContext(UserContext);

    return (
        <nav className="w-full  h-[4rem] flex items-center justify-around px-2 py-1 lg:justify-around">
            <h2 className="font-bold text-4xl">BlogGram</h2>

            <ul className="hidden md:flex gap-9 font-medium">
                {<>
                 <li className='text-2xl font-medium hover:underline hover:text-3xl'> <Link to={'/'}> Home </Link></li>
                 <li className='text-2xl font-medium hover:underline hover:text-3xl'> <Link to={'/blogs'}> Blogs </Link></li>
                 {!user ?
                 <li className='text-2xl font-medium hover:underline hover:text-3xl'> <Link to={`/signin`}> Sign In </Link></li>
                :
                <li className='text-2xl font-medium hover:underline hover:text-3xl'> <Link to={`/signin`}> SignedIn </Link></li>
                }
                 </>
                }
            </ul>
            
            <div className="flex gap-9" title="Profile">   
                <Link to="/profile"><FaUserLarge/></Link>
            </div>
        </nav>
    )
}

export default Navbar 
