import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCompanies } from "../../api/companies";
import { fetchIndustries } from "../../api/industries";
import { useAuth } from "../Context/AuthContext";
import "./Explore.css";

const Explore = () => {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCompanies = await fetchCompanies();
        const fetchedIndustries = await fetchIndustries();
        setCompanies(fetchedCompanies);
        setIndustries(fetchedIndustries);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [refresh]);

  const companiesByIndustry = industries.map((industry) => ({
    ...industry,
    companies: companies.filter(
      (company) => company.industryId === industry.id // Use industryId directly
    ),
  }));

  return (
    <div className="exploreContainer">
      <div className="section">
        <h2>Explore Companies by Industry</h2>
        {companiesByIndustry.map((industry) => (
          <div key={industry.id} className="industrySection">
            <h3>{industry.name}</h3>
            <div className="cardGrid">
              {industry.companies.length > 0 ? (
                industry.companies.map((company) => (
                  <div
                    key={company.id}
                    className="card clickable"
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    <h4>{company.name}</h4>
                    <p>{company.description || "No description"}</p>
                  </div>
                ))
              ) : (
                <p className="noCompanies">No companies in this industry.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;