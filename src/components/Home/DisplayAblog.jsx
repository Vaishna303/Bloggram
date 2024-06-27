import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Tag from "../ui/Tag";
import UserContext from '../Auth/UserContext';
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faShare, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const DisplayAblog = () => {
    const { author, createdAt } = useParams();
    const { user, setUser } = useContext(UserContext);

    const [blog, setBlog] = useState(null);
    // const [comment, setComment] = useState('');
    // const [comments, setComments] = useState([]);
    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3002/api/getBlog/${user.username}/${createdAt}`);
                setBlog(response.data);
            } catch (error) {
                console.error('Error fetching blog details:', error);
                alert('Error fetching blog details. Please try again.');
            }
        };
        fetchBlogDetails();
    }, [author, createdAt]);


    return (
        <div className='p-4'>
            {blog && (
                <div className='p-6 pt-10 border-4 items-center justify-center bg-slate-600 rounded-lg flex flex-col relative'>
                    {/* <h2 className='text-3xl font-bold mb-4 text-gray-800 underline'>{user.username}</h2> */}
                    
                    <h2 className='text-4xl font-bold mb-4 underline'>{blog.title}</h2>
                    <p>
                        <Link to={`/profile/EditBlog/${user.username}/${blog.createdAt}`} className='absolute top-8 right-8'>
                            <FontAwesomeIcon icon={faPencilAlt} className="text-blue-500 cursor-pointer mt-2 w-6 h-6" />
                        </Link>
                    </p>
                    <p className='text-3xl mb-2'>{blog.subtitle}</p>
                    <p className='text-gray-900 mb-4'>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                    <img className="rounded-lg shadow-lg mb-4" style={{ height: '400px', width: '600px' }} src={`http://localhost:3002/${blog.img}`} alt="Uploaded" />
                    <div className="flex gap-0 mt-0 min-h-6">
                        {blog.hashtag.map((tag, index) => (
                            <Tag
                                key={index}
                                text={`#${tag}`}
                                color={"text-red-400"}
                                bgColor={"bg-green-400"}
                            />
                        ))}
                    </div>
                    
                    
                    <div className="text-lg leading-relaxed pt-4 pl-48 pr-48" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                   
                    <br />
                    <div className="mt-8">
                        <FontAwesomeIcon 
                            icon={faThumbsUp}
                            className='text-blue-500 text-3xl mr-2 hover:text-blue-90'
                        />
                        <span className="mr-4">{blog.likes} </span>
                        
                        <FontAwesomeIcon
                            icon={faShare}
                            className='text-green-500 mt-4 text-3xl mr-2 hover:text-green-900'
                        />
                        <span className="mr-4">{blog.shares} </span>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-2">Comments</h3>
                        {blog.comments.length ? (<>{blog.comments.reverse().map((comment, index) => (
                <div key={index} className="border border-gray-300 rounded-md p-2 mt-2">
                    <p><strong>{comment.by} : </strong> {comment.text}</p>
                </div>))}</>) : <div className="border border-gray-300 rounded-md p-2 mt-2">
                    <p><strong>NO comments yet</strong></p>
                </div>
            }
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisplayAblog;