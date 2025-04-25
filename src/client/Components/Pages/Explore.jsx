import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCompanies } from "../../api/companies";
import { fetchIndustries } from "../../api/industries";
import { useAuth } from "../Context/AuthContext";
import "./Explore.css";

const Explore = () => {
  const { token, refresh, setRefresh } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [industries, setIndustries] = useState([]);
  const [industryName, setIndustryName] = useState("");
  const [industryId, setIndustryId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const CompaniesData = await fetchCompanies();
        const IndustriesData = await fetchIndustries();
        setCompanies(CompaniesData);
        setIndustries(IndustriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [refresh]);

  const companiesByIndustry = industries.map((industry) => ({
    ...industry,
    companies: companies.filter(
      (company) => company.industry?.id === industry.id
    ),
  }));

  // useEffect(() => {
  //   if (selectedCompanyId) {
  //     const company = companies.find((c) => c.id === selectedCompanyId);
  //     if (company) {
  //       setCompanyName(company.name);
  //       setIndustryId(company.industryId || "");
  //     }
  //   }
  // }, [selectedCompanyId, companies]);

  // useEffect(() => {
  //   if (selectedIndustryId) {
  //     const industry = industries.find((i) => i.id === selectedIndustryId);
  //     if (industry) {
  //       setIndustryName(industry.name);
  //     }
  //   }
  // }, [selectedIndustryId, industries]);

  return (
    <div className="explore-container">
      <div className="section">
        <h2>Explore Companies by Industry</h2>
        {companiesByIndustry.map((industry) => (
          <div key={industry.id} className="industry-section">
            <h3>{industry.name}</h3>
            <div className="card-grid">
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
                <p>No companies in this industry.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Industries</h2>
        <div className="card-grid">
          {industries.map((industry) => (
            <div key={industry.id} className="card">
              <h3>{industry.name}</h3>
              <p>
                {
                  companies.filter(
                    (company) => company.industry?.id === industry.id
                  ).length
                }{" "}
                companies
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
