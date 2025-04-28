import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCompanyById, updateCompany } from "../../api/companies"; // Import updateCompany
import { fetchIndustries } from "../../api/industries"; // Import fetchIndustries
import "./SingleCompany.css";

const SingleCompany = () => {
  const { id } = useParams();
  console.log("Company ID from useParams", id);
  
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState("");
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    async function getCompanyData() {
      try {
        const companyData = await fetchCompanyById(id);
        setCompany(companyData);
        setSelectedIndustryId(companyData?.industryId || ""); // Initialize selected industry

        const industriesData = await fetchIndustries();
        setIndustries(industriesData);
      } catch (err) {
        setError("Failed to load company details.");
      }
    }

    getCompanyData();
  }, [id]);

  const handleIndustryChange = (event) => {
    setSelectedIndustryId(event.target.value);
  };

  const handleUpdateIndustry = async () => {
    if (!selectedIndustryId) {
      setUpdateError("Please select an industry.");
      return;
    }

    try {
      console.log("Updating company with ID:", id);
      await updateCompany(id, { industryId: parseInt(selectedIndustryId, 10) });
      setUpdateSuccess(true);
      setUpdateError(null);
      // Refresh company data to show the updated industry
      const updatedCompanyData = await fetchCompanyById(id);
      setCompany(updatedCompanyData);
    } catch (err) {
      setUpdateError("Failed to update company industry.");
      setUpdateSuccess(false);
      console.error("Error updating company industry:", err);
    }
  };

  if (error) return <div>{error}</div>;
  if (!company || !industries.length) return <div>Loading...</div>;

  return (
    <div className="singleCompanyContainer">
      <h2>{company.name}</h2>
      <h4>{company.description || "No description available"}</h4>

      <div className="industrySelection">
        <h3>Assign Industry</h3>
        {updateError && <p className="errorMessage">{updateError}</p>}
        {updateSuccess && <p className="successMessage">Industry updated successfully!</p>}
        <label htmlFor="industry">Select Industry:</label>
        <select
          id="industry"
          value={selectedIndustryId}
          onChange={handleIndustryChange}
        >
          <option value="">-- Select an Industry --</option>
          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </select>
        <button onClick={handleUpdateIndustry}>Save Industry</button>
      </div>

      {company.industry && (
        <div className="industryDetails">
          <h3>Current Industry</h3>
          <h4>{company.industry.name}</h4>
          <p>{company.industry.description || "No description available for this industry."}</p>
        </div>
      )}

      <button onClick={() => navigate("/explore")}>Back to Explore</button>
    </div>
  );
};

export default SingleCompany;