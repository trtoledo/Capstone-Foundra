const express = require("express");
const router = express.Router();

//dummy db for reviews
let dummyReviews = [
  { id: 1, userId: 101, videoId: 1, rating: 5, text: "Awesome video!" },
  { id: 2, userId: 102, videoId: 1, rating: 4, text: "Very informative." },
];

//GET /api/reviews -> get all reviews
router.get("/", (req, res) => {
  res.json(dummyReviews);
});

//POST /api/reviews -> create new review
router.post("/", (req, res) => {
  const { userId, videoId, rating, text } = req.body;

  if (!userId || !videoId || !rating || !text) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newReview = {
    id: dummyReviews.length + 1,
    userId,
    videoId,
    rating,
    text,
  };

  dummyReviews.push(newReview);
  res.status(201).json(newReview);
});

//PUT /api/reviews/:id -> update review
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const review = dummyReviews.find((r) => r.id === parseInt(id));
  if (!review) return res.status(404).json({ error: "Review not found" });

  const { rating, text } = req.body;
  if (rating !== undefined) review.rating = rating;
  if (text !== undefined) review.text = text;

  res.json(review);
});

//DELETE /api/reviews/:id -> delete review
router.delete("/:id", (req, res) => {
  const index = dummyReviews.findIndex((r) => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Review not found" });

  dummyReviews.splice(index, 1);
  res.sendStatus(204);
});

module.exports = router;
