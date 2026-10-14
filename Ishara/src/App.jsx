import { useState } from "react";
import Recognition from "./components/Recognition";
import SentenceBuilder from "./components/SentenceBuilder";
import ReverseTranslate from "./components/ReverseTranslate";
import "./App.css";

export default function App() {
  const [sentence, setSentence] = useState("");

  const addWord = (word) => setSentence((prev) => `${prev} ${word}`.trim());

  return (
    <main className="container">
      <h1>ইশারা – Sign Recognition</h1>
      <Recognition onAddWord={addWord} />
      <SentenceBuilder sentence={sentence} onChange={setSentence} />
      <ReverseTranslate />
    </main>
  );
}