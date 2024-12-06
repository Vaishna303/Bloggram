import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { motion } from 'framer-motion';
import UserContext from '../Auth/UserContext';

const Home = () => {
    const { user } = useContext(UserContext);
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);

    // const url = "http://localhost:3002";
    const url = "https://bloggram-2.onrender.com";

      const categories = [
            'Technology', 'Lifestyle', 'Health', 'Business',
            'Entertainment', 'Food', 'Art & Design', 'Science'
        ];
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${url}/api/getAllBlogs`);
                const featured = [...response.data].sort((a, b) => b.likes - a.likes);
                const sortedBlogs = [...response.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setFeaturedBlogs(featured);
                setLatestBlogs(sortedBlogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                alert("Error fetching blogs. Please try again.");
            }
        };
        fetchBlogs();
    }, []);

    const testimonials = [
        {
            quote: "BlogGram has transformed my writing journey!",
            author: "Vaishnavi",
        },
        {
            quote: "An amazing platform to share my thoughts and connect with others!",
            author: "John Doe",
        },
    ];

    return (
        <div className="text-gray-900">
            {/* Header Section */}
            <header className="bg-gradient-to-b from-purple-600 to-blue-800 h-screen flex flex-col items-center justify-center text-white text-center">
               
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">Unleash Your Creativity</h1>
                    <p className="text-lg md:text-xl my-4 drop-shadow-md">Share stories, ideas, and experiences on BlogGram.</p>
                    <p><Link to="/signup" className="bg-orange-500 text-white py-2 px-6 rounded-lg font-bold hover:bg-orange-400 transition-all duration-200">
                        Get Started
                    </Link></p>
                </motion.div>
            </header>

            {/* Featured Blogs */}
            <section className="p-8 bg-gradient-to-r from-indigo-100 to-gray-50 my-4 rounded-lg shadow-lg">
                <motion.h2
                    className="text-center text-3xl mb-6 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    Featured Blogs
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredBlogs.length > 0 ? (
                        featuredBlogs.slice(0, 3).map((blog, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="font-semibold text-lg">{blog.title}</h3>
                                <h4 className="font-bold text-md text-gray-600">{blog.subtitle}</h4>
                                <img
                                    className="rounded-xl w-full h-48 object-cover my-4"
                                    src={`${url}/${blog.img}`}
                                    alt="Blog Visual"
                                />
                                <Link
                                    to={`/blog/${blog.author}/${blog.createdAt}`}
                                    className="text-orange-500 font-bold hover:underline"
                                >
                                    Read More
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center">No featured blogs available.</p>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="p-8 bg-gradient-to-r from-indigo-100 to-gray-50 my-8 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl mb-6 font-semibold underline">How It Works?</h2>
                <motion.div
                    className="flex flex-col md:flex-row justify-around gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1 },
                    }}
                >
                    {["Sign Up", "Write and Share", "Engage"].map((step, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-md text-center transition-transform duration-200 hover:scale-105"
                            whileHover={{ scale: 1.1 }}
                        >
                            <h3 className="font-semibold text-lg">{step}</h3>
                            <p className="text-gray-600 mt-2">
                                {index === 0
                                    ? "Create an account in minutes."
                                    : index === 1
                                    ? "Write and share amazing blogs."
                                    : "Like, share, and comment to engage."}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
            <section className="p-8 bg-gradient-to-r from-indigo-100 to-gray-50 my-4 rounded-lg shadow-lg space-y-8">
            {/* Why Choose BlogGram Section */}
           
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-center text-2xl mb-4 font-semibold underline">Why Choose BlogGram?</h2>
                <ul className="list-disc list-inside text-center text-lg">
                    <li>Gain exposure for your work.</li>
                    <li>Receive feedback and support from peers.</li>
                    <li>Explore diverse topics and perspectives.</li>
                </ul>
            </motion.section>
            </section>
            <section className="p-8 bg-gradient-to-r from-indigo-100 to-gray-50 my-4 rounded-lg shadow-lg space-y-8">
           
            {/* User Testimonials Section */}
            <motion.section
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-center text-2xl mb-4 font-semibold underline">User Testimonials</h2>
                <div className="flex flex-col md:flex-row justify-center space-x-4 space-y-4 md:space-y-0">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/3"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <p className="italic text-gray-700">"{testimonial.quote}"</p>
                            <p className="font-bold text-gray-900 mt-2">- {testimonial.author}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
            </section>
             <section className="p-8 bg-gradient-to-r from-indigo-100 to-gray-50 my-4 rounded-lg shadow-lg space-y-8">
           
            {/* Explore Categories Section */}
           
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-center text-2xl mb-4 font-semibold underline">Explore Categories</h2>
                <div className="flex flex-wrap justify-center">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            className="bg-orange-500 text-white p-2 m-1 rounded-md shadow-md cursor-pointer"
                            whileHover={{ scale: 1.1, backgroundColor: '#ff704d' }}
                            transition={{ duration: 0.3 }}
                        >
                            {category}
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </section>
            {/* Recent Posts */}
            <section className="p-8 bg-gradient-to-r from-indigo-100 to-gray-50 my-4 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl mb-6 font-semibold">Recent Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestBlogs.length > 0 ? (
                        latestBlogs.slice(0, 3).map((blog, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="font-semibold text-lg">{blog.title}</h3>
                                <h4 className="font-bold text-md text-gray-600">{blog.subtitle}</h4>
                                <img
                                    className="rounded-xl w-full h-48 object-cover my-4"
                                    src={`${url}/${blog.img}`}
                                    alt="Blog Visual"
                                />
                                <Link
                                    to={`/blog/${blog.author}/${blog.createdAt}`}
                                    className="text-orange-500 font-bold hover:underline"
                                >
                                    Read More
                                </Link>
                            </motion.div>
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
