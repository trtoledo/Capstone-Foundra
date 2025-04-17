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
      headers: { "Content-Type": "application/json" },
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

//PUT update video —> onlu video owner or admin
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });
    if (!video) return res.status(404).json({ error: "Video not found" });

    //only video uploader or admin can update
    if (req.user.role !== "ADMIN" && req.user.userId !== video.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { title, url } = req.body;
    const updated = await prisma.video.update({
      where: { id: req.params.id },
      data: { title, url },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export async function deleteVideo(id) {
  try {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("Could not delete video");
    throw err;
  }
}