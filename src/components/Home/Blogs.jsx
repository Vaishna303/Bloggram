import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UserContext from '../Auth/UserContext';

const Tag = ({ text, color, bgColor, onClick }) => {
  return (
    <p className={` ${color} ${bgColor} px-2 py-2 rounded-2xl cursor-pointer`} onClick={onClick}>
      {text}
    </p>
  );
};

const Blogs = () => {
  const { user } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const [category, setCategory] = useState("All");
  const categories = ["All", "Technology", "Lifestyle", "Health", "Business", "Entertainment", "Food", "Art", "Science", "Sports", "Politics", "Other"];
  
  
  //const url = "http://localhost:3002";
  const url = "https://bloggram-2.onrender.com";
    
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${url}/api/getAllBlogs`);
        const sortedBlogs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBlogs(sortedBlogs);

        const allTags = response.data.reduce((acc, blog) => {
          blog.hashtag.forEach(tag => {
            if (!acc.includes(tag)) {
              acc.push(tag);
            }
          });
          return acc;
        }, []).sort();
        setTags(allTags);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        alert("Error fetching blogs. Please try again.");
      }
    };
    fetchBlogs();
  }, []);

  const handleTagClick = tag => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  const toggleShowAllTags = () => {
    setShowAllTags(!showAllTags);
  };

  const filteredTags = showAllTags ? tags : tags.slice(0, 5);
  const filteredBlogs = blogs.filter(blog => {
    const isSearchTextMatched =
      blog.author.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchText.toLowerCase()) ||
      
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.subtitle.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchText.toLowerCase()) ||
      new Date(blog.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).toLowerCase().includes(searchText.toLowerCase()) ||
      blog.hashtag.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));

    const areTagsMatched = selectedTags.every(tag => blog.hashtag.includes(tag));
    const isCategoryMatched = category === "All" || blog.category === category;

    return isSearchTextMatched && (selectedTags.length === 0 || areTagsMatched) && isCategoryMatched;
  });

  return (
    <div className="mt-4 w-full mx-auto py-2 overflow-y-auto">
      <div className="flex justify-between items-center mb-3 flex-col">
        <input
          type="text"
          className="mt-5 mb-5 px-4 py-2 max-w-xl rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Search blogs..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Category Selection */}
        <div className="flex mx-8 justify-between bg-slate-500 rounded overflow-x-auto">
          {categories.map((cat, index) => (
            <p
              key={index}
              onClick={() => setCategory(cat)}
              className={`cursor-pointer px-4 py-2 ${
                category === cat ? "bg-blue-500 text-white rounded" : ""
              }`}
            >
              {cat}
            </p>
          ))}
        </div>


        {/* Tag Filters */}
        <div className="flex flex-wrap mx-10 sm:max-w-none bg-zinc-500 rounded-2xl overflow-y-auto justify-center" style={{ maxHeight: "80px" }}>
          {filteredTags.map(tag => (
            <Tag
              key={tag}
              text={`#${tag}`}
              color={selectedTags.includes(tag) ? "text-green-900" : ""}
              bgColor={selectedTags.includes(tag) ? "bg-green-400" : ""}
              onClick={() => handleTagClick(tag)}
            />
          ))}
          {!showAllTags && tags.length > 5 && (
            <Tag
              text="Show All"
              color="text-blue-900"
              bgColor="bg-blue-400"
              onClick={toggleShowAllTags}
            />
          )}
          {selectedTags.length > 0 && (
            <Tag
              text="Clear Filters"
              color="text-red-900"
              bgColor="bg-red-400"
              onClick={handleClearFilters}
            />
          )}
        </div>
      </div>

      {/* Blogs */}
      <ul className="w-full grid grid-cols-1 px-5 py-2 text-slate-300 font-medium gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredBlogs.map((blog, index) => (
          <li key={index} className="hover:border-2 hover:border-white rounded-2xl border-4 border-neutral-800 p-3">
            <Link to={`/blog/${blog.author}/${blog.createdAt}`}>
              <p className="author text-slate-300 h-7">{blog.author}</p>
              <p className="date text-slate-300 h-7">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <img
                className="px-2 py-2 rounded-3xl"
                style={{ height: "300px", width: "500px" }}
                src={`${url}/${blog.img}`}
                alt="Uploaded"
              />
              <div className="w-full px-4 py-2 flex flex-col gap-3">
                <h3 className="title text-xl font-bold text-slate-50 min-h-6">{blog.title}</h3>
                <p className="subtitle text-slate-500 font-medium min-h-4">{blog.subtitle}</p>
                <div className="tags w-full flex gap-0 mt-0 min-h-6">
                  {blog.hashtag.map((tag, index) => (
                    <Tag key={index} text={`#${tag}`} color={"text-green-900"} bgColor={"transparent"} />
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
