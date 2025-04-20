import { useState } from "react";
import axios from "axios";
import "../styles/AskQuestion.css";

const AskQuestion = () => {
    const [questionText, setQuestionText] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:5000/api/questions",
                { questionText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess("✅ Question sent successfully!");
            setQuestionText(""); // Clear field after submission
        } catch (err) {
            console.error("❌ Error sending question:", err);
            setError(err.response?.data?.message || "Failed to send question.");
        }
    };

    return (
        <div className="ask-question-container">
            <h2>Ask a Diet-Related Question</h2>

            <form onSubmit={handleSubmit}>
                <textarea
                    rows="5"
                    placeholder="Write your question here..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                ></textarea>

                <button type="submit">Send Question</button>
            </form>

            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AskQuestion;
