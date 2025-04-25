import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCompanyById } from "../../api/companies";
import { fetchIndustryById } from "../../api/industries";
import "./SingleCompany.css"

const SingleCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch the company by its ID
  useEffect(() => {
    async function getCompanyData() {
      try {
        const companyData = await fetchCompanyById(id);
        setCompany(companyData);

        if (companyData?.industryId) {
          const industryData = await fetchIndustryById(companyData.industryId);
          setIndustry(industryData);
        }
      } catch (err) {
        setError("Failed to load company details.");
      }
    }

    getCompanyData();
  }, [id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="single-company-container">
      {company ? (
        <>
          <h2>{company.name}</h2>
          <h4>{company.description || "No description available"}</h4>

          {/* Display industry details if available */}
          {industry && (
            <div className="industry-details">
              <h4>Industry: {industry.name}</h4>
              <p>{industry.description || "No description available for this industry."}</p>
            </div>
          )}

          <button onClick={() => navigate("/explore")}>Back to Explore</button>
        </>
      ) : (
        <p>Loading company details...</p>
      )}
    </div>
  );
};

export default SingleCompany;
