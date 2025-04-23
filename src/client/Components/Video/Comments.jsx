import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { fetchComments, createComment, updateComment, deleteComment} from "../../api/comments";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [error, setError] = useState(null);
  const { user, role } = useAuth();

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    try {
      const data = await fetchComments();
      setComments(data);
    } catch (err) {
      setError("Failed to load comments");
    }
  }

  async function handleCreate() {
    try {
      await createComment(newContent);
      setNewContent("");
      loadComments();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate() {
    try {
      await updateComment(id, editingContent);
      setEditingId(null);
      setEditingContent("");
      loadComments();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    try {
      await deleteComment(id);
      loadComments();
    } catch (err) {
      setError(err.message);
    }
  }

  const isAuthorOrAdmin = (authorId) => {
    return user && (user.id === authorId || role === "admin");
  };

  return (
    <div className="comments-container">
      <h2>Comments</h2>

      {error && <p className="error-message">{error}</p>}

      {user ? (
        <div className="new-comment">
          <input
            className="comment-input"
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Comment here..."
          />
          <button className="comment-button" onClick={handleCreate}>
            Post
          </button>{" "}
        </div>
      ) : (
        <p className="login-message">Log in to leave a comment</p>
      )}

      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-card">
            <div className="comment-header">
              <span className="comment-author">{comment.user.username}</span>
              {isAuthorOrAdmin(comment.user.id) && (
                <div className="comment-actions">
                  <button
                    className="action-button"
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditingContent(comment.content);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDelete(comment.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {editingId === comment.id ? (
              <div className="edit-comment">
                <input
                  className="comment-input"
                  type="text"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button
                  className="comment-button save-button"
                  onClick={() => handleUpdate(comment.id)}
                >
                  Save
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="comment-content">{comment.content}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
