// 0 to Shipped — Resume Parser (mock)
// No backend: PDF upload is simulated, score and skills are fake data.

const uploadCard = document.getElementById("upload-card");
const fileInput = document.getElementById("file-input");
const pickFile = document.getElementById("pick-file");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const ringFill = document.getElementById("ring-fill");
const scoreNumber = document.getElementById("score-number");
const verdict = document.getElementById("verdict");
const presentList = document.getElementById("present-skills");
const missingList = document.getElementById("missing-skills");
const resetBtn = document.getElementById("reset");

const CIRCLE_LENGTH = 2 * Math.PI * 52; // ~327, matches stroke-dasharray

// Fake "parser" data — swap these arrays for real parsing later.
const MOCK_RESULTS = [
  {
    score: 78,
    verdict: "Solid resume — a few gaps to close",
    present: ["JavaScript", "HTML", "CSS", "Git", "React", "REST APIs"],
    missing: ["TypeScript", "Testing (Jest)", "CI/CD", "Docker"],
  },
  {
    score: 52,
    verdict: "Early stage — build out the core stack",
    present: ["HTML", "CSS", "JavaScript"],
    missing: ["React", "Node.js", "MongoDB", "Git", "Testing", "CI/CD"],
  },
  {
    score: 91,
    verdict: "Strong resume — ship it",
    present: ["JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "Express", "Git", "Docker", "CI/CD", "Testing"],
    missing: ["GraphQL"],
  },
];

// --- Upload flow ---

pickFile.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) handleFile(fileInput.files[0]);
});

uploadCard.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadCard.classList.add("dragover");
});

uploadCard.addEventListener("dragleave", () => {
  uploadCard.classList.remove("dragover");
});

uploadCard.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadCard.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (file.type !== "application/pdf") {
    alert("Please upload a PDF file.");
    return;
  }

  // Show the file name so the upload feels real.
  uploadCard.querySelector("h2").textContent = `📄 ${file.name}`;

  uploadCard.classList.add("hidden");
  loader.classList.remove("hidden");

  // Simulate parsing latency, then show a fake result.
  setTimeout(() => {
    const data = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
    showResult(data);
  }, 1600);
}

// --- Result rendering ---

function showResult(data) {
  loader.classList.add("hidden");
  result.classList.remove("hidden");

  verdict.textContent = data.verdict;
  presentList.innerHTML = data.present.map((s) => `<li>${s}</li>`).join("");
  missingList.innerHTML = data.missing
    .map((s) => `<li>${s}</li>`)
    .join("");

  animateScore(data.score);
}

function animateScore(score) {
  // Ring: dashoffset goes from full (empty) to (1 - score/100) of full.
  ringFill.style.strokeDashoffset = CIRCLE_LENGTH * (1 - score / 100);

  // Number counts up alongside the ring.
  let current = 0;
  const step = Math.max(1, Math.round(score / 40));
  const timer = setInterval(() => {
    current = Math.min(score, current + step);
    scoreNumber.textContent = current;
    if (current >= score) clearInterval(timer);
  }, 30);
}

// --- Reset ---

resetBtn.addEventListener("click", () => {
  result.classList.add("hidden");
  uploadCard.classList.remove("hidden");
  uploadCard.querySelector("h2").textContent = "Drop your resume here";
  fileInput.value = "";
  ringFill.style.strokeDashoffset = CIRCLE_LENGTH;
  scoreNumber.textContent = "0";
});
