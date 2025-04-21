import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from '../Context/AuthContext';
import { fetchMessages, sendMessage } from "../../api/messages";
const SingleCandidate = () => {
    const { token, setRefresh, refresh } = useAuth();
    const [candidate, setCandidate] = useState(null);
    const [videos, setVideos] = useState(null);
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState('');
    const [showUpdate, setShowUpdate] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getCandidate() {
            const response = await getSingleCandidate(id);
            return response;
        }
        async function getCandidateVideos() {
            const response = await getVideos(id);
            return response;
        }
        async function getMessages() {
            const response = await fetchMessages(token);
            return response;
        }

        async function getCandidateInfo() {
            const responseCand = await getSingleCandidate(id);
            const responseVids = await getVideos(id);
            const responseMsg = await fetchMessages(token);
            setCandidate(responseCand);
            setVideos(responseVids);
            setAllMessages(responseMsg);
        }

        getCandidateInfo();
    }, []);

    const handleMessage = async () => {
        try {
            const response = await sendMessage(id, token);
            setMessage(response);
            setRefresh(!refresh);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
          {error && <p>{error}</p>}
      
          {candidate ? (
            <div>
              <h2>{candidate.name}</h2>
              <p>Email: {candidate.email}</p>
            </div>
          ) : (
            <p>Loading candidate info...</p>
          )}
      
          {videos ? (
            <div>
              <h4>Submitted Videos</h4>
              {videos.map((video, index) => (
                <div key={index}>
                  <video controls width="300">
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p>{video.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading videos...</p>
          )}
      
          {messages ? (
            <div>
              <h4>Messages</h4>
              <ul>
                {messages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Loading messages...</p>
          )}
      
          <button onClick={() => setShowUpdate(!showUpdate)}>
            {showUpdate ? "Cancel Message" : "Send Message"}
          </button>

          {showUpdate && (
            <form onSubmit={handleMessage}>
              <h4>Send Message</h4>
              <textarea
                rows="4"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                required
              />
              <button type="submit">Send</button>
            </form>
          )}
      
          {message && <p>Message sent: {message}</p>}
        </div>
      );      
};
 
export default SingleCandidate;