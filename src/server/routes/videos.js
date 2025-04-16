const express = require("express");
const router = express.Router();

//dummy in-memory db
let dummyVideos = [
  { id: 1, title: "Isabell Ventouris - Pitch", url: "https://video1.com", userId: 101 },
  { id: 2, title: "Tomas Toledo - Pitch", url: "https://video2.com", userId: 102 },
];

//GET /api/videos -> return all videos
router.get("/", (req, res) => {
  res.json(dummyVideos);
});

//POST /api/videos -> create new video
router.post("/", (req, res) => {
  const { title, url, userId } = req.body;

  if (!title || !url || !userId) {
    return res.status(400).json({ error: "Missing title, url, or userId" });
  }

  const newVideo = {
    id: dummyVideos.length + 1,
    title,
    url,
    userId,
  };

  dummyVideos.push(newVideo);
  res.status(201).json(newVideo);
});

//PUT /api/videos/:id -> update video
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;

  const video = dummyVideos.find((v) => v.id === parseInt(id));

  if (!video) return res.status(404).json({ error: "Video not found" });

  if (title) video.title = title;
  if (url) video.url = url;

  res.json(video);
});

//DELETE /api/videos/:id -> delete video
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = dummyVideos.findIndex((v) => v.id === parseInt(id));

  if (index === -1) return res.status(404).json({ error: "Video not found" });

  dummyVideos.splice(index, 1);
  res.sendStatus(204);
});

module.exports = router;
