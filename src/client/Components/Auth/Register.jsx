import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { registerUser } from '../../api/auth.js';
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const { setToken, setUser, setRole, setRefresh } = useAuth();
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setSelectedRole] = useState("CANDIDATE");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await registerUser({
        name,
        email,
        password,
        role,
      });
      console.log(result);
      
      localStorage.setItem("token", result.token);
      localStorage.setItem("id", result.user.id);
      localStorage.setItem("role", result.user.role);
      setToken(result.token); 
      setName(result.user.name);
      setEmail(result.user.email);
      setSelectedRole(result.user.role);
      setRefresh(prev=>!prev);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            value={name}
            placeholder="Enter your full name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength="8"
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="CANDIDATE">Candidate</option>
            <option value="HIRING_MANAGER">Hiring Manager</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
