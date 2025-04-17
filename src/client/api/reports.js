const API = "http://localhost:3000/api/reports";

export async function fetchReports() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not fetch reports:", err.message);
    throw err;
  }
};

export async function submitReport(reason, userId, companyId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason, userId, companyId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not submit report:", err.message);
    throw err;
  }
};

export async function deleteReport(reportId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API}/${reportId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`Could not delete report ${reportId}:`, err.message);
    throw err;
  }
};