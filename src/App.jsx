import NavBar from "./Navbar";
import { Routes, Route } from "react-router-dom"
import Home from "./screens/Home";
import Category from "./screens/Home/category";
import SaveArticle from "./screens/Saved Article";
import NewsDetail from "./screens/news detail";
export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/saved-article" element={<SaveArticle />} />
        <Route path="/news/:id" element={<NewsDetail />} />
      </Routes>
    </>
  )
}
