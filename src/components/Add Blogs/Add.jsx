import React, { useState, useEffect, useRef, useContext } from 'react';
import Button from "../ui/Button";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../Auth/UserContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const Add = () => {
    const {author} = useParams();
    const { user, setUser } = useContext(UserContext);

    const [img, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [hashtagsInput, setHashtagsInput] = useState('');
    const [hashtag, setHashtag] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [msg, setmsg]=useState('');

    
    //const url = "https://bloggram-duh7.onrender.com";
    //const url = "http://localhost:3002";
    const url = "https://bloggram-2.onrender.com";
    

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


    const fileInputRef = useRef(null);
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

    const add = async () => {
        try {
            if (!validateForm()) {
                return;
            }
            else{
            const currentDate = new Date();
            const formData = new FormData();
            formData.append('author', user.username);
            formData.append('title', title);
            formData.append('subtitle', subtitle);
            formData.append('category', category);
            
            formData.append('content', content);
            formData.append('createdAt', currentDate.toISOString());
            hashtag.forEach(tag => formData.append('hashtag', tag));
            formData.append('img', img);

            await axios.post(`${url}/api/addBlog`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setmsg("Blog Uploaded successfully. Upload another blog or continue....");
            
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
            setImage(null);
            setTitle('');
            setSubtitle('');
            setContent('');
            setHashtagsInput('');
            setHashtag([]);
            setErrorMessage('');
        }
        } catch (error) {
            console.error("Error submitting blog : ", error);
        }
    };

    return (
        <div className='px-4'>
        <div className="w-full h-[26rem] grid place-items-center pt-2">
            <h1 className='font-bold text-3xl'>Blog Uploadd</h1>
            <div className="w-2/5">
            <label htmlFor="category" className="w-2/5">Category: </label>
                    <select
                        className="text-black w-2/5 px-2"
                        name="category"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)} // Controlled select value
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
            
            <div className="w-2/5"><input value={user.username} type="text" placeholder="enter user" readOnly /></div>
            <div className="w-2/5"><input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="enter title" /></div>
            <div className="w-2/5"><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} type="text" placeholder="enter subtitle" /></div>
            <div className="w-2/5"><input value={hashtagsInput} onChange={handleHashtagsChange} type="text" placeholder="enter #hashtagtag" /></div>
            <div className="w-2/5"><input type="file" name="img" onChange={handleImageChange}  ref={fileInputRef}/></div>   
            <div className="w-2/5 flex">
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
        <div className='mx-24'>
            <div className='mb-8 mt-5'>
                <ReactQuill
                        className="border-2 w-full rounded-2xl p-2 text-black"
                        style={{ minHeight: '100px', height: 'auto', backgroundColor: 'white', flex: 1, overflowY: 'hidden' }}
                        placeholder="Enter content" value={content} onChange={setContent}
                />
        </div>
        <div className='flex align-middle flex-col items-center'>
            <Button onClick={add} text={"Upload Blog"} />
            <br/>
            {errorMessage ? ( <p className="text-red-500 mb-9">{errorMessage}</p>):<p className="text-blue-500 mb-20">{msg}</p>}
        </div>
        </div>
        <div className="mt-2 mx-8">
                <h2 className="text-xl mb-2">Preview:</h2>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    )
}

export default Add;