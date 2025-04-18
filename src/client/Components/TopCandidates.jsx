import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {fetchTopCandidates, createTopCandidate, deleteTopCandidate,} from "../api/topCandidates";

const TopCandidates = () => {
  const [topCandidates, setTopCandidates] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function renderTopCandidates() {
      const topCandidates = await fetchTopCandidates();
      setTopCandidates(topCandidates);
    }
    renderTopCandidates();
  }, []);

  const topCandidatesToDisplay = searchParam
    ? topCandidates.filter((idx) =>
        idx.name.toLowerCase().includes(searchParam)
      )
    : topCandidates;

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
      <div className="allTopCandidates">
        {(topCandidates || []).map((idx) => {
          return (
            <div key={idx.id} className="topCandidate">
              <h4>{idx.name}</h4>
              <h6>{idx.email}</h6>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TopCandidates;
