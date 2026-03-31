import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

aapp.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

// INTELLIGENT ANALYSIS
app.post("/api/interview", (req, res) => {
  const { answer } = req.body;

  let score = 5;
  let strength = "";
  let weakness = "";
  let communication = "Average";
  let confidence = "Medium";

  const lower = answer.toLowerCase();

  // 🔹 Length analysis
  if (answer.length > 120) {
    score += 2;
    communication = "Good";
  } else if (answer.length < 30) {
    score -= 2;
    communication = "Poor";
    weakness = "Answer too short";
  }

  // 🔹 Keyword analysis
  if (lower.includes("project") || lower.includes("built")) {
    score += 1;
    strength = "Mentions practical experience";
  }

  if (lower.includes("example") || lower.includes("for instance")) {
    score += 1;
    strength = "Uses examples effectively";
  }

  if (!lower.includes("because") && !lower.includes("so that")) {
    weakness = "Lacks explanation depth";
  }

  // 🔹 Confidence detection
  if (lower.includes("i think") || lower.includes("maybe")) {
    confidence = "Low";
    score -= 1;
  }

  // fallback values
  if (!strength) strength = "Basic understanding";
  if (!weakness) weakness = "Can improve clarity";

  // limit score
  if (score > 10) score = 10;
  if (score < 1) score = 1;

  res.json({
    score,
    communication,
    confidence,
    strength,
    weakness,
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});