import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blogs from "./components/Home/Blogs";
import Footer from "./components/ui/Footer";
import UserContext from "./components/Auth/UserContext"; // Importing UserContext
import Navbar from "./components/ui/Navbar";
import Home from "./components/Home/Home";
import NotFound from "./components/Add Blogs/NotFound";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import Add from "./components/Add Blogs/Add";
import BlogDetails from "./components/Home/BlogDetails";
import Prof from "./components/Home/Prof";
import EditBlogs from "./components/Home/EditBlogs";
import DisplayAblog from "./components/Home/DisplayAblog";
import EditProfile from "./components/Home/EditProfile";
import Forgotpwd from "./components/Auth/Forgotpwd";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  return (
    <BrowserRouter>
     <UserContext.Provider value={{ user, setUser }}> {/* Providing user and setUser via context */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:author/:createdAt" element={<BlogDetails />} />
        <Route path="/profile/addBlog/:author" element={<Add />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/signin" element={<SignIn/>} />
        
        <Route path="/signin/forgotpwd" element = {<Forgotpwd />} />
        <Route path="/profile" element={<Prof user={user}/>} />
        <Route path="/profile/:author/:createdAt" element={<DisplayAblog />} />
        <Route path="/profile/EditBlog/:author/:createdAt" element={<EditBlogs />} />
        <Route path="/profile/editProfile" element={<EditProfile setUser={setUser} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default App;