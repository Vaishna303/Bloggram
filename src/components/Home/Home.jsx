import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import axios from 'axios';

const Home = () => {
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    
    //const url = "https://bloggram-duh7.onrender.com";
    //const url = "http://localhost:3002";
    const url = "https://bloggram-2.onrender.com";
    
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${url}/api/getAllBlogs`);
                const sortedBlogs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const featured = response.data.sort((a, b) => b.likes - a.likes);
                setFeaturedBlogs(featured);
                setLatestBlogs(sortedBlogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                alert("Error fetching blogs. Please try again.");
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="text-orange-900">
            <header className="bg-gradient-to-b from-blue-800 to-purple-600 h-screen flex flex-col items-center justify-center text-white text-center p-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Unleash Your Creativity with BlogGram</h1>
                    <p className="text-lg md:text-xl my-4 drop-shadow-md">Join a community of writers and thinkers sharing their stories, ideas, and experiences.</p>
                    <a href="/signup" className="bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-400 transition duration-200">Get Started</a>
                </div>
            </header>

            <section className="p-8 bg-gray-100 my-4 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl mb-4 font-semibold">Featured Blogs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
                    {featuredBlogs.length > 0 ? (
                        featuredBlogs.slice(0, 5).map((blog, index) => (
           
                           <div key={index} className="bg-white p-4 rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                            
                                <h3 className="font-semibold text-lg">{blog.title}</h3>
                                <h4 className="font-bold text-md">{blog.subtitle}</h4>
                                <img className="px-2 py-2 rounded-3xl object-cover w-full h-48 md:h-56" src={`${url}/${blog.img}`} alt="Uploaded" />
                                <a href={`/blog/${blog.author}/${blog.createdAt}`} className="text-orange-500 font-bold hover:underline">Read More</a>
                        
                            
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No posts available.</p>
                    )}
                </div>
            </section>

            <section className="p-8 bg-gray-100 my-4 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl mb-4 font-semibold underline">How It Works?</h2>
                <div className="flex flex-col md:flex-row justify-around mt-4 space-x-3">
                        <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/3 mb-4 md:mb-0 transition-transform duration-200 hover:scale-105 hover:bg-slate-300">
                            <h3 className="font-semibold text-lg">Sign Up</h3>
                            <p>Create an account in minutes</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/3 mb-4 md:mb-0 transition-transform duration-200 hover:scale-105 hover:bg-slate-300">
                        <h3 className="font-semibold text-lg">Write and Share</h3>
                        <p>Write and share blogs</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/3 mb-4 md:mb-0 transition-transform duration-200 hover:scale-105 hover:bg-slate-300">
                    <h3 className="font-semibold text-lg">Engage</h3>
                    <p>Like, Share, Comment</p>
                </div>
                
                    
                </div>
            </section>

            <section className="p-8 bg-gray-100 my-4 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl mb-4 font-semibold underline">Why Choose BlogGram?</h2>
                <ul className="list-disc list-inside text-center">
                    {/* <li>Connect with a vibrant community of writers.</li> */}
                    <li>Gain exposure for your work.</li>
                    <li>Receive feedback and support from peers.</li>
                    <li>Explore diverse topics and perspectives.</li>
                </ul>
            </section>

            <section className="p-8 bg-gray-100 my-4 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl mb-4 font-semibold underline">User Testimonials</h2>
                {['BlogGram has transformed my writing journey!', 'An amazing platform to share my thoughts and connect with others!'].map((quote, index) => (
                    <div key={index} className="bg-white p-4 my-2 rounded-lg shadow-md">
                        <p>{quote}</p>
                        <p>- Vaishnavi</p>
                    </div>
                ))}
            </section>

            <section className="p-8 bg-gray-100 my-4 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl mb-4 font-semibold">Explore Categories</h2>
                <div className="flex flex-wrap justify-center">
                    {['Technology', 'Lifestyle', 'Health', 'Business', 'Entertainment', 'Food', 'Art & Design', 'Science'].map((category, index) => (
                        <div key={index} className="bg-orange-500 text-white p-2 m-1 rounded-md transition-transform duration-200 hover:scale-105">
                            {category}
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-8 bg-gray-100 my-4 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl mb-4 font-semibold">Recent Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
                    {latestBlogs.length > 0 ? (
                        latestBlogs.slice(0, 5).map((blog, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                                <h3 className="font-semibold text-lg">{blog.title}</h3>
                                <h4 className="font-bold text-md">{blog.subtitle}</h4>
                                <img className="px-2 py-2 rounded-3xl object-cover w-full h-48 md:h-56" src={`${url}/${blog.img}`} alt="Uploaded" />
                                <a href={`/blog/${blog.author}/${blog.createdAt}`} className="text-orange-500 font-bold hover:underline">Read More</a>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No recent posts available.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
