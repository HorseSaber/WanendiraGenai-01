const apiKey = "AIzaSyDE7ZK0UQ2EN6beaxtQFxHaEo1A0Q87Ge0"; // API pribadi, aman untuk penggunaan lokal pribadi

// --- Gaya Narasi Preset ---
const stylePresets = {
  "alpha-gentle": { label: "Alpha Gentle", tone: "maskulin, karismatik, tenang" },
  "mindfulness-modern": { label: "Mindfulness Modern", tone: "kontemplatif, empatik, lembut" },
  "drama-filmik": { label: "Dramatis Filmik", tone: "emosional, intens, sinematik" }
};

// --- Bangun Prompt AI ---
function buildPrompt(quote, styleKey, visualStyle) {
  const preset = stylePresets[styleKey];
  return `Anda adalah penulis konten YouTube Shorts. Buatlah paket konten lengkap berikut berdasarkan ide utama ini:

Ide: "${quote}"

🎯 GAYA NARASI: ${preset.label.toUpperCase()}
Visual Gaya: ${visualStyle}

🟥 1. Judul Video (maks 70 karakter)
🟨 2. Deskripsi Video (2-3 kalimat + 3-5 hashtag)
🟩 3. Keyword SEO (8-10 kata kunci)
🟦 4. Ide Thumbnail (deskripsi visual + teks singkat)
🟪 5. Skrip Video (Hook, Konflik, Solusi, CTA dalam 60 detik)

Nada narasi: ${preset.tone}
Gunakan emoji untuk setiap bagian.`;
}

// --- Fungsi Utama ---
async function generateMotivation() {
  const quote = document.getElementById("inputQuote").value.trim();
  const style = document.getElementById("styleSelect").value;
  const visual = document.getElementById("visualSelect").value;
  const outputArea = document.getElementById("outputArea");
  const resultText = document.getElementById("resultText");
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");

  if (!quote) {
    showToast("Masukkan ide atau kutipan terlebih dahulu", "error");
    return;
  }

  const prompt = buildPrompt(quote, style, visual);
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  resultText.textContent = "⏳ Memproses, mohon tunggu...";
  outputArea.classList.remove("hidden");

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Gagal menghubungi API");
    }

    const hasil = data.candidates?.[0]?.content?.parts?.[0]?.text;
    resultText.textContent = hasil || "⚠️ Tidak ada hasil yang bisa ditampilkan.";
    showToast("✅ Konten berhasil dibuat!");
  } catch (err) {
    resultText.textContent = `[Error] ${err.message}`;
    showToast("❌ Gagal memproses konten.", "error");
  }
}

// --- Fungsi Notifikasi Toast ---
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  toastMsg.textContent = msg;
  toast.classList.add("show");
  toast.classList.remove("bg-green-600", "bg-red-600");
  toast.classList.add(type === "error" ? "bg-red-600" : "bg-green-600");

  setTimeout(() => toast.classList.remove("show"), 3000);
}