import { useAuth } from './Context/AuthContext.jsx';
import './Dashboard.css';
import {fetchAdmins} from '.././api/admin.js'
import { fetchIndustries} from'.././api/industries.js';
import {updateComment} from '.././api/comments.js';
import {
    fetchAllUsers,
    deleteUser,
    updateUser,
    fetchSingleUser
  } from '.././api/users.js';

  
  import {
    fetchCompanies,
    addCompany,
    deleteCompany,
  } from '.././api/companies.js';
  
  import {
    fetchFeedback,
    deleteFeedback,
    addFeedback
  } from '.././api/feedback.js';
  
  import {
    fetchReports,
    deleteReport,
    submitReport
  } from '.././api/reports.js';
  
  import {
    fetchAllVideos
  } from '.././api/videos.js';
  
  import {
    createTopCandidate,
    deleteTopCandidate,
    fetchTopCandidates
  } from '.././api/topCandidates.js';
  
  import {
    createReview,
    fetchAllReviews
  } from '.././api/reviews.js';
  
  import {
    fetchComments
  } from '.././api/comments.js';
  
  import {
    fetchMessages,
    sendMessage
  } from '.././api/messages.js';

const Dashboard = () => {
  const { user } = useAuth();

  // Handlers for Admin
  const handleManageUsers = () => {
    fetchAllUsers();
    deleteUser();
  };

  const handleManageCompanies = () => {
    fetchCompanies();
    addCompany();
    deleteCompany();
    fetchIndustries();
    addIndustry();
  };

  const handlePlatformFeedback = () => {
    fetchFeedback();
    deleteFeedback();
  };

  const handleReports = () => {
    fetchReports();
    deleteReport();
  };

  const handleVideoLibrary = () => {
    fetchAllVideos();
  };

  const handleAdminTeam = () => {
    fetchAdmins();
  };

  const handleVideoApplications = () => {
    fetchAllVideos();
  };

  const handleEmployerFeedback = () => {
    fetchComments();
    fetchAllReviews();
  };

  const handleCandidateMessages = () => {
    fetchMessages();
    sendMessage();
  };

  const handleIndustryInsights = () => {
    fetchCompanies();
    fetchIndustries();
  };

  const handleBenchmarking = () => {
    fetchTopCandidates();
  };

  const handleSearchCandidates = () => {
    fetchAllUsers();
    fetchAllVideos();
  };

  const handleTopCandidates = () => {
    createTopCandidate();
    deleteTopCandidate();
    fetchTopCandidates();
  };

  const handleReviewsComments = () => {
    createReview();
    createComment();
    updateComment();
    deleteComment();
  };

  const handleManagerMessages = () => {
    fetchMessages();
    sendMessage();
  };

  const handleAccountSettings = () => {
    fetchSingleUser();
    updateUser();
  };

  const handleSubmitReport = () => {
    submitReport();
  };

  const handleGiveFeedback = () => {
    addFeedback();
  };

  const renderAdminTiles = () => (
    <>
      <Card title="👤 Manage Users" description="View and manage all platform users" onClick={handleManageUsers} />
      <Card title="🏢 Manage Companies" description="CRUD companies and industries" onClick={handleManageCompanies} />
      <Card title="📝 Platform Feedback" description="Read and delete user feedback" onClick={handlePlatformFeedback} />
      <Card title="🚨 Reports" description="Moderate reported content or users" onClick={handleReports} />
      <Card title="🎥 Video Library" description="View all uploaded videos" onClick={handleVideoLibrary} />
      <Card title="🧑‍💼 Admin Team" description="See all registered admins" onClick={handleAdminTeam} />
    </>
  );

  const renderCandidateTiles = () => (
    <>
      <Card title="📹 My Video Applications" description="Upload or manage your application videos" onClick={handleVideoApplications} />
      <Card title="🗣 Feedback from Employers" description="Read comments or reviews from employers" onClick={handleEmployerFeedback} />
      <Card title="💬 Messages" description="View or send messages" onClick={handleCandidateMessages} />
      <Card title="🧠 Industry Insights" description="Browse companies by industry" onClick={handleIndustryInsights} />
      <Card title="⭐ Top Candidates" description="See top-rated users for benchmarking" onClick={handleBenchmarking} />
    </>
  );

  const renderHiringManagerTiles = () => (
    <>
      <Card title="🔍 Search Candidates" description="View all candidates or their videos" onClick={handleSearchCandidates} />
      <Card title="🏆 Top Candidates" description="Highlight exceptional candidates" onClick={handleTopCandidates} />
      <Card title="📝 Reviews & Comments" description="Leave feedback or comments" onClick={handleReviewsComments} />
      <Card title="📬 Messages" description="Message candidates" onClick={handleManagerMessages} />
      <Card title="📢 Post a Job" description="(Placeholder) Post new job openings" onClick={handleJobPost} />
    </>
  );

  const renderSharedTiles = () => (
    <>
      <Card title="⚙️ Account Settings" description="Update personal info" onClick={handleAccountSettings} />
      <Card title="❓ Submit Report" description="Report issues with content/users" onClick={handleSubmitReport} />
      <Card title="💬 Give Feedback" description="Submit feedback to platform" onClick={handleGiveFeedback} />
    </>
  );

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome {user?.name}!</h1>
      <div className="card-grid">
        {user?.role === 'admin' && renderAdminTiles()}
        {user?.role === 'hiringManager' && renderHiringManagerTiles()}
        {user?.role === 'candidate' && renderCandidateTiles()}
        {renderSharedTiles()}
      </div>
    </div>
  );
};

const Card = ({ title, description, onClick }) => (
  <div className="card" onClick={onClick} role="button" tabIndex={0}>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

export default Dashboard;