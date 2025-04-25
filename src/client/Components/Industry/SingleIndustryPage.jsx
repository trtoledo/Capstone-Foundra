import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchIndustries, fetchIndustryById } from "../../api/industries";
import { addCompany } from "../../api/companies";
import { useAuth } from "../Context/AuthContext";
import "./SingleIndustryPage.css";

const SingleIndustryPage = () => {
  const { token, refresh, setRefresh } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [industry, setIndustry] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   async function selectIndustry() {
  //     const response = await fetchIndustries(id);
  //     setIndustry(response);
  //   }
  //   selectIndustry();
  // }, []);
  
  // const handleClick = async (name) => {
  //   try {
  //     const response = await addCompany(name, token);
  //     setCompany(response);
  //     setRefresh(!refresh);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  
  useEffect(() => {
    async function getIndustry() {
      try {
        const data = await fetchIndustryById(id)
        setIndustry(data);
      } catch (err) {
        setError("Failed to load industry")
      }
    }
    getIndustry();
  }, [id, refresh]);

  return (
    <div className="industryContainer">
      {industry ? (
        <>
          <h2>{industry.name}</h2>
          <h4>Companies in this industry:</h4>
          <ul>
            {industry.companies?.map((company) => (
              <li key={company.id}>{company.name}</li>
            ))}
          </ul>

          {token && (
            <div className="addCompanyForm">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="New company name"
              />
              <button onClick={handleAddCompany}>
                Add to {industry.name}
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading industry...</p>
      )}

      <button className="back" onClick={() => navigate("/")}>
        Home
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SingleIndustryPage;
