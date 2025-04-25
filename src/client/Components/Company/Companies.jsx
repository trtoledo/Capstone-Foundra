import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCompanies, addCompany, updateCompany, deleteCompany } from "../../api/companies";
import { fetchIndustries } from "../../api/industries";
import "./Companies.css"

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [searchParam, setSearchParam] = useState("");
    const [newCompanyName, setNewCompanyName] = useState("");
    const [industries, setIndustries] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const navigate = useNavigate();

    const userRole = localStorage.getItem("userRole");

    useEffect(() => {
      async function loadData() {
        const companies = await fetchCompanies();
        const industries = await fetchIndustries();
        setCompanies(companies);
        setIndustries(industries);
      }
      loadData();
    }, []);

    const companiesToDisplay = searchParam
    ? companies.filter((c) =>
        c.name.toLowerCase().includes(searchParam.toLowerCase())
      )
    : companies;

    const handleAddCompany = async () => {
      try {
        const newCompany = await addCompany(newCompanyName, selectedIndustry);
        setCompanies([...companies, newCompany]);
        setNewCompanyName("");
        setSelectedIndustry("");
      } catch (err) {
        alert("Error adding company: " + err.message);
      }
    };

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
  
        {userRole === "HIRING_MANAGER" && (
          <div className="addCompanyForm">
            <h3>Add a New Company</h3>
            <input
              type="text"
              placeholder="Company Name"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
            />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="">Select Industry</option>
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddCompany}>Add Company</button>
          </div>
        )}
  
        <div className="allCompanies">
          {companiesToDisplay.map((company) => (
            <div key={company.id} className="company">
              <h4>{company.name}</h4>
              <h5>{company.industry?.name || "Unassigned"}</h5>
              <p>Videos: {company.videos?.length || 0}</p>
              <button onClick={() => navigate(`/companies/${company.id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </>
    );
    };
 
export default Companies;