import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchIndustries } from "../../api/industries";
import { fetchCompanies } from "../../api/companies";
import { useAuth } from "../Context/AuthContext";
import './Industries.css';

const Industries = () => {
  const { role } = useAuth();
  const [industries, setIndustries] = useState([]);
  const [searchParam, setSearchParam] = useState('');
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const industries = await fetchIndustries();
      const companies = await fetchCompanies();
      setIndustries(industries);
      setCompanies(companies);
    }
    loadData();
  }, []);

  const industriesToDisplay = searchParam
    ? industries.filter((i) => i.name.toLowerCase().includes(searchParam.toLowerCase()))
    : industries;

  const getCompaniesForIndustry = (industryId) => {
    return companies.filter((company) => company.industryId === industryId);
  };

  async function handleIndustryDetails(industryId) {
    navigate(`/industries/${industryId}`);
  }

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
      <div className="allIndustries">
        {industriesToDisplay.map((industry) => {
          const industryCompanies = getCompaniesForIndustry(industry.id);
          return (
            <div key={industry.id} className="industryCard">
              <h4>{industry.name}</h4>
              <div className="industryCompanies">
                <h5>Companies:</h5>
                {industryCompanies.length > 0 ? (
                  <ul>
                    {industryCompanies.map((company) => (
                      <li key={company.id}>{company.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No companies available</p>
                )}
              </div>
              <button
                className="details"
                onClick={() => handleIndustryDetails(industry.id)}
              >
                More Details
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Industries;