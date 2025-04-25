import { useAuth } from '../Context/AuthContext.jsx';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // Handlers for Admin
  const handleManageUsers = () => {
    navigate('/candidates');
  };

  const handleManageCompanies = () => {
    navigate('/companies');
  };

  const handleVideoLibrary = () => {
    navigate('/videos');
  };

  const handleAdminTeam = () => {
    navigate('/admins');
  };

  const handleVideoApplications = () => {
    navigate('/videos');
  };

  const handleCandidateMessages = () => {
    navigate('/inbox');
  };

  const handleBenchmarking = () => {
    navigate('/top-candidates');
  };

  const handleSearchCandidates = () => {
    navigate('/candidates');
  };

  const handleTopCandidates = () => {
    navigate('/top-candidates');
  };

  const handleReviewsComments = () => {
    navigate('/videos');
  };

  const handleManagerMessages = () => {
    navigate('/inbox');
  };

  const handleAccountSettings = () => {
    navigate('/settings');
  };

  const handleGiveFeedback = () => {
    navigate('/feedback');
  };

  const renderAdminTiles = () => (
    <>
      <Card title="👤 Manage Users" description="View and manage all platform users" onClick={handleManageUsers} />
      <Card title="🏢 Manage Companies" description="CRUD companies and industries" onClick={handleManageCompanies} />
      <Card title="🎥 Video Library" description="View all uploaded videos" onClick={handleVideoLibrary} />
      <Card title="🧑‍💼 Admin Team" description="See all registered admins" onClick={handleAdminTeam} />
    </>
  );

  const renderCandidateTiles = () => (
    <>
      <Card title="📹 My Video Applications" description="Upload or manage your application videos" onClick={handleVideoApplications} />
      <Card title="💬 Messages" description="View or send messages" onClick={handleCandidateMessages} />
      <Card title="🧠 Industry Insights" description="Browse companies by industry" onClick={handleIndustryInsights} />
      <Card title="⭐ Top Candidates" description="See top-rated users for benchmarking" onClick={handleBenchmarking} />
    </>
  );

  const renderHiringManagerTiles = () => (
    <>
      <Card title="🔍 Search Candidates" description="View all candidates or their videos" onClick={handleSearchCandidates} />
      <Card title="🏆 Top Candidates" description="Highlight exceptional candidates" onClick={handleTopCandidates} />
      <Card title="📝 Comments" description="Leave feedback or comments" onClick={handleReviewsComments} />
      <Card title="📬 Messages" description="Message candidates" onClick={handleManagerMessages} />
    </>
  );

  const renderSharedTiles = () => (
    <>
      <Card title="⚙️ Account Settings" description="Update personal info" onClick={handleAccountSettings} />
      <Card title="💬 Give Feedback" description="Submit feedback to platform" onClick={handleGiveFeedback} />
    </>
  );

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome {user.name}!</h1>
      <div className="card-grid">
        {
          role === 'ADMIN'
            ? renderAdminTiles()
            : role === 'HIRING_MANAGER'
            ? renderHiringManagerTiles()
            : role === 'CANDIDATE'
            ? renderCandidateTiles()
            : null
        }
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