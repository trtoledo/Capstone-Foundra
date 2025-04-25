const API = "http://localhost:3000/api/users";

export async function fetchAllUsers() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `HTTP ${response.status}`)
        }
        return await response.json();

    } catch (err) {
        console.error("Could not fetch user", err)
    }
}

export async function fetchSingleUser(id) {
    try {
        const response = await fetch(`${API}/${id}`);

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `HTTP ${response.status}`)
        }
        return await response.json();

    } catch (err) {
        console.error("Could not fetch single user", err)
    }
}

export async function updateUser(id, name, companyId, token) {
    try {
        const response = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({name, companyId})
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }
      
          return await response.json();
    } catch (err) {
        console.error("Could not update user", err);
        throw err;
    }
}

export async function deleteUser(id) {
    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }
      
          return await response.json();
    } catch (error) {
        console.error("Could not delete user", err)
    }
};

export async function fetchCandidateById(id, token) {
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch candidate");
      }
  
      return await response.json();
    } catch (err) {
      throw err;
    }
  };