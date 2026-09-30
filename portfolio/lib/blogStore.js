import fs from "fs";
import path from "path";
import crypto from "crypto";
import { POSTS as SEED_POSTS } from "../data/posts.js";

const STORAGE_DIR = path.join(process.cwd(), "data", "storage");
const POSTS_FILE = path.join(STORAGE_DIR, "posts.json");
const VOTES_FILE = path.join(STORAGE_DIR, "votes.json");
const COMMENTS_FILE = path.join(STORAGE_DIR, "comments.json");

// Ensure storage directory exists
function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  // Initialize posts.json if not present
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(SEED_POSTS, null, 2), "utf8");
  }

  // Initialize votes.json if not present
  if (!fs.existsSync(VOTES_FILE)) {
    const initialVotes = {};
    SEED_POSTS.forEach((p, idx) => {
      // Seed initial engagement numbers
      const seedUp = [48, 37, 29, 54, 42][idx % 5];
      const seedDown = [1, 0, 2, 1, 0][idx % 5];
      initialVotes[p.slug] = {
        upvotes: seedUp,
        downvotes: seedDown,
        voters: {},
      };
    });
    fs.writeFileSync(VOTES_FILE, JSON.stringify(initialVotes, null, 2), "utf8");
  }

  // Initialize comments.json if not present
  if (!fs.existsSync(COMMENTS_FILE)) {
    const initialComments = {
      "satellite-vision-production-failures": [
        {
          id: "cmt_seed_1",
          author: "Marc D. / Senior Vision Eng.",
          text: "The IoU clustering threshold breakdown is spot on. We ran into the exact same shadow skew issue on flat warehouse roofs in northern Europe.",
          createdAt: "2026-08-16T14:32:00.000Z",
        },
        {
          id: "cmt_seed_2",
          author: "Elena R. / MLOps Lead",
          text: "Curious if you explored fine-tuning smaller visual transformers like RT-DETR for lower latency on the inference server?",
          createdAt: "2026-08-17T09:15:00.000Z",
        },
      ],
      "rag-semantic-reranking-slack": [
        {
          id: "cmt_seed_3",
          author: "Lucas B. / AI Architect",
          text: "Cross-encoder overhead was our biggest bottleneck until we added the top-k pre-filter stage. Great write-up on real latency budgets.",
          createdAt: "2026-07-29T11:45:00.000Z",
        },
      ],
      "what-factory-floors-taught-me-about-reliability": [
        {
          id: "cmt_seed_4",
          author: "Thomas G. / Industrial IoT",
          text: "Golden rule: 'If it can fail, it will fail at 2 AM when the maintenance team is off.' Love the pragmatic perspective.",
          createdAt: "2026-09-02T16:20:00.000Z",
        },
      ],
    };
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(initialComments, null, 2), "utf8");
  }
}

// Safe Read JSON
function readJson(filePath, defaultValue) {
  ensureStorage();
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

// Safe Write JSON
function writeJson(filePath, data) {
  ensureStorage();
  try {
    const tempFile = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tempFile, filePath);
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// ─── POSTS METHODS ──────────────────────────────────────────

export function getAllPosts() {
  const posts = readJson(POSTS_FILE, SEED_POSTS);
  const votes = readJson(VOTES_FILE, {});
  const comments = readJson(COMMENTS_FILE, {});

  return posts.map((post) => {
    const postVotes = votes[post.slug] || { upvotes: 0, downvotes: 0 };
    const postComments = comments[post.slug] || [];
    return {
      ...post,
      upvotes: postVotes.upvotes || 0,
      downvotes: postVotes.downvotes || 0,
      commentCount: postComments.length,
    };
  });
}

export function getPostBySlug(slug) {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function savePost(postData) {
  const posts = readJson(POSTS_FILE, SEED_POSTS);
  const slug = (postData.slug || postData.title || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error("Invalid post slug or title");
  }

  const existingIndex = posts.findIndex((p) => p.slug === slug);
  const updatedPost = {
    slug,
    title: postData.title || "Untitled Post",
    date: postData.date || new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    readTime: postData.readTime || "5 min read",
    domains: Array.isArray(postData.domains) && postData.domains.length ? postData.domains : ["systems"],
    tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags || "").split(",").map((s) => s.trim()).filter(Boolean),
    blurb: postData.blurb || "",
    lead: postData.lead || "",
    sections: Array.isArray(postData.sections) && postData.sections.length
      ? postData.sections
      : [{ heading: "Introduction", body: postData.body || "" }],
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    posts[existingIndex] = { ...posts[existingIndex], ...updatedPost };
  } else {
    posts.unshift(updatedPost); // Add new post to top
  }

  writeJson(POSTS_FILE, posts);
  return updatedPost;
}

export function deletePost(slug) {
  const posts = readJson(POSTS_FILE, SEED_POSTS);
  const filtered = posts.filter((p) => p.slug !== slug);
  if (filtered.length === posts.length) {
    return false; // not found
  }
  writeJson(POSTS_FILE, filtered);

  // Clean up votes and comments for deleted post
  const votes = readJson(VOTES_FILE, {});
  delete votes[slug];
  writeJson(VOTES_FILE, votes);

  const comments = readJson(COMMENTS_FILE, {});
  delete comments[slug];
  writeJson(COMMENTS_FILE, comments);

  return true;
}

// ─── VOTING METHODS ─────────────────────────────────────────

export function getPostVotes(slug, visitorId = null) {
  const votes = readJson(VOTES_FILE, {});
  const postVotes = votes[slug] || { upvotes: 0, downvotes: 0, voters: {} };

  return {
    upvotes: postVotes.upvotes || 0,
    downvotes: postVotes.downvotes || 0,
    score: (postVotes.upvotes || 0) - (postVotes.downvotes || 0),
    userVote: visitorId && postVotes.voters ? postVotes.voters[visitorId] || null : null,
  };
}

export function castPostVote(slug, type, visitorId) {
  if (!slug || !["up", "down"].includes(type) || !visitorId) {
    throw new Error("Invalid voting parameters");
  }

  const votes = readJson(VOTES_FILE, {});
  if (!votes[slug]) {
    votes[slug] = { upvotes: 0, downvotes: 0, voters: {} };
  }
  const entry = votes[slug];
  if (!entry.voters) entry.voters = {};

  const currentVote = entry.voters[visitorId] || null;

  if (currentVote === type) {
    // Un-vote / Toggle off
    if (type === "up") entry.upvotes = Math.max(0, (entry.upvotes || 1) - 1);
    if (type === "down") entry.downvotes = Math.max(0, (entry.downvotes || 1) - 1);
    delete entry.voters[visitorId];
  } else if (currentVote) {
    // Swap vote (e.g. from down to up or up to down)
    if (currentVote === "up") entry.upvotes = Math.max(0, (entry.upvotes || 1) - 1);
    if (currentVote === "down") entry.downvotes = Math.max(0, (entry.downvotes || 1) - 1);

    if (type === "up") entry.upvotes = (entry.upvotes || 0) + 1;
    if (type === "down") entry.downvotes = (entry.downvotes || 0) + 1;
    entry.voters[visitorId] = type;
  } else {
    // New vote
    if (type === "up") entry.upvotes = (entry.upvotes || 0) + 1;
    if (type === "down") entry.downvotes = (entry.downvotes || 0) + 1;
    entry.voters[visitorId] = type;
  }

  writeJson(VOTES_FILE, votes);

  return {
    upvotes: entry.upvotes,
    downvotes: entry.downvotes,
    score: entry.upvotes - entry.downvotes,
    userVote: entry.voters[visitorId] || null,
  };
}

// ─── COMMENTS METHODS ───────────────────────────────────────

export function getPostComments(slug) {
  const comments = readJson(COMMENTS_FILE, {});
  return comments[slug] || [];
}

export function getAllCommentsFlat() {
  const comments = readJson(COMMENTS_FILE, {});
  const flat = [];
  for (const [slug, list] of Object.entries(comments)) {
    if (Array.isArray(list)) {
      list.forEach((c) => flat.push({ ...c, postSlug: slug }));
    }
  }
  // Sort descending by date
  flat.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return flat;
}

export function addPostComment(slug, { author, text }) {
  if (!slug || !text || !text.trim()) {
    throw new Error("Comment text cannot be empty");
  }

  const cleanAuthor = (author || "").trim().slice(0, 80) || "Anonymous Visitor";
  const cleanText = text.trim().slice(0, 1000);

  const comments = readJson(COMMENTS_FILE, {});
  if (!comments[slug]) {
    comments[slug] = [];
  }

  const newComment = {
    id: `cmt_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    author: cleanAuthor,
    text: cleanText,
    createdAt: new Date().toISOString(),
  };

  comments[slug].push(newComment);
  writeJson(COMMENTS_FILE, comments);

  return newComment;
}

export function deletePostComment(slug, commentId) {
  const comments = readJson(COMMENTS_FILE, {});
  if (!comments[slug]) return false;

  const originalLength = comments[slug].length;
  comments[slug] = comments[slug].filter((c) => c.id !== commentId);

  if (comments[slug].length < originalLength) {
    writeJson(COMMENTS_FILE, comments);
    return true;
  }
  return false;
}
