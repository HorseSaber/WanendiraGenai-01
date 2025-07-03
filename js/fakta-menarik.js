// === Preset Gaya Naratif Fakta ===
const faktaStylePresets = {
  "fakta-fun": {
    label: "Fun & Gen-Z",
    tone: "kasual, jenaka, penuh ekspresi emoji 😄🔥"
  },
  "ilmiah": {
    label: "Ilmiah Sederhana",
    tone: "fakta logis, penjelasan ringan, mudah dipahami"
  },
  "film-naratif": {
    label: "Naratif Filmik",
    tone: "gaya sinematik, penuh tensi dan narasi menarik"
  },
  "mindblowing": {
    label: "Mindblowing",
    tone: "mengejutkan, wawasan tak terduga, membuat mikir"
  },
  "dark-trivia": {
    label: "Dark Trivia",
    tone: "sedikit menyeramkan, misterius, fakta gelap"
  },
  "visual-realistis": {
    label: "Visual Realistis",
    tone: "gambaran konkret, visual kuat, eksplisit"
  }
};

// === Bangun Prompt Fakta AI ===
function buildFaktaPrompt(keyword, styleKey, visualPrompt) {
  const preset = faktaStylePresets[styleKey];
  return `Anda adalah penulis konten menarik dan edukatif untuk platform seperti TikTok, Instagram, dan YouTube Shorts.

Tugas Anda adalah membuat 3-5 fakta unik, mengejutkan, atau menghibur berdasarkan topik: "${keyword}"

🧠 Gaya Naratif: ${preset.label}
🎨 Visual Prompt: ${visualPrompt}
🎙️ Nada: ${preset.tone}

Format output:
1️⃣ [Fakta #1]
Penjelasan singkat (1-2 kalimat).
🎨 Visual Prompt untuk ilustrasi: [deskripsi visual sinematik/gaya ${visualPrompt}]

2️⃣ [Fakta #2]
Penjelasan singkat.
🎨 Visual Prompt: ...

...dan seterusnya hingga Fakta #5.

Gunakan nada ${preset.tone}, jangan terlalu formal. Gunakan emoji untuk memperkuat efek pembaca dan buat pembaca ingin membagikan fakta ini ke orang lain.`;
}

// === Fungsi Generate Fakta ===
document.getElementById("generateFaktaBtn").addEventListener("click", async () => {
  const input = document.getElementById("faktaInput").value.trim();
  const style = document.getElementById("faktaStyle").value;
  const visual = document.getElementById("faktaVisual").value;
  const outputBox = document.getElementById("faktaOutput");
  const outputContainer = document.getElementById("faktaOutputContainer");

  if (!input) {
    alert("Masukkan topik atau kata kunci terlebih dahulu!");
    return;
  }

  // Update UI
  const btn = document.getElementById("generateFaktaBtn");
  const btnText = document.getElementById("faktaBtnText");
  const btnLoader = document.getElementById("faktaBtnLoader");

  btn.disabled = true;
  btnText.textContent = "Memproses...";
  btnLoader.classList.remove("hidden");
  outputBox.textContent = "⏳ Menghubungi AI... mohon tunggu sebentar.";
  outputContainer.classList.remove("hidden");

  const apiKey = "AIzaSyDE7ZK0UQ2EN6beaxtQFxHaEo1A0Q87Ge0"; // <- Ganti sesuai milikmu
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const prompt = buildFaktaPrompt(input, style, visual);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, topP: 0.9 }
      })
    });

    const data = await res.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "[Gagal mengambil output]";
    outputBox.textContent = output;

  } catch (err) {
    outputBox.textContent = "[Gagal memproses permintaan AI]";
    console.error(err);
  } finally {
    btn.disabled = false;
    btnText.textContent = "Hasilkan Fakta";
    btnLoader.classList.add("hidden");
  }
});

// === Salin dan Unduh Output Fakta ===
function copyFakta() {
  const text = document.getElementById("faktaOutput").textContent;
  if (!text) return alert("Tidak ada konten untuk disalin.");
  navigator.clipboard.writeText(text).then(() => alert("Berhasil disalin!"));
}

function downloadFakta() {
  const text = document.getElementById("faktaOutput").textContent;
  if (!text) return alert("Tidak ada konten untuk diunduh.");
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "fakta-menarik.txt";
  a.click();
}