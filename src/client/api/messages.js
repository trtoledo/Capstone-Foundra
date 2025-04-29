const API = "http://localhost:3000/api/messages";

export async function fetchMessages() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(API, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Could not fetch messages:", err.message);
    throw err;
  }
};

// export async function sendMessage(userId, content) {
//   const token = localStorage.getItem("token");

//   try {
//     const response = await fetch(API, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//       body: JSON.stringify({ userId, content }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || `HTTP ${response.status}`);
//     }

//     return await response.json();
//   } catch (err) {
//     console.error("Could not send message:", err.message);
//     throw err;
//   }
// };

export async function fetchMessageById(id, token) {
  try {
    const response = await fetch(`${API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    return result;
  } catch (err) {
    throw err;
  }
};

export async function fetchConversation(userId, selectedUserId, token) {
  try {
    const response = await fetch(`${API}/conversation/${userId}/${selectedUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (err) {
    throw err;
  }
};

export async function sendHttpMessage(recipientId, content, token) {
  try {
    const response = await fetch(`${API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipientId, content }),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    throw err;
  }
};