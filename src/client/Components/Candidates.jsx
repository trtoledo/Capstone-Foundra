import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchAllUsers, updateUser, deleteUser } from "../api/users";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function renderCandidates() {
      const candidates = await fetchAllUsers();
      setCandidates(candidates);
    }
    renderCandidates();
  }, []);

  const candidatesToDisplay = searchParam
    ? candidates.filter((idx) => idx.name.toLowerCase().includes(searchParam))
    : candidates;

  return (
    <>
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
        {(candidates || []).map((idx) => {
          return (
            <div key={idx.id} className="candidate">
              <h4>{idx.name}</h4>
              <h6>{idx.email}</h6>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Candidates;
