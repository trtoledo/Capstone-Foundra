import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchAllUsers } from "../../api/users";
import "./Candidates.css"

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function renderCandidates() {
      const fetchedCandidates = await fetchAllUsers();
      // Filter to show only candidates (assuming your user objects have a 'role' property)
      const candidateList = fetchedCandidates.filter(user => user.role === 'CANDIDATE');
      setCandidates(candidateList);
    }
    renderCandidates();
  }, []);

  const candidatesToDisplay = searchParam
    ? candidates.filter((candidate) =>
        candidate.name.toLowerCase().includes(searchParam.toLowerCase())
      )
    : candidates;

  return (
    <div className="candidatesContainer">
      <h2>Candidates</h2>
      <div className="search">
        <label>
          Search:{" "}
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchParam(e.target.value.toLowerCase())}
          />
        </label>
      </div>
      <div className="allCandidates">
        {candidatesToDisplay.map((candidate) => (
          <div
            key={candidate.id}
            className="candidate"
            onClick={() => navigate(`/candidates/${candidate.id}`)}
          >
            <h4>{candidate.name}</h4>
            <h6>{candidate.email}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Candidates;
