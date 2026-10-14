const BASE_URL = "http://localhost:4000/api";

const request = async (path, options) => {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) throw new Error("Request failed");
  return response.json();
};

const post = (path, body) =>
  request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const predictSign = (features) => post("/predict", { features });
export const saveSample = (label, features) => post("/samples", { label, features });
export const getReverseSigns = (text) => request(`/reverse?text=${encodeURIComponent(text)}`);