import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCompanies } from "../api/companies";
import { fetchIndustries } from "../api/industries";
import { useAuth } from "./Context/AuthContext";

const Explore = () => {
  const { token, setToken, refresh, setRefresh } = useAuth();
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
  }, []);

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
    <>
      <div className="exploreContainer">
        <div className="section">
          <h2>Companies</h2>
          <div className="card-grid">
            {companies.map((company) => (
              <div key={company.id} className="card">
                <h3>{company.name}</h3>
                <p>Industry: {company.industry?.name || "Unassigned"}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="section">
          <h2>Industries</h2>
          <div className="card-grid">
            {industries.map((industry) => (
              <div key={industry.id} className="card">
                <h3>{industry.name}</h3>
                <p>{industry.companies?.length || 0} companies</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => navigate('/')}>Home</button>
    </>
  );
};

export default Explore;