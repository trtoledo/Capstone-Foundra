const API = "http://localhost:3000/api/feedback";

export async function fetchFeedback() {
  try {
    const response = await fetch(API);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not fetch feedback:", err.message);
    throw err;
  }
}

export async function addFeedback(userId, content) {
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not add feedback:", err.message);
    throw err;
  }
}

export async function deleteFeedback(feedbackId) {
  try {
    const response = await fetch(`${API}/${feedbackId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return true;
  } catch (err) {
    console.error(`Could not delete feedback ${feedbackId}:`, err.message);
    throw err;
  }
};