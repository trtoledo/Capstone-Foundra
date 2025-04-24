import { useEffect, useState } from "react";
import { fetchSingleUser, updateUser, deleteUser } from "../../api/users";
import { useAuth } from "../Context/AuthContext";
import { useParams } from "react-router-dom";

const AccountSettings = () => {
  const { role } = useAuth();
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchSingleUser(id);
      setUser(response);
      setName(response.name);
      setCompanyId(response.companyId);
    };
    fetchUser();
  }, [id]);

  async function handleChange(e) {
    e.preventDefault();
    const response = await updateUser(
      id,
      name,
      companyId,
      localStorage.getItem("token")
    );
    setUser(response);
    setName(response.name);
    setCompanyId(response.companyId);
  }

  async function handleDelete(id) {
    const response = await deleteUser(id, localStorage.getItem("token"));
    setUser(response);
    navigate("/");
  }

  return (
    <>
      return (
      <div className="account-settings">
        <h2>Account Settings</h2>

        <form onSubmit={handleChange}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="companyId">Company ID:</label>
            <input
              type="text"
              id="companyId"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            />
          </div>

          <button type="submit">Update Info</button>
        </form>

        {role === "ADMIN" && (
          <button
            onClick={() => handleDelete(id)}
            style={{
              marginTop: "1rem",
              backgroundColor: "red",
              color: "white",
            }}
          >
            Delete Account
          </button>
        )}
      </div>
      );
    </>
  );
};

export default AccountSettings;
