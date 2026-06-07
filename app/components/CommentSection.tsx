"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  author_name: string;
  text: string;
  created_at: string;
}

interface Props {
  itemId: string;
  itemType: "milestone" | "update";
  currentUserName: string;
}

export function CommentSection({ itemId, itemType, currentUserName }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const router = useRouter();

  const apiPath = itemType === "milestone" ? "/api/milestone-comments" : "/api/update-comments";
  const idParam = itemType === "milestone" ? "milestoneId" : "updateId";

  // Load comments
  useEffect(() => {
    async function loadComments() {
      try {
        const response = await fetch(`${apiPath}?${idParam}=${itemId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [itemId, apiPath, idParam]);

  async function submitComment() {
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [idParam]: itemId,
          authorName: currentUserName,
          text: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        // Reload comments
        const listResponse = await fetch(`${apiPath}?${idParam}=${itemId}`);
        if (listResponse.ok) {
          setComments(await listResponse.json());
        }
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Fout bij plaatsen reactie");
    } finally {
      setPosting(false);
    }
  }

  async function deleteComment(commentId: string) {
    if (!window.confirm("Reactie verwijderen?")) return;

    try {
      const response = await fetch(apiPath, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Fout bij verwijderen reactie");
    }
  }

  return (
    <div className="space-y-3 border-t border-[var(--rho-cream)]/10 pt-4">
      <p className="text-[var(--rho-cream)]/40 text-xs uppercase font-body">
        Reacties ({comments.length})
      </p>

      {/* Comments list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-[var(--rho-cream)]/5 rounded-lg p-3 text-sm space-y-1"
          >
            <div className="flex items-center justify-between">
              <p className="text-[var(--rho-cream)]/70 font-semibold text-xs">
                {comment.author_name}
              </p>
              {comment.author_name === currentUserName && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="text-[var(--rho-cream)]/40 hover:text-red-400 text-xs transition-colors"
                >
                  🗑️
                </button>
              )}
            </div>
            <p className="text-[var(--rho-cream)]/80 text-xs leading-relaxed">
              {comment.text}
            </p>
            <p className="text-[var(--rho-cream)]/30 text-[10px]">
              {new Date(comment.created_at).toLocaleDateString("nl-NL", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>

      {/* Comment input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitComment()}
          placeholder="Reactie toevoegen..."
          disabled={posting}
          className="flex-1 bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-lg px-3 py-2 text-[var(--rho-cream)] text-sm placeholder-[var(--rho-cream)]/40 focus:outline-none focus:border-[var(--rho-gold)]/50 disabled:opacity-50"
        />
        <button
          onClick={submitComment}
          disabled={posting || !newComment.trim()}
          className="bg-[var(--rho-gold)]/20 hover:bg-[var(--rho-gold)]/30 disabled:opacity-50 text-[var(--rho-cream)] px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {posting ? "..." : "→"}
        </button>
      </div>
    </div>
  );
}
