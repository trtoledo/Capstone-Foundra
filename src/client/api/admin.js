const API = "http://localhost:3000/api/users";

export async function fetchAdmins() {
    try {
      const res = await fetch(`${API_BASE_URL}/`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      throw err;
    }
  };

  