import React, { useState, useEffect, useRef, useContext } from 'react';
import Button from "../ui/Button";
import axios from 'axios';
import UserContext from '../Auth/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import Prof from './Prof';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditBlogs = () => {
    const { author, createdAt } = useParams();
    const navigate = useNavigate(); 
    const { user, setUser } = useContext(UserContext)
    const [img, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [hashtagsInput, setHashtagsInput] = useState('');
    const [hashtag, setHashtag] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [msg, setMsg] = useState('');
    const [BLOG, setBlog] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // const url = "http://localhost:3002";
    const url = "https://bloggram-2.onrender.com";

    const fileInputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');
    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    const addImageFromUrl = () => {
        if (imageUrl.trim() !== '') {
            setContent(content + `<img src="${imageUrl}" alt="Image from URL" />`);
            setImageUrl('');
        }
    };

    useEffect(() => {
        const hashtagsArray = hashtagsInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');
        setHashtag(hashtagsArray);
    }, [hashtagsInput]);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await axios.get(`${url}/api/getBlog/${user.username}/${createdAt}`);
                const blogData = response.data;
                // console.log(blogData);

                setImage(blogData.img);   
                // console.log("Image : ", img);
                setBlog(response.data);
                setCategory(response.data.category);
                setTitle(blogData.title);
                setSubtitle(blogData.subtitle);
                setContent(blogData.content);
                setHashtagsInput(blogData.hashtag.join(', '));

            } catch (error) {
                console.error('Error fetching blog details:', error);
                setErrorMessage('Error fetching blog details. Please try again.');
            }
        };
        fetchBlogDetails();
    }, [user.username, createdAt]);

    const reset = async () => {
        try {
            const response = await axios.get(`${url}/api/getBlog/${user.username}/${createdAt}`);
            const blogData = response.data;
            setBlog(response.data);
            setCategory(blogData.category);
            setTitle(blogData.title);
            setSubtitle(blogData.subtitle);
            console.log("created = ", createdAt);
            setContent(blogData.content);
            setHashtagsInput(blogData.hashtag.join(', '));

        } catch (error) {
            console.error('Error fetching blog details:', error);
            setErrorMessage('Error fetching blog details. Please try again.');
        }
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    
    const handleHashtagsChange = (e) => {
        setHashtagsInput(e.target.value);
    };

    const validateForm = () => {
        if (!author || !title || !subtitle || !content || !category || !img || !hashtag.length) {
            setErrorMessage('Please fill in all fields.');
            return false;
        }
        return true;
    };

    const update = async () => {
        try {
            if (!validateForm()) {
                return;
            }
            const currentDate = new Date();
            const formData = new FormData();
            formData.append('author', author);
            formData.append('title', title);
            formData.append('subtitle', subtitle);
            formData.append('content', content);
            formData.append('category', category);
            formData.append('createdAt', currentDate.toISOString());
            hashtag.forEach(tag => formData.append('hashtag', tag));

            if (img) {
                formData.append('img', img);
            } else {
                formData.append('img', BLOG.img);
            }
            await axios.put(`${url}/api/editBlog/${user.username}/${BLOG.createdAt}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg("Blog updated successfully.");
            navigate('/profile');
            setIsSuccess(true);
        } catch (error) {
            console.error("Error uploading blog blog : ", error);
        }
    };

    if (isSuccess) {
        return <Prof />;
    }

    return (
        <div className='px-4'>
            <div className="w-full grid place-items-center pt-2">
                <h1 className='font-bold text-3xl'>Edit Blog</h1>
  
                <div className="w-2/5">
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
                        <option value="Art & Design">Art & Design</option>
                        <option value="Science">Science</option>
                        <option value="Sports">Sports</option>
                        <option value="Politics">Politics</option>

                        <option value="Other">Other</option>

                    </select>

                </div>
                <div className="w-2/6"><input value={user.username} type="text" placeholder="enter user" readOnly /></div>
                <div className="w-2/6"><input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="enter title" /></div>
                <div className="w-2/6"><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} type="text" placeholder="enter subtitle" /></div>
                <div className="w-2/6"><input value={hashtagsInput} onChange={handleHashtagsChange} type="text" placeholder="enter #hashtagtag" /></div>
  
                <div className="w-2/6 mt-2">
    {BLOG && BLOG.img && (
        <div className="mb-4">
            <img
                src={`http://localhost:3002/${BLOG.img}`}
                alt="Current blog image"
                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
            />
        </div>
    )}
    <input type="file" name="img" onChange={handleImageChange} ref={fileInputRef} />
</div>
                <div className="w-1/5 flex">
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                        placeholder="Enter image URL"
                        className="mr-2"
                    />
                    <Button onClick={addImageFromUrl} text="Add Image" />
                </div>
            </div>
            <div className='mx-24 mt-10'>
                <div className='mb-8'>
                    <ReactQuill
                        className="border-2 w-full rounded-2xl p-2 text-black"
                        style={{ minHeight: '100px', height: 'auto', backgroundColor: 'white', flex: 1, overflowY: 'hidden' }}
                        placeholder="Enter content" value={content} onChange={setContent}
                    />
                </div>
            </div>
            <div className='flex align-middle flex-col items-center'>
                <div className='flex justify-center space-x-6'>
                    <Button onClick={update} text={"Update Blog"} />
                    <Button onClick={reset} text={"Reset"} />
                </div>
                <br />
                {errorMessage ? (<p className="text-red-500 mb-9">{errorMessage}</p>) : <p className="text-blue-500 mb-20">{msg}</p>}
            </div>


        </div>
    )
}

export default EditBlogs;