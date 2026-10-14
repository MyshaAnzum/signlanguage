import { speak } from "../utils";

export default function SentenceBuilder({ sentence, onChange }) {
  const removeLastWord = () => onChange(sentence.split(" ").slice(0, -1).join(" "));

  return (
    <section className="card">
      <h2>Sentence Builder</h2>
      <textarea
        rows={4}
        value={sentence}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Recognized words will appear here"
      />
      <div className="row">
        <button onClick={() => speak(sentence)}>Speak</button>
        <button onClick={removeLastWord}>Remove Last Word</button>
        <button onClick={() => onChange("")}>Clear</button>
      </div>
    </section>
  );
}