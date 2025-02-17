import React, { useState, useEffect, useRef, useContext } from 'react';
import Button from "../ui/Button";
import axios from 'axios';
import UserContext from '../Auth/UserContext';
import { useParams } from 'react-router-dom';
import Prof from './Prof'; // Import the profile page component
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditBlogs = () => {
    const { author, createdAt } = useParams();
    const { user, setUser } = useContext(UserContext)
    const [img, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [hashtagsInput, setHashtagsInput] = useState('');
    const [hashtag, setHashtag] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [msg, setMsg] = useState('');
    const [BLOG, setBlog] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false); // Track success state

    const url = "https://bloggram-duh7.onrender.com";
    //const url = "https://localhost:3002";
  

    const fileInputRef = useRef(null);

    
    const [imageUrl, setImageUrl] = useState('');
    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    const addImageFromUrl = () => {
        if (imageUrl.trim() !== '') {
            // Append the image tag to the content with the specified URL
            setContent(content + `<img src="${imageUrl}" alt="Image from URL" />`);
            // Clear the image URL input field after adding the image
            setImageUrl('');
        }
    };


    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await axios.get(`${url}/api/getBlog/${user.username}/${createdAt}`);
                const blogData = response.data;
                setBlog(response.data);
                setTitle(blogData.title);
                setSubtitle(blogData.subtitle);
                console.log("created = ", createdAt);
                setContent(blogData.content);
                setHashtagsInput(blogData.hashtag.join(', '));
                //  setImage(blogData.img);
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

    useEffect(() => {
        const hashtagsArray = hashtagsInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');
        setHashtag(hashtagsArray);
    }, [hashtagsInput]);

    const validateForm = () => {
        if (!author || !title || !subtitle || !content || !img || !hashtag.length) {
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
                <div className="w-2/6"><input value={user.username} type="text" placeholder="enter user" readOnly /></div>
                <div className="w-2/6"><input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="enter title" /></div>
                <div className="w-2/6"><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} type="text" placeholder="enter subtitle" /></div>
                <div className="w-2/6"><input value={hashtagsInput} onChange={handleHashtagsChange} type="text" placeholder="enter #hashtagtag" /></div>
                <div className="w-2/6"><input type="file" name="img" onChange={handleImageChange} ref={fileInputRef} /></div>
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
                    {/* <p className='mb-2'>Edit content</p> */}
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