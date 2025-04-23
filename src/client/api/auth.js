const API = "http://localhost:3000/api/auth";

export async function registerUser({ name, email, password, role }) {
  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Registration failed");
    }

    const data = await res.json();
    const { token } = data;

    if (token) {
      localStorage.setItem("token", token); 
    }

    return data;
  } catch (err) {
    console.error("Register failed:", err);
    throw err;
  }
}
  
  export async function loginUser({ email, password }) {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }
  
      return await res.json(); // should include the token
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  }