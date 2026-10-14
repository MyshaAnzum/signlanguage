import { useState } from "react";
import { getReverseSigns } from "../api";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function ReverseTranslate() {
  const [text, setText] = useState("");
  const [signs, setSigns] = useState([]);
  const [message, setMessage] = useState("");

  const showSigns = async (value) => {
    try {
      setSigns(await getReverseSigns(value));
      setMessage("");
    } catch {
      setMessage("Cannot reach backend. Is the server running?");
    }
  };

  const listen = () => {
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      setText(spoken);
      showSigns(spoken);
    };
    recognition.start();
  };

  return (
    <section className="card">
      <h2>Text / Voice to Sign</h2>
      <div className="row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type Bangla text"
        />
        <button onClick={() => showSigns(text)}>Show Signs</button>
        {SpeechRecognition && <button onClick={listen}>🎤 Voice</button>}
      </div>
      {message && <p className="error">{message}</p>}

      <div className="signs">
        {signs.map((sign, index) => (
          <div key={index} className="sign">
            {sign.image ? <img src={sign.image} alt={sign.word} /> : <div className="placeholder">?</div>}
            <span>{sign.word}</span>
          </div>
        ))}
      </div>
    </section>
  );
}