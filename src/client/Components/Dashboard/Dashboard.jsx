import { useAuth } from "../Context/AuthContext.jsx";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBuilding,
  FaVideo,
  FaUserTie,
  FaComments,
  FaCompass,
  FaBullseye,
  FaBrain,
  FaStar,
  FaSearch,
  FaTrophy,
  FaLifeRing,
  FaRegComments,
  FaEnvelope,
  FaCog,
  FaCommentDots,
} from "react-icons/fa";

const Dashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // Handlers for Admin
  const handleManageUsers = () => {
    navigate("/candidates");
  };

  const handleManageCompanies = () => {
    navigate("/companies");
  };

  const handleVideoLibrary = () => {
    navigate("/videos");
  };

  const handleAdminTeam = () => {
    navigate("/admins");
  };

  const handleVideoApplications = () => {
    navigate("/videos");
  };

  const handleCandidateMessages = () => {
    navigate("/inbox");
  };

  const handleExplore = () => {
    navigate("/explore");
  };

  const handleGetFound = () => {
    navigate("/get-found");
  };

  const handleLostHiring = () => {
    navigate("/lost-hiring");
  };

  const handleBenchmarking = () => {
    navigate("/topCandidates");
  };

  const handleSearchCandidates = () => {
    navigate("/candidates");
  };

  const handleTopCandidates = () => {
    navigate("/topCandidates");
  };

  const handleIndustryInsights = () => {
    navigate("/explore");
  };

  const handleReviewsComments = () => {
    navigate("/videos");
  };

  const handleManagerMessages = () => {
    navigate("/inbox");
  };

  const handleAccountSettings = () => {
    navigate("/settings");
  };

  const handleGiveFeedback = () => {
    navigate("/feedback");
  };

  const renderAdminTiles = () => (
    <>
      <Card
        icon={<FaUser />}
        title="Manage Users"
        description="View and manage all platform users"
        onClick={handleManageUsers}
      />
      <Card
        icon={<FaBuilding />}
        title="Manage Companies"
        description="CRUD companies and industries"
        onClick={handleManageCompanies}
      />
      <Card
        icon={<FaVideo />}
        title="Video Library"
        description="View all uploaded videos"
        onClick={handleVideoLibrary}
      />
      <Card
        icon={<FaUserTie />}
        title="Admin Team"
        description="See all registered admins"
        onClick={handleAdminTeam}
      />
    </>
  );

  const renderCandidateTiles = () => (
    <>
      <Card
        icon={<FaVideo />}
        title="My Video Applications"
        description="Upload or manage your application videos"
        onClick={handleVideoApplications}
      />
      <Card
        icon={<FaComments />}
        title="Messages"
        description="View or send messages"
        onClick={handleCandidateMessages}
      />
      <Card
        icon={<FaCompass />}
        title="Explore"
        description="Explore different companies and industries"
        onClick={handleExplore}
      />
      <Card
        icon={<FaBullseye />}
        title="Get Found"
        description="Discover what employers are looking for"
        onClick={handleGetFound}
      />
      <Card
        icon={<FaBrain />}
        title="Industry Insights"
        description="Browse companies by industry"
        onClick={handleIndustryInsights}
      />
      <Card
        icon={<FaStar />}
        title="Top Candidates"
        description="See top-rated users for benchmarking"
        onClick={handleBenchmarking}
      />
    </>
  );

  const renderHiringManagerTiles = () => (
    <>
      <Card
        icon={<FaSearch />}
        title="Search Candidates"
        description="View all candidates or their videos"
        onClick={handleSearchCandidates}
      />
      <Card
        icon={<FaTrophy />}
        title="Top Candidates"
        description="Highlight exceptional candidates"
        onClick={handleTopCandidates}
      />
      <Card
        icon={<FaLifeRing />}
        title="Lost at Hiring?"
        description="Discover how our platform redefines the hiring experience"
        onClick={handleLostHiring}
      />
      <Card
        icon={<FaCompass />}
        title="Explore"
        description="Explore different companies and industries"
        onClick={handleExplore}
      />
      <Card
        icon={<FaRegComments />}
        title="Comments"
        description="Leave feedback or comments"
        onClick={handleReviewsComments}
      />
      <Card
        icon={<FaEnvelope />}
        title="Messages"
        description="Message candidates"
        onClick={handleManagerMessages}
      />
    </>
  );

  const renderSharedTiles = () => (
    <>
      <Card
        icon={<FaCog />}
        title="Account Settings"
        description="Update personal info"
        onClick={handleAccountSettings}
      />
      <Card
        icon={<FaCommentDots />}
        title="Give Feedback"
        description="Submit feedback to platform"
        onClick={handleGiveFeedback}
      />
    </>
  );

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome to Foundra!</h1>
      <div className="card-grid">
        {role === "ADMIN"
          ? renderAdminTiles()
          : role === "HIRING_MANAGER"
          ? renderHiringManagerTiles()
          : role === "CANDIDATE"
          ? renderCandidateTiles()
          : null}
        {renderSharedTiles()}
      </div>
    </div>
  );
};

const Card = ({ icon, title, description, onClick }) => (
  <div className="card" onClick={onClick} role="button" tabIndex={0}>
    <div className="card-header">
      <div className="card-icon">{icon}</div>
      <h2 className="card-title">{title}</h2>
   </div>
    <p className="card-desc">{description}</p>
  </div>
);

export default Dashboard;