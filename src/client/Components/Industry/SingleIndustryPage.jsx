import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchIndustryById } from "../../api/industries";
import { fetchCompanies, updateCompany } from "../../api/companies";
import "./SingleIndustryPage.css";

const SingleIndustryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [industry, setIndustry] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const industryData = await fetchIndustryById(id);
        setIndustry(industryData);

        const companiesData = await fetchCompanies();
        setCompanies(companiesData);
      } catch (err) {
        setError("Failed to load industry details.");
      }
    }
    loadData();
  }, [id, updateSuccess]);

  const handleCompanyChange = (e) => {
    setSelectedCompanyId(e.target.value);
  };

  const handleAssignCompany = async () => {
    if (!selectedCompanyId) {
      setUpdateError("Please select a company.");
      return;
    }
    try {
      await updateCompany(selectedCompanyId, { industryId: parseInt(id, 10) });
      setUpdateSuccess(true);
      setUpdateError(null);
      const refreshed = await fetchIndustryById(id);
      setIndustry(refreshed);
    } catch (err) {
      console.error(err);
      setUpdateError("Failed to assign company to industry.");
      setUpdateSuccess(false);
    }
  };

  if (error) return <div className="errorMessage">{error}</div>;
  if (!industry || !companies.length) return <div>Loading...</div>;

  return (
    <div className="industryContainer">
      <h2>{industry.name}</h2>
      <h4>{industry.description || "No description available."}</h4>

      <div className="companyAssignment">
        <h3>Assign Company to "{industry.name}"</h3>
        {updateError && <p className="errorMessage">{updateError}</p>}
        {updateSuccess && <p className="successMessage">Company assigned successfully!</p>}

        <label htmlFor="company-select">Select Company:</label>
        <select
          id="company-select"
          value={selectedCompanyId}
          onChange={handleCompanyChange}
        >
          <option value="">-- Select a Company --</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button onClick={handleAssignCompany}>
          Add to {industry.name}
        </button>
      </div>

      {industry.companies?.length > 0 && (
        <div className="currentCompanies">
          <h3>Current Companies in this Industry</h3>
          <ul>
            {industry.companies.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button className="back" onClick={() => navigate("/explore")}>
        Back to Explore
      </button>
    </div>
  );
};

export default SingleIndustryPage;