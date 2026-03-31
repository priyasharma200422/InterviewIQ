import { useState } from "react";
import axios from "axios";

function App() {
  const questions = [
    "Tell me about yourself (focus on skills, projects, and goals)",
    "Explain your best project and your role in it",
    "What are your strengths? Give examples",
    "What is your biggest weakness and how are you improving it?",
    "Why should we hire you?",
    "Describe a conflict with a teammate and how you resolved it",
    "Why do you want to work at this company?",
    "What makes you different from other candidates?",
    "What is your biggest achievement so far?",
    "Where do you see yourself in the next 5 years?"
  ];

  // 🎨 pastel backgrounds
  const pastelColors = [
    "#d0f0fd", // sky blue
    "#ffe4ec", // baby pink
    "#fff9c4", // light yellow
    "#d4f8e8", // light green
    "#f5f5dc", // beige
  ];

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const handleNext = async () => {
    if (answer.trim() === "") return;

    const res = await axios.post("https://interviewiq-backend-uyj0.onrender.com/api/interview", {
      answer,
    });

    setResults([...results, res.data]);
    setAnswer("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const finishEarly = () => {
    if (results.length === 0) return;
    setFinished(true);
  };

  const restart = () => {
    setStarted(false);
    setFinished(false);
    setCurrentIndex(0);
    setResults([]);
    setAnswer("");
  };

  const bgColor = pastelColors[currentIndex % pastelColors.length];

  return (
    <div style={{ ...styles.container, background: bgColor }}>
      {!started ? (
        <div style={styles.card}>
          <h1 style={styles.title}>Interview Intelligence System</h1>
          <button style={styles.primaryBtn} onClick={() => setStarted(true)}>
            Start Interview
          </button>
        </div>
      ) : finished ? (
        <div style={styles.card}>
          <h1 style={styles.title}>Performance Report</h1>

          <p style={styles.subtitle}>
            Questions Answered: {results.length}
          </p>

          {results.map((r, i) => (
            <div key={i} style={styles.resultCard}>
              <h3 style={{ color: "#222" }}>Question {i + 1}</h3>

              <p
                style={{
                  color: r.score >= 7 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                Score: {r.score}/10
              </p>

              <p><strong>Communication:</strong> {r.communication}</p>
              <p><strong>Confidence:</strong> {r.confidence}</p>
              <p><strong>Strength:</strong> {r.strength}</p>
              <p><strong>Weakness:</strong> {r.weakness}</p>
            </div>
          ))}

          <button style={styles.primaryBtn} onClick={restart}>
            Restart Interview
          </button>
        </div>
      ) : (
        <div style={styles.card}>
          <h2 style={styles.question}>{questions[currentIndex]}</h2>

          <textarea
            style={styles.textarea}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
          />

          <p style={styles.progress}>
            Question {currentIndex + 1} / {questions.length}
          </p>

          <div style={styles.buttonGroup}>
            <button style={styles.primaryBtn} onClick={handleNext}>
              Submit & Next
            </button>

            <button style={styles.finishBtn} onClick={finishEarly}>
              Finish Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    transition: "0.3s ease",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "800px",   // 🔥 increased width
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  },
  title: {
    marginBottom: "20px",
    color: "#222",
    fontSize: "28px",
  },
  subtitle: {
    marginBottom: "20px",
    color: "#444",
    fontSize: "16px",
  },
  question: {
    marginBottom: "25px",
    color: "#111",
    fontSize: "22px",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #aaa",
    marginBottom: "15px",
    fontSize: "15px",
  },
  progress: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  primaryBtn: {
    flex: 1,
    background: "#4CAF50",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  },
  finishBtn: {
    flex: 1,
    background: "#ff6b6b",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  },
  resultCard: {
    textAlign: "left",
    background: "#f7f7f7",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "12px",
    color: "#222",
  },
};

export default App;