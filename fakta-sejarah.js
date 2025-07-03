// Ganti dengan API key milikmu
const apiKey = "AIzaSyDE7ZK0UQ2EN6beaxtQFxHaEo1A0Q87Ge0";

const stylePreset = "Tulis dengan gaya bahasa naratif informatif, membangkitkan rasa ingin tahu, disertai konteks yang membuat pembaca merasa seolah kembali ke masa itu. Jangan terlalu panjang.";

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.remove("bg-green-600", "bg-red-600");
  toast.classList.add(isError ? "bg-red-600" : "bg-green-600");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

function buildSejarahPrompt(topik) {
  return `Buat satu fakta sejarah menarik dan langka terkait topik berikut:

Topik: ${topik}

Format Output:
📌 Judul Fakta
📅 Tahun atau Era
📖 Penjelasan Singkat (100-200 kata)
🌍 Konteks Unik yang Jarang Diketahui

${stylePreset}`;
}

async function generateSejarah() {
  const input = document.getElementById("sejarahInput").value.trim();
  const outputDiv = document.getElementById("sejarahOutput");
  const resultBox = document.getElementById("sejarahResult");

  if (!input) {
    showToast("Masukkan topik sejarah terlebih dahulu!", true);
    return;
  }

  outputDiv.classList.remove("hidden");
  resultBox.textContent = "⏳ Memproses fakta sejarah...";

  const prompt = buildSejarahPrompt(input);

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, topP: 0.95 }
      })
    });

    const data = await res.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      resultBox.textContent = "[⚠️ Gagal menghasilkan output. Coba lagi.]";
      showToast("Fakta gagal diambil.", true);
    } else {
      resultBox.textContent = output;
      showToast("Fakta sejarah berhasil dibuat!");
    }

  } catch (err) {
    console.error(err);
    resultBox.textContent = "[Terjadi kesalahan saat menghubungi server]";
    showToast("Gagal menghubungi API!", true);
  }
}

function copySejarah() {
  const text = document.getElementById("sejarahResult").textContent;
  if (!text || text.startsWith("[")) return showToast("Tidak ada yang bisa disalin.", true);

  navigator.clipboard.writeText(text).then(() => {
    showToast("Konten berhasil disalin!");
  }).catch(() => {
    showToast("Gagal menyalin teks.", true);
  });
}

function downloadSejarah() {
  const text = document.getElementById("sejarahResult").textContent;
  if (!text || text.startsWith("[")) return showToast("Tidak ada konten untuk diunduh.", true);

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "fakta-sejarah-wanendira.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Unduhan dimulai.");
}