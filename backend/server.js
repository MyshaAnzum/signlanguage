import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { predict } from "./classifier.js";

const app = express();
const PORT = 4000;
const dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES_FILE = path.join(dirname, "data", "samples.json");
const SIGNS_FILE = path.join(dirname, "data", "signs.json");

app.use(cors());
app.use(express.json());
app.use("/signs", express.static(path.join(dirname, "public", "signs")));

const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
};

const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data));

const isValidFeatures = (features) => Array.isArray(features) && features.length === 42;

app.post("/api/samples", (req, res) => {
  const { label, features } = req.body;

  if (!label || !isValidFeatures(features)) {
    return res.status(400).json({ message: "Invalid sample" });
  }

  const samples = readJson(SAMPLES_FILE, []);
  samples.push({ label, features });
  writeJson(SAMPLES_FILE, samples);

  res.status(201).json({ total: samples.length });
});

app.post("/api/predict", (req, res) => {
  const { features } = req.body;

  if (!isValidFeatures(features)) {
    return res.status(400).json({ message: "Invalid features" });
  }

  res.json(predict(readJson(SAMPLES_FILE, []), features));
});

app.get("/api/reverse", (req, res) => {
  const signs = readJson(SIGNS_FILE, {});
  const words = (req.query.text || "").trim().split(/\s+/).filter(Boolean);
  const baseUrl = `${req.protocol}://${req.get("host")}/signs`;

  const toSign = (word) => ({
    word,
    image: signs[word] ? `${baseUrl}/${signs[word]}` : null,
  });

  const result = words.flatMap((word) => (signs[word] ? [toSign(word)] : [...word].map(toSign)));
  res.json(result);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));