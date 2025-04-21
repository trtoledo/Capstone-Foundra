import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SingleCompany = () => {
  const [comapny, setCompany] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getCompany() {
      const response = await getSingleCompany(id);
      setCompany(response);
      return response;
    }

    getCompany();
  }, []);

  return (
    <>
    {company && (
        <div>
            <h2>{company.name}</h2>
            <h4>{company.inudstry}</h4>
        </div>
    )}
    </>
  )
};