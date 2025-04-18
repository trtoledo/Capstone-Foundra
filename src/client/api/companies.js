const API ="http://localhost:3000/api/companies";

export async function fetchCompanies() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status} - ${response.statusText}`);
          };

        return await response.json();
    } catch (err) {
        console.error("Could not fetch companies", err);
        return [];
    }
};

export async function addCompany(name, industryId) {
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      body: JSON.stringify({ name, industryId }),
  }});

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not add company:", err.message);
    throw err;
  }
};

export async function updateCompany(name, industryId, companyId) {
  try {
    const response = await fetch(`${API}/${companyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      body: JSON.stringify({ name, industryId }),
    }});

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`Could not update company ${companyId}:`, err.message);
    throw err;
  }
};

export async function deleteCompany(companyId) {
  try {
    const response = await fetch(`${API}/${companyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    }});

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`Could not delete company ${companyId}:`, err.message);
    throw err;
  }
};