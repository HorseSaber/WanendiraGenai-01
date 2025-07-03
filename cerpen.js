// --- KONFIGURASI GAYA CERITA ---
const cerpenPresets = {
  "dongeng-klasik": { label: "Dongeng Klasik", tone: "naratif, imajinatif, penuh pesan moral" },
  "fiksi-fantasi": { label: "Fiksi Fantasi", tone: "ajaib, petualangan, penuh kejutan" },
  "drama-realistis": { label: "Drama Realistis", tone: "emosional, manusiawi, reflektif" },
  "thriller-pendek": { label: "Thriller Pendek", tone: "menegangkan, misterius, cepat" },
  "humor-gokil": { label: "Humor Gokil", tone: "kocak, absurd, penuh punchline" },
  "inspirasional": { label: "Inspirasi Kehidupan", tone: "penuh makna, menyentuh, membangun harapan" },
  "mistis-nusantara": { label: "Mistis Nusantara", tone: "angker, spiritual, kearifan lokal" },
  "sci-fi-mini": { label: "Sci-Fi Mini", tone: "futuristik, spekulatif, teknologi imajinatif" },
  "puitis-alternatif": { label: "Puitis Alternatif", tone: "metaforis, bebas, puitik kontemporer" },
  "eksperimen-formal": { label: "Eksperimen Formal", tone: "unik, menantang format, inovatif" }
};

// --- FUNGSI BANGUN PROMPT CERITA ---
function buildCerpenPrompt(ide, gaya, visual) {
  const preset = cerpenPresets[gaya];
  return `Buatkan sebuah cerpen pendek (300–600 kata) berdasarkan ide: "${ide}"

📌 Gaya Narasi: ${preset.label}
📌 Nada & Suasana: ${preset.tone}
📌 Gaya Visual: ${visual}

Format:
1. Judul Cerita (maksimal 60 karakter)
2. Isi Cerita (narasi penuh dengan paragraf terstruktur)
3. Prompt Visual: deskripsi detail satu adegan utama dari cerita sesuai gaya visual.
`;
}

// --- API KEY PRIBADI (ganti sesuai milikmu jika perlu) ---
const apiKey = "AIzaSyDE7ZK0UQ2EN6beaxtQFxHaEo1A0Q87Ge0";
const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

// --- GENERATE CERITA ---
document.getElementById("generateCerpenBtn").addEventListener("click", async () => {
  const input = document.getElementById("cerpenInput").value.trim();
  const style = document.getElementById("narrativeStyle").value;
  const visual = document.getElementById("visualStyle").value;
  const btn = document.getElementById("generateCerpenBtn");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");
  const outputBox = document.getElementById("cerpenResult");
  const outputContainer = document.getElementById("outputCerpen");

  if (!input) {
    alert("Masukkan ide cerita terlebih dahulu.");
    return;
  }

  btn.disabled = true;
  btnText.textContent = "Memproses...";
  btnLoader.classList.remove("hidden");
  outputContainer.classList.remove("hidden");
  outputBox.textContent = "⏳ Sedang menghubungi AI, harap tunggu...";

  const prompt = buildCerpenPrompt(input, style, visual);

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, topP: 0.95 }
      })
    });

    const result = await response.json();
    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    outputBox.textContent = output || "[Gagal memuat cerita, coba lagi]";
  } catch (err) {
    outputBox.textContent = `[Terjadi kesalahan]: ${err.message}`;
  }

  btn.disabled = false;
  btnText.textContent = "Hasilkan Cerpen";
  btnLoader.classList.add("hidden");
});

// --- SALIN CERITA ---
function copyCerpen() {
  const text = document.getElementById("cerpenResult").textContent;
  navigator.clipboard.writeText(text).then(() => alert("Cerita berhasil disalin."));
}

// --- UNDUH CERITA ---
function downloadCerpen() {
  const text = document.getElementById("cerpenResult").textContent;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cerpen-wanendira.txt";
  link.click();
}