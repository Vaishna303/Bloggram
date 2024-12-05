import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Tag from "../ui/Tag";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadCry, faSignOutAlt, faSignInAlt, faAdd, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import UserContext from '../Auth/UserContext';

const Prof = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [name, setUsername] = useState('');
    const [mail, setMail] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('');
    
    // const url = "http://localhost:3002";
    const url = "https://bloggram-2.onrender.com";
    
    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                // console.log('User email:', user.mail);
                // console.log("HELLLOOO");
                let fetchUrl = `${url}/api/getUserBlogs/${user.mail}`;
                const response = await axios.get(fetchUrl);
                setBlogs(response.data);

                const response1 = await axios.get(`${url}/api/getUserDetails/${user.username}`);
                setUsername(response1.data.username);
                
                const formattedDate = new Date(response1.data.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                  
                setMail(response1.data.mail);
                setPhone(response1.data.phone);
            } catch (error) {
                console.error('Error fetching user blogs:', error);
            }
        };

        if (user && user.username) {
            fetchUserBlogs();
        }
    }, [user, category]);
    
    const filteredBlogs = blogs.filter(blog => {
        const isCategoryMatched = category === "" || blog.category === category;    
        return isCategoryMatched;
      });

   
    const handleDeleteBlog = async (createdAt) => {
        try {
            const formattedCreatedAt = new Date(createdAt).toISOString();
            await axios.delete(`${url}/api/deleteBlog/${user.username}/${createdAt}`);
            setBlogs(prevBlogs => prevBlogs.filter(blog => blog.createdAt !== createdAt));
            alert('Blog deleted successfully');
        } catch (error) {
            console.error('Front End - Error deleting blog:', error);
            alert('Front End - Error deleting blog. Please try again.');
        }
    };

    const handleSignout = () => {
        setUser(null);
    };

    if (user) {
        return (
            <div className='bg-gray-100 text-slate-900 min-h-screen relative'>
                <div className='bg-neutral-800 p-2 relative h-80'>
                    <img src="https://i.pinimg.com/originals/44/b3/59/44b359de0172dc0596f94756e0a617e7.jpg" alt="not found" className='size-full rounded' />
                 
                    <img src="https://9sail.com/wp-content/uploads/2020/01/Importance-of-Blogging-for-Your-Business-scaled.jpeg" alt="not found" className='absolute bottom-5 left-5 size-full rounded-full border-4 border-white' style={{ width: '200px', height: '200px' }} />

                    <span className='absolute left-60 bottom-36 text-center font-bold text-2xl'>{user.username}</span>
                    <span className='absolute left-60 bottom-28 text-center font-bold text-2xl'>{user.mail}</span>
                    <span className='absolute left-60 bottom-20 text-center font-bold text-2xl'>{user.phone}</span>
                    
                    <FontAwesomeIcon onClick={handleSignout} icon={faSignOutAlt} className="absolute top-5 right-10 bg-blue-500 text-white px-4 py-2 rounded" title="Logout" />
                    <Link to={`/profile/addBlog/${user.username}`}>
                        <FontAwesomeIcon icon={faAdd} className="absolute bottom-5 right-36 bg-blue-500 text-white px-4 py-2 rounded h-6 w-6" title="Add Blogs"/>
                    </Link>
                    <Link to='/profile/editProfile'>
                        <button className="absolute bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
                    </Link>
                </div>
                <div className='p-2 bg-slate-300 pb-5'>
                    <nav className="text-center text-3xl text-slate-800 font-bold">ALL POSTS</nav>
                    <div className="container mx-auto mt-5 px-8">
                        <div className="flex">
                            <h2 className="text-xl font-bold mb-3">Total Posts: {blogs.length}</h2>

                            <div className="w-2/5 mb-3 text-center">
                                <label htmlFor="category" className="w-2/5">Category: </label>
                                <select
                                    className="text-black w-2/5 px-2"
                                    name="category"
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Health">Health</option>
                                    <option value="Business">Business</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Food">Food</option>
                                    <option value="Art">Art</option>
                                    <option value="Science">Science</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Politics">Politics</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <ul className="w-full grid grid-cols-1 px-2 py-1 font-medium gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 pl-4 pr-4">
                            {filteredBlogs.map((blog, index) => (
                                <li key={index} className='hover:border-2 hover:border-white rounded-2xl border-2 border-neutral-800 p-3 relative'>
                                    <Link to={`/profile/${user.username}/${blog.createdAt}`} className="block" >
                                        <div className="bg-white p-4 rounded h-full">
                                            <h3 className="text-lg font-semibold">Category : {blog.category}</h3>
                                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                                            <p className="text-black-300 h-5 right-2">{new Date(blog.createdAt).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>          
                                            <p className="text-gray-700">{blog.subtitle}</p>
                                            <img
                                                className="px-2 py-2 rounded-3xl"
                                                style={{ height: "300px", width: "500px" }}
                                                src={`${url}/${blog.img}`}
                                                alt="Uploaded"
                                            />
                                            <div className="w-full flex gap-0 mt-0 min-h-6">
                                                {blog.hashtag.map((tag, index) => (<Tag key={index} text={`#${tag}`} color={"text-green-900"} bgColor={"bg-green-400"}/>))}
                                            </div>
                                            <p>Likes : {blog.likes}</p>
                                            <p>Shares : {blog.shares}</p>
                                        </div>
                                    </Link>
                                    <button className="absolute bottom-8 right-8 text-gray-900 hover:text-red-500" onClick={() => handleDeleteBlog(blog.createdAt)}>
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className='text-center mt-10'>
                <FontAwesomeIcon icon={faSadCry} className='h-20 w-20' />
                <p className='text-2xl'>NOT SIGNED IN.........</p>
                <p className='text-4xl text-center p-4 mt-10 '>Sign In first.....</p>
                <Link to='/signin'>
                    <FontAwesomeIcon icon={faSignInAlt} className='h-10 w-10 mb-36' />
                </Link>
            </div>
        );
    }
};

export default Prof;

// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import Tag from "../ui/Tag";
// import { Link, useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSadCry, faSignOutAlt, faSignInAlt, faAdd, faTrashCan } from '@fortawesome/free-solid-svg-icons';
// import UserContext from '../Auth/UserContext';

// const Prof = () => {
//     const { user, setUser } = useContext(UserContext);
//     const navigate = useNavigate();
//     const [blogs, setBlogs] = useState([]);
//     const [name, setUsername] = useState('');
//     const [mail, setMail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [category, setCategory] = useState('');
    
//     const url = "http://localhost:3002";
//     //const url = "https://bloggram-2.onrender.com";
    
//     useEffect(() => {
//         const fetchUserBlogs = async () => {
            
//             try {
//                 let fetchUrl = `${url}/api/getUserBlogs/${user.username}`;
                
//                 if (category) {
//                     fetchUrl += `?category=${encodeURIComponent(category)}`;
//                 }
                
//                 const response = await axios.get(fetchUrl);
//                 setBlogs(response.data);

//                 const response1 = await axios.get(`${url}/api/getUserDetails/${user.username}`);
//                 setUsername(response1.data.username);
                
//                 const formattedDate = new Date(response1.data.createdAt).toLocaleDateString('en-US', {
//                     weekday: 'long',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                 });
                  
//                 setMail(response1.data.mail);
//                 setPhone(response1.data.phone);
//             } catch (error) {
//                 console.error('Error fetching user blogs:', error);
//             }
//         };

//         if (user && user.username) {
//             fetchUserBlogs();
//         }
//     }, [user, category]); // Added category to the dependency array

//     const handleDeleteBlog = async (createdAt) => {
//         try {
//             const formattedCreatedAt = new Date(createdAt).toISOString();
//             await axios.delete(`${url}/api/deleteBlog/${user.username}/${createdAt}`);
//             setBlogs(prevBlogs => prevBlogs.filter(blog => blog.createdAt !== createdAt));
//             alert('Blog deleted successfully');
//         } catch (error) {
//             console.error('Front End - Error deleting blog:', error);
//             alert('Front End - Error deleting blog. Please try again.');
//         }
//     };

//     const handleSignout = () => {
//         setUser(null);
//     };

//     if (user) {
//         return (
//             <div className='bg-gray-100 text-slate-900 min-h-screen relative'>
//                 <div className='bg-neutral-800 p-2 relative h-80'>
//                     <img src="https://i.pinimg.com/originals/44/b3/59/44b359de0172dc0596f94756e0a617e7.jpg" alt="not found" className='size-full rounded' />
                 
//                     <img src="https://9sail.com/wp-content/uploads/2020/01/Importance-of-Blogging-for-Your-Business-scaled.jpeg" alt="not found" className='absolute bottom-5 left-5 size-full rounded-full border-4 border-white' style={{ width: '200px', height: '200px' }} />

//                     <span className='absolute left-60 bottom-36 text-center font-bold text-2xl'>{user.username}</span>
//                     <span className='absolute left-60 bottom-28 text-center font-bold text-2xl'>{user.mail}</span>
//                     <span className='absolute left-60 bottom-20 text-center font-bold text-2xl'>{user.phone}</span>
                    
//                     <FontAwesomeIcon onClick={handleSignout} icon={faSignOutAlt} className="absolute top-5 right-10 bg-blue-500 text-white px-4 py-2 rounded" title="Logout" />
//                     <Link to={`/profile/addBlog/${user.username}`}>
//                         <FontAwesomeIcon icon={faAdd} className="absolute bottom-5 right-36 bg-blue-500 text-white px-4 py-2 rounded h-6 w-6" title="Add Blogs"/>
//                     </Link>
//                     <Link to='/profile/editProfile'>
//                         <button className="absolute bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
//                     </Link>
//                 </div>
//                 <div className='p-2 bg-slate-300 pb-5'>
//                     <nav className="text-center text-3xl text-slate-800 font-bold">ALL POSTS</nav>
//                     <div className="container mx-auto mt-5 px-8">
//                         <div className="flex">
//                             <h2 className="text-xl font-bold mb-3">Total Posts: {blogs.length}</h2>
//                             <div className="w-2/5 mb-3 text-center">
//                                 <label htmlFor="category" className="w-2/5">Category: </label>
//                                 <select
//                                     className="text-black w-2/5 px-2"
//                                     name="category"
//                                     id="category"
//                                     value={category}
//                                     onChange={(e) => setCategory(e.target.value)}
//                                     required
//                                 >
//                                     <option value="">Select category</option>
//                                     <option value="Technology">Technology</option>
//                                     <option value="Lifestyle">Lifestyle</option>
//                                     <option value="Health">Health</option>
//                                     <option value="Business">Business</option>
//                                     <option value="Entertainment">Entertainment</option>
//                                     <option value="Food">Food</option>
//                                     <option value="Art">Art</option>
//                                     <option value="Science">Science</option>
//                                     <option value="Sports">Sports</option>
//                                     <option value="Politics">Politics</option>
//                                     <option value="Other">Other</option>
//                                 </select>
//                             </div>
//                         </div>
            
//                         <ul className="w-full grid grid-cols-1 px-2 py-1 font-medium gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 pl-4 pr-4">
//                             {blogs.map((blog, index) => (
//                                 <li key={index} className='hover:border-2 hover:border-white rounded-2xl border-2 border-neutral-800 p-3 relative'>
//                                     <Link to={`/profile/${user.username}/${blog.createdAt}`} className="block" >
//                                         <div className="bg-white p-4 rounded h-full">
//                                             <h3 className="text-lg font-semibold">Category : {blog.category}</h3>
//                                             <h3 className="text-lg font-semibold">{blog.title}</h3>
//                                             <p className="text-black-300 h-5 right-2">{new Date(blog.createdAt).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>          
//                                             <p className="text-gray-700">{blog.subtitle}</p>
//                                             <img
//                                                 className="px-2 py-2 rounded-3xl"
//                                                 style={{ height: "300px", width: "500px" }}
//                                                 src={`${url}/${blog.img}`}
//                                                 alt="Uploaded"
//                                             />
//                                             <div className="w-full flex gap-0 mt-0 min-h-6">
//                                                 {blog.hashtag.map((tag, index) => (<Tag key={index} text={`#${tag}`} color={"text-green-900"} bgColor={"bg-green-400"}/>))}
//                                             </div>
//                                             <p>Likes : {blog.likes}</p>
//                                             <p>Shares : {blog.shares}</p>
//                                         </div>
//                                     </Link>
//                                     <button className="absolute bottom-8 right-8 text-gray-900 hover:text-red-500" onClick={() => handleDeleteBlog(blog.createdAt)}>
//                                         <FontAwesomeIcon icon={faTrashCan} />
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         );
//     } else {
//         return (
//             <div className='text-center mt-10'>
//                 <FontAwesomeIcon icon={faSadCry} className='h-20 w-20' />
//                 <p className='text-2xl'>NOT SIGNED IN.........</p>
//                 <p className='text-4xl text-center p-4 mt-10 '>Sign In first.....</p>
//                 <Link to='/signin'>
//                     <FontAwesomeIcon icon={faSignInAlt} className='h-10 w-10 mb-36' />
//                 </Link>
//             </div>
//         );
//     }
// };

// export default Prof;


// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import Tag from "../ui/Tag";
// import { Link, useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSadCry, faSignOutAlt, faSignInAlt, faAdd, faTrashCan } from '@fortawesome/free-solid-svg-icons';
// import UserContext from '../Auth/UserContext';

// const Prof = () => {
//     const { user, setUser } = useContext(UserContext);
//     const navigate = useNavigate();
//     const [blogs, setBlogs] = useState([]);
//     const [name, setUsername] = useState('');
//     const [mail, setMail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [category, setCategory] = useState('');
//     //const url = "https://bloggram-duh7.onrender.com";
//     const url = "http://localhost:3002";
  

//     useEffect(() => {
//         const fetchUserBlogs = async () => {
        //     try {
        //         const response = await axios.get(`${url}/api/getUserBlogs/${user.username}`);
        //         setBlogs(response.data);
        //         const response1 = await axios.get(`${url}/api/getUserDetails/${user.username}`);
        //         setUsername(response1.data.username);
                
        //    const formattedDate = new Date(response1.data.createdAt).toLocaleDateString('en-US', {
        //             weekday: 'long',
        //             year: 'numeric',
        //             month: 'long',
        //             day: 'numeric'
        //           });
                  
//                 setMail(response1.data.mail);
//                 setPhone(response1.data.phone);
//             } catch (error) {
//                 console.error('Error fetching user blogs:', error);
//             }
//         };

//         if (user && user.username) {
//             fetchUserBlogs();
//         }
//     }, [user]);

//     const handleDeleteBlog = async (createdAt) => {
//         try {
//             const formattedCreatedAt = new Date(createdAt).toISOString();
//             await axios.delete(`${url}/api/deleteBlog/${user.username}/${createdAt}`);
//             setBlogs(prevBlogs => prevBlogs.filter(blog => blog.createdAt !== createdAt));
//             alert('Blog deleted successfully');
//         } catch (error) {
//             console.error('Front End - Error deleting blog:', error);
//             alert('Front End - Error deleting blog. Please try again.');
//         }
//     };

//     const handleSignout = () => {
//         setUser(null);
//     };

//     if (user) {
//         return (
//             <div className='bg-gray-100 text-slate-900 min-h-screen relative'>
//                 <div className='bg-neutral-800 p-2 relative h-80'>
//                     <img src="https://i.pinimg.com/originals/44/b3/59/44b359de0172dc0596f94756e0a617e7.jpg" alt="not found" className='size-full rounded' />
                 
//                     <img src="https://9sail.com/wp-content/uploads/2020/01/Importance-of-Blogging-for-Your-Business-scaled.jpeg" alt="not found" className='absolute bottom-5 left-5 size-full rounded-full border-4 border-white' style={{ width: '200px', height: '200px' }} />

//                     <span className='absolute left-60 bottom-36 text-center font-bold text-2xl'>{user.username}</span>
//                     <span className='absolute left-60 bottom-28 text-center font-bold text-2xl'>{user.mail}</span>
//                     <span className='absolute left-60 bottom-20 text-center font-bold text-2xl'>{user.phone}</span>
                    
                    
//                     <FontAwesomeIcon onClick={handleSignout} icon={faSignOutAlt} className="absolute top-5 right-10 bg-blue-500 text-white px-4 py-2 rounded" title="Logout" />
//                     <Link to={`/profile/addBlog/${user.username}`}>
//                         <FontAwesomeIcon icon={faAdd} className="absolute bottom-5 right-36 bg-blue-500 text-white px-4 py-2 rounded h-6 w-6" title="Add Blogs"/>
//                     </Link>
//                     <Link to='/profile/editProfile'>
//                         <button className="absolute bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
//                     </Link>
//                 </div>
//                 <div className='p-2 bg-slate-300 pb-5'>
//                     <nav className="text-center text-3xl text-slate-800 font-bold">ALL POSTS</nav>
//                     <div className="container mx-auto mt-5 px-8">
//                         <div className="flex">
//                         <h2 className="text-xl font-bold mb-3">Total Posts: {blogs.length}</h2>
//                         <div className="w-2/5 mb-3 text-center">
//                          <label htmlFor="category" className="w-2/5">Category: </label>
//                             <select
//                                 className="text-black w-2/5 px-2"
//                                 name="category"
//                                 id="category"
//                                 value={category}
//                                 onChange={(e) => setCategory(e.target.value)}
//                                 required
//                             >
//                             <option value="">Select category</option>
//                             <option value="Technology">Technology</option>
//                             <option value="Lifestyle">Lifestyle</option>
//                             <option value="Health">Health</option>
//                             <option value="Business">Business</option>
//                             <option value="Entertainment">Entertainment</option>
//                             <option value="Food">Food</option>
//                             <option value="Art & Design">Art & Design</option>
//                             <option value="Science">Science</option>
//                             <option value="Sports">Sports</option>
//                             <option value="Politics">Politics</option>
//                             <option value="Other">Other</option>
//                         </select>
//                     </div>
//                     </div>
            
//                         <ul className="w-full grid grid-cols-1 px-2 py-1 font-medium gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 pl-4 pr-4">
//                             {blogs.map((blog, index) => (
//                                 <li key={index} className='hover:border-2 hover:border-white rounded-2xl border-2 border-neutral-800 p-3 relative'>
//                                     <Link to={`/profile/${user.username}/${blog.createdAt}`} className="block" >
//                                         <div className="bg-white p-4 rounded h-full">
//                                         <h3 className="text-lg font-semibold">Category : {blog.category}</h3>
                                            
//                                             <h3 className="text-lg font-semibold">{blog.title}</h3>
//                                             <p className="text-black-300 h-5 right-2">{new Date(blog.createdAt).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long',day: 'numeric'})}</p>          
//                                             <p className="text-gray-700">{blog.subtitle}</p>
//                                             <img
//                                                 className="px-2 py-2 rounded-3xl"
//                                                 style={{ height: "300px", width: "500px" }}
//                                                 src={`${url}/${blog.img}`}
//                                                 alt="Uploaded"
//                                             />
//                                             <div className="w-full flex gap-0 mt-0 min-h-6">
//                                                 {blog.hashtag.map((tag, index) => (<Tag key={index} text={`#${tag}`} color={"text-green-900"} bgColor={"bg-green-400"}/>))}
//                                             </div>
//                                             <p>Likes : {blog.likes}</p>
//                                             <p>Shares : {blog.shares}</p>
//                                         </div>
//                                     </Link>
//                                     <button className="absolute bottom-8 right-8 text-gray-900 hover:text-red-500" onClick={() => handleDeleteBlog(blog.createdAt)}>
//                                         <FontAwesomeIcon icon={faTrashCan} />
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         );
//     } else {
//         return (
//             <div className='text-center mt-10'>
//                 <FontAwesomeIcon icon={faSadCry} className='h-20 w-20' />
//                 <p className='text-2xl'>NOT SIGNED IN.........</p>
//                 <p className='text-4xl text-center p-4 mt-10 '>Sign In first.....</p>
//                 <Link to='/signin'>
//                     <FontAwesomeIcon icon={faSignInAlt} className='h-10 w-10 mb-36' />
//                 </Link>
//             </div>
//         );
//     }
// };

// export default Prof;