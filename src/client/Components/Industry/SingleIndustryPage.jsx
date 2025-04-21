import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchIndustries } from "../../api/industries";
import { addCompany } from "../../api/companies";
import { useAuth } from "../Context/AuthContext";
import "./SingleIndustryPage.css";

const SingleIndustryPage = () => {
  const { token, setToken, refresh, setRefresh } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [industry, setIndustry] = useState(null);
  const [company, setCompany] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function selectIndustry() {
      const response = await fetchIndustries(id);
      setIndustry(response);
    }
    selectIndustry();
  }, []);

  const handleClick = async (name) => {
    try {
      const response = await addCompany(name, token);
      setCompany(response);
      setRefresh(!refresh);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="industryContainer">
        {industry && (
          <div key={industry.id} className="singleIndustry">
            <p>
              <b>Industry:</b> {industry.name}
            </p>
            <p>
              <b>Companies:</b> {industry.companies}
            </p>
            <br />
            {token && (
              <button
                onClick={() => handleClick(company.id)}
                className="checkout"
              >
                Add Company to {industry.name}!
              </button>
            )}
          </div>
        )}
        <button className="back" onClick={() => navigate("/")}>
          Home
        </button>
        <br />
      </div>
    </>
  );
};

export default SingleIndustryPage;
