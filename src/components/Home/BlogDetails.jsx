import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../Auth/UserContext';
import Tag from "../ui/Tag";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';

const BlogDetails = () => {
    const { user, setUser } = useContext(UserContext);
    const { author, createdAt } = useParams();
    const [like, setLike] = useState(false);
    const [share, setShare] = useState(false);
    const [blog, setBlog] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    //const url = "https://bloggram-duh7.onrender.com";
    const url = "https://localhost:3002";
  

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await axios.get(`${url}/api/getBlog/${author}/${createdAt}`);
                setBlog(response.data);
            } catch (error) {
                console.error("Error fetching blog details:", error);
                alert("Error fetching blog details. Please try again.");
            }
        };
        fetchBlogDetails();
    }, [author, createdAt]);

    const handleLike = async () => {
        try {
            await axios.post(`${url}/api/likeBlog/${author}/${createdAt}`);
             setLike(true); // Update the state to indicate that the blog is liked
            setBlog(prevBlog => ({ ...prevBlog, likes: prevBlog.likes + 1 })); // Update the likes count in the UI
        } catch (error) {
            console.error('Frontend - Error liking blog:', error);
            alert('FrontEnd - Error liking blog. Please try again.');
        }
    };

    const handleShare = async () => {
        try {
            await axios.post(`${url}/api/shareBlog/${author}/${createdAt}`);
            setShare(true); // Update the state to indicate that the blog is liked
            setBlog(prevBlog => ({ ...prevBlog, shares: prevBlog.shares + 1 })); // Update the likes count in the UI
        
            const whatsappShareUrl = `whatsapp://send?text=${encodeURIComponent(window.location.href)}`;
            window.open(whatsappShareUrl);
        } catch (error) {
            console.error('Frontend - Error liking blog:', error);
            alert('FrontEnd - Error liking blog. Please try again.');
        }
    };

    const handleAddComment = async () => {
        try {
            await axios.post(`${url}/api/addComment/${author}/${createdAt}`, {
                user: user.username, text: comment});
            const response = await axios.get(`${url}/api/getBlog/${author}/${createdAt}`);
            setBlog(response.data);
    
            setComment('');
        } catch (error) {
            console.error('Frontend - Error adding comment:', error);
            alert('FrontEnd - Error adding comment. Please try again.');
        }
    };
    
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    return (
        <div className='p-4'>
            {blog && (
                <div className='p-6 px-20 border-4 items-center justify-center bg-slate-600 rounded-lg flex flex-col'>
                    <h2 className='text-4xl font-bold mb-4'>{blog.title}</h2>
                    <p className='text-3xl mb-2'>{blog.subtitle}</p>
                    <p className='text-gray-900 mb-4 font-bold'>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                    <img
                        className="rounded-lg shadow-lg mb-4"
                        style={{ height: '400px', width: '600px' }}
                        src={`${url}/${blog.img}`} alt="Uploaded"
                    />
                    <h1 className='text-2xl font-bold'>By {author}</h1>
                    
                    <div className="flex gap-0 mt-0 min-h-6 mb-2">
                        {blog.hashtag.map((tag, index) => (
                            <Tag
                                key={index}
                                text={`#${tag}`}
                                color={"text-red-400"}
                                bgColor={"bg-green-400"}
                            />
                        ))}
                    </div>
                    <div className='text-white' dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                    <br />
                    <div className="mt-8">
                        <FontAwesomeIcon
                            onClick={handleLike}
                            icon={faThumbsUp}
                            className={`text-blue-500 text-3xl mr-2 hover:text-blue-900 ${like ? 'text-blue-900' : ''}`}
                        />
                        <span className="mr-4">{blog.likes} </span>
                        
                        <FontAwesomeIcon
                            onClick={handleShare}
                            icon={faShare}
                            className={`text-green-500 mt-4 text-3xl mr-2 hover:text-green-900 ${share ? 'text-green-900' : ''}`}
                        />
                        <span className="mr-4">{blog.shares} </span>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-2">Comments</h3>
                        <input
                            type="text"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Add a comment..."
                            className="text-white border border-gray-400 rounded-md px-2 py-1 w-full mb-2"
                        />
                        <button onClick={handleAddComment} className="bg-blue-500 text-white px-3 py-1 rounded-md mb-4">Add Comment</button>
                        
                        {blog.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment, index) => (
                            <div key={index} className="border border-gray-300 rounded-md p-2 mt-2">
                                <p className='pl-2'><strong>{comment.by}</strong><br/>{comment.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetails;