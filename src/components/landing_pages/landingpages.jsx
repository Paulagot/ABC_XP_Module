import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom'; // To access URL parameters
import axios from 'axios';
import { Helmet } from 'react-helmet-async'; // For SEO tags
import { useNavigate } from "react-router-dom"; // For navigation
import { useAuth} from '../../context/auth_context';
axios.defaults.withCredentials = true;

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth(); // Check if the user is authenticated
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [enrollmentStatus, setEnrollmentStatus] = useState(false); // Default: not enrolled
  const { slug } = useParams(); // Get the slug from the URL
  const [pageData, setPageData] = useState(null); // State to store fetched data
  const [error, setError] = useState(null); // State to store error messages
  const [loading, setLoading] = useState(true); // State to track loading

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Fetch Enrollment Status
    const fetchEnrollmentStatus = async () => {
      if (!isAuthenticated || !user) return;
  
      try {
        const endpoint = pageData.reference_type === "byte" ? "/api/user_bytes" : "/api/user_missions";
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          params: { user_id: user.user_id },
          withCredentials: true,
        });
  
        // Check if the user is enrolled in the current byte/mission
        const isEnrolled = response.data.some((entry) =>
          pageData.reference_type === "byte"
            ? entry.bite_id === pageData.reference_id
            : entry.mission_id === pageData.reference_id
        );
  
        setEnrollmentStatus(isEnrolled); // Update enrollment status
      } catch (err) {
        console.error("Error fetching enrollment status:", err);
      }
    };

    // Handle Enroll/Continue Click

  const handleEnrollClick = async () => {
    if (!pageData) {
      console.error("Page data is not available.");
      return;
    }

    if (!isAuthenticated || !user) {
     
      navigate("/register");
      return;
    }

    try {
      const zenlerLoggedIn = sessionStorage.getItem("zenlerLoggedIn");
      const { zenler_id: userZenlerId } = user; // Access user's Zenler ID
      const { zenler_id: courseZenlerId, reference_type } = pageData;

      if (enrollmentStatus) {
        // If already enrolled, redirect to the course page
        const targetUrl = pageData.player_url || pageData.url; // Adjust based on SSO logic
        window.location.href = targetUrl;
        return;
      }

      if (!userZenlerId || !courseZenlerId || !reference_type) {
        console.error("Missing required parameters:", { userZenlerId, courseZenlerId, reference_type });
        alert("An error occurred while enrolling. Please try again.");
        return;
      }

      const enrollResponse = await axios.post(
        `${API_BASE_URL}/api/enroll`,
        { userZenlerId, courseZenlerId, reference_type },
        { withCredentials: true }
      );

      if (enrollResponse.status === 200) {
        const targetUrl = reference_type === "mission" ? pageData.mission_url : pageData.url;

        if (zenlerLoggedIn === "true") {
          window.location.href = targetUrl;
          return;
        }

        const ssoResponse = await axios.post(
          `${API_BASE_URL}/api/sso`,
          { courseUrl: targetUrl },
          { withCredentials: true }
        );

        if (ssoResponse.status === 200) {
          const { ssoUrl } = ssoResponse.data;
          window.location.href = ssoUrl;
          sessionStorage.setItem("zenlerLoggedIn", "true");
        } else {
          alert("Failed to authenticate with Zenler. Please try again.");
        }
      } else {
        alert("Failed to enroll in the course. Please try again.");
      }
    } catch (error) {
      alert("An error occurred during enrollment. Please try again.");
    }
  };

  // Fetch content when the component mounts
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/landing-pages/${slug}`);
        setPageData(response.data); // Set the page data
        setLoading(false); // Loading complete
      } catch (err) {
        setError("Page not found.");
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug, API_BASE_URL]);

  // Fetch Enrollment Status when pageData changes
  useEffect(() => {
    if (pageData && isAuthenticated && user) {
      fetchEnrollmentStatus();
    }
  }, [pageData, isAuthenticated, user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Determine Button Label
  const buttonLabel = enrollmentStatus
    ? "Continue"
    : pageData.reference_type === "mission"
    ? "Accept Mission"
    : "Enroll";


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  

  return (
    <main className="container__right" id="main">
      {/* SEO Tags */}
      <Helmet>
        <title>{pageData.seo_title || 'Default Title'}</title>
        <meta name="description" content={pageData.meta_description || 'Default description'} />
        <meta name="keywords" content={pageData.meta_keywords || 'Default keywords'} />
        <meta property="og:title" content={pageData.social_title || 'Default Social Title'} />
        <meta property="og:description" content={pageData.social_description || 'Default Social Description'} />
        <meta property="og:image" content={pageData.social_image || '/default-image.png'} />
      </Helmet>

      {/* Page Content */}
      <div className="landing_top">
        <h1 className='landing_h'>{pageData.name}</h1>
        <h2 className='landing_h2'>{pageData.subtitle}</h2>
        <div className='top_continers'>

          <div className='top_left_container'>
          {pageData.sponsor_id && (
           <div className="sponsor-section_pg">
            
          <p className="sponsor-text_pg">With Thanks to our Sponsor:</p>
          <div className="sponsor-logo-pg">
            <img className='slogo' src={pageData.sponsor_image} alt="sponsor-logo" />
             </div>
           
           </div>
              )}
          </div>


         <img src={pageData.thumbnail} alt="course-img" className="byte_img_top" />


          <div className='top_right_container'>
            <div className="points-section_pg">
              <div className="points-icon_pg">
                <img  className='icon_pg' src="https://img.icons8.com/clouds/80/trophy--v2.png"/>
              </div>
              <div className='hex-icon_pg'>
              <div className='points_pg'>
  {pageData.reference_type === 'byte' ? pageData.points : pageData.xp}
</div>
              </div>
            </div>
          </div>
        </div>

        <div className="enrollbtn" onClick={handleEnrollClick}>
          {buttonLabel}
        </div>
      </div>
      

      {/* Render Rich Text Content */}
      <div className="Landing_btm">
        <div dangerouslySetInnerHTML={{ __html: pageData.rich_text_content }} />
        <div className="enrollbtn" onClick={handleEnrollClick}>
          {buttonLabel}
        </div>
        <h3>Summary</h3>
        <p>{pageData.summary}</p>
        <h3>Tags</h3>
        <p>{pageData.tags}</p>
      </div>
    </main>
  );
};

export default LandingPage;

