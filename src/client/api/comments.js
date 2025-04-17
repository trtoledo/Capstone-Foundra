const API = "http://localhost:3000/api/comments";

export async function fetchComments() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching comments:", err);
      throw err;
    }
  };

  export async function createComment(content) {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
  
      return await res.json();
    } catch (err) {
      console.error("Error creating comment:", err);
      throw err;
    }
  };

  export async function updateComment(id, content) {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
  
      return await res.json();
    } catch (err) {
      console.error("Error updating comment:", err);
      throw err;
    }
  };

  export async function deleteComment(id) {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
  
      return true; 
    } catch (err) {
      console.error("Error deleting comment:", err);
      throw err;
    }
  };