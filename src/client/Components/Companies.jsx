import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCompanies, addCompany, updateCompany, deleteCompany } from "../api/companies";

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [searchParam, setSearchParam] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function renderCompanies() {
            const companies = await fetchCompanies();
            setCompanies(companies);
        }
        renderCompanies();
    }, []);

    const companiesToDisplay = searchParam ? companies.filter((idx) => idx.name.toLowerCase().includes(searchParam)) : companies;

    // async function handleDetails(industryId) {
    //     const response = await 
    // }

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
          <div className="allCompanies">
            {(companies || []).map((idx) => {
              return (
                <div key={idx.id} className="company">
                  <h4>{idx.name}</h4>
                  <h5>{idx.industry}</h5>
                  <h6>{idx.videos}</h6>
                  <br />
                  {/* <button
                    className="details"
                    onClick={() => handleDetails(book.id)}
                  >
                    More Details
                  </button> */}
                  <br />
                  <br />
                </div>
              );
            })}
            ;
          </div>
        </>
      );
    };
 
export default Companies;