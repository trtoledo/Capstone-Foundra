const API = "http://localhost:3000/api/videos";

export async function fetchAllVideos() {
  try {
    const response = await fetch(API);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not fetch videos", err);
  }
}

export async function fetchSingleVideo(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not fetch video", err);
  }
}

export async function createVideo(title, url, companyId) {
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, url, companyId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not create video", err);
  }
}

export async function updateVideo(id, title, url) {
  try {
    const response = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, url }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not update video", err);
  }
}

export async function deleteVideo(id) {
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
  } catch (err) {
    console.error("Could not delete video");
    throw err;
  }
}
