import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from '../Context/AuthContext';
import { fetchMessages } from "../../api/messages";
import { fetchSingleUser } from "../../api/users";
import { fetchAllVideos, fetchSingleVideo } from "../../api/videos";
import "./SingleCandidate.css"

const SingleCandidate = () => {
    const { token, setRefresh, refresh } = useAuth();
    const [candidate, setCandidate] = useState(null);
    const [videos, setVideos] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getCandidate(candidateId) {
            const response = await fetchSingleUser(candidateId);
            return response;
        }
        async function getCandidateVideos() {
            const response = await fetchAllVideos();
            return response;
        }

        async function getCandidateInfo() {
          try {
            const responseCand = await getCandidate(id);
            const responseVids = await getCandidateVideos();

            setCandidate(responseCand);
            setVideos(responseVids);

          } catch (err) {
            setError("Failed to load candidate data.");
            console.error("Error fetching candidate data:", err);
          }
        }

        getCandidateInfo();
    }, [id, token]);

    if (error) {
      return <div className="error">{error}</div>;
    }
  
    if (!candidate) {
      return <div className="loading">Loading candidate info...</div>;
    }
  
    return (
      <div className="singleCandidateContainer">
        <h2>{candidate.name}</h2>
        <div className="candidateInfo">
          <p>Email: {candidate.email}</p>
          {candidate.bio && <p>Bio: {candidate.bio}</p>}
          {candidate.resumeUrl && <p>Resume: <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>}
          {candidate.avatarUrl && <img src={candidate.avatarUrl} alt="Avatar" style={{ maxWidth: '100px', borderRadius: '50%' }} />}
        </div>
  
        {videos && videos.length > 0 && (
          <div className="videosSection">
            <h4>Submitted Videos</h4>
            {videos.map((video, index) => (
              <div key={index} className="videoContainer">
                <video controls width="300">
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p>{video.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );     
};
 
export default SingleCandidate;