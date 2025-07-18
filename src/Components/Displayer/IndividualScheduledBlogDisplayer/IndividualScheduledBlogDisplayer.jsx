import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import "./IndividualScheduledBlogDisplayer.css";
import Navbar from "../../Navbars/Navbar/Navbar";
import axios from "axios";
import { useUser } from "../../Contexts/ContextProvider";
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: '1rem'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Loading recipe...</p>
  </div>
);
const IndividualScheduleBlogDisplayer= () => {
  const {userId,loading}=useUser();
  const {blog_id}=useParams();
  
  const [image_urls,setimage_url]=useState([]);
  const [video_url,setvideo_url]=useState("");
  const [blog,setBlog]=useState({});

  const [pageloading,setload]=useState(true);
  const averageWPM = 200;
  const [readTimeInMinutes,setReadtime]=useState(0);
    const [difficultyLevel,setDifficulty]=useState("");
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [createdAt, setCreatedAt] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [authorId, setAuthorId] = useState('');

  useEffect(()=>{
    const fetchBlog = async () => {
        const API = `https://recipepedia-blog-backend.onrender.com/api/get/scheduled_blog`;
        const response = await axios.get(API, { params: { blog_id } });
        const blogData = response.data?.scheduled_blog // corrected key
        if (!blogData) {
            console.error("No blog data found");
            return;
        }

        setBlog(blogData);

        setTitle(blogData.title || '');
        setContent(blogData.content || '');
        setCategories(blogData.categories || []);
        setIngredients(blogData.ingredients || []);
        setCreatedAt(blogData.createdat || '');
        setDifficulty(blogData.difficulty || '');
        setDate(blogData.date || '');
        setTime(blogData.time || '');
        setAuthorId(blogData.user_id || '');

        const wordCount = blogData.content?.split(/\s+/).length || 0;
        setReadtime(Math.ceil(wordCount / averageWPM));
        setload(false);
        };

    fetchBlog();
  },[blog_id])



  

  const [selectedImage, setSelectedImage] = useState(null);
const [overlayActive, setOverlayActive] = useState(false);

const handleImageClick = (imageUrl, index) => {
  setSelectedImage({ url: imageUrl, index });
  setOverlayActive(true);
};

const handleCloseOverlay = () => {
  setSelectedImage(null);
  setOverlayActive(false);
};

const handlePrevImage = () => {
  if (selectedImage.index > 0) {
    setSelectedImage({
      url: image_urls[selectedImage.index - 1].image_url,
      index: selectedImage.index - 1
    });
  }
};

const handleNextImage = () => {
  if (selectedImage.index < image_urls.length - 1) {
    setSelectedImage({
      url: image_urls[selectedImage.index + 1].image_url,
      index: selectedImage.index + 1
    });
  }
};
 

    const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`https://recipepedia-blog-backend.onrender.com/api/blogs/${blog_id}`);
      navigate('/');
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete recipe. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };



  useEffect(()=>{
    const fetchImages= async ()=>{
      try{
        const API=`https://recipepedia-blog-backend.onrender.com/api/get/blogs/images/${blog_id}`;
        const response=await axios.get(API);
        const urls=response.data.image_urls;
        setimage_url(urls);
      }
      catch(error){
        console.log("Error occurred",error);
      }
    }
    fetchImages();
  },[blog_id])


  useEffect(()=>{
    const fetchVideos=async ()=>{
      try{
        const API=`https://recipepedia-blog-backend.onrender.com/api/get/blogs/videos/${blog_id}`;
        const response=await axios.get(API);

        const urls=response.data.video_url;
        setvideo_url(urls);
      }
      catch(error){
        console.log("Error occured",error);
      }
    }
    fetchVideos();
  },[blog_id]);



  if (loading || pageloading) {
      return <LoadingSpinner/>;
}
  return (
    <div>
      <Navbar />
      <div className="full-blog-container">
        <div className="full-blog-card">
          <div className="blog-header">
            <h3>Read time {readTimeInMinutes} Minutes</h3>
            <h1 className="blog-title-caps">{title.toUpperCase()}</h1>
            <div className="blog-header-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="blog-date">
               Scheduled at: {new Date(createdAt).toLocaleDateString()} {time}
              </span>

              <span className="difficulty-level">{difficultyLevel}</span>

              {!loading && userId === blog.user_id && ( 
                <div>
                              <span
            onClick={() => {navigate(`/edit-post/${blog_id}`);}}
            role="button"
            title="Edit Recipe"
            aria-label="Edit recipe"
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              transition: "all 0.3s ease",
              border: "2px solid #388E3C",
              boxShadow: "0 0 3px rgba(0,0,0,0.3)",
              marginLeft: "8px"
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </span>
                              <span
                        onClick={handleDelete}
                        role="button"
                        title="Delete Recipe"
                        aria-label="Delete recipe"
                        style={{
                          cursor: isDeleting ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#ff4444",
                          transition: "all 0.3s ease",
                          border: "2px solid #cc0000",
                          boxShadow: "0 0 3px rgba(0,0,0,0.3)",
                          marginLeft: "8px",
                          opacity: isDeleting ? 0.7 : 1
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </span>
                </div>

                    
                  )}
            </div>
          </div>

          {ingredients && ingredients.length > 0 && (
            <div className="ingredients-section">
              <h3>Ingredients:</h3>
              <ul>
                {ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}


{image_urls && image_urls.length > 0 && (
  <>
    <div className="recipe-image-gallery">
      <h3>Recipe Photos</h3>
      <div className="image-grid">
        {image_urls.map((url, index) => (
          <div 
            key={index} 
            className="image-container"
            onClick={() => handleImageClick(url.image_url, index)}
          >
            <img 
              src={url.image_url} 
              alt={`Recipe step ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>

    {/* Image Overlay */}
    <div className={`overlay ${overlayActive ? 'active' : ''}`}>
      <button className="close-button" onClick={handleCloseOverlay}>
        ×
      </button>
      {selectedImage && (
        <>
          <img 
            src={selectedImage.url} 
            alt="Selected recipe" 
            className="overlay-image"
          />
          <div className="overlay-navigation">
            <button 
              className="nav-button"
              onClick={handlePrevImage}
              style={{ visibility: selectedImage.index > 0 ? 'visible' : 'hidden' }}
            >
              ←
            </button>
            <button 
              className="nav-button"
              onClick={handleNextImage}
              style={{ 
                visibility: selectedImage.index < image_urls.length - 1 
                  ? 'visible' 
                  : 'hidden' 
              }}
            >
              →
            </button>
          </div>
        </>
      )}
    </div>
  </>
)}

{/* After the image gallery section, add: */}
{video_url && video_url.length > 0 && (
  <div className="recipe-video-section">
    <h3>Recipe Video</h3>
    <div className="video-container">
      <video 
        controls
        className="recipe-video"
        poster={image_urls.length > 0 ? image_urls[0].image_url : null}
      >
        <source src={video_url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
)}

          <div className="blog-content">
            <h3>Recipe Instructions</h3>
            <div className="content-box">
              {content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="blog-categories">
            <h3>Categories:</h3>
            <div className="categories-tags">
              {categories && categories.length > 0
                ? categories.map((category, idx) => (
                  <span key={idx} className="category-tag">{category}</span>
                ))
                : 'N/A'
              }
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
export default IndividualScheduleBlogDisplayer