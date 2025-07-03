// 🟡 Ganti dengan API Key milikmu!
const apiKey = "AIzaSyDE7ZK0UQ2EN6beaxtQFxHaEo1A0Q87Ge0";

// 🔥 Fungsi utama
async function generateImageFromPrompt() {
  const prompt = document.getElementById("promptInput").value.trim();
  const style = document.getElementById("styleSelect").value;
  const aspect = document.getElementById("aspectSelect").value;

  if (!prompt) {
    alert("Harap isi prompt terlebih dahulu.");
    return;
  }

  const fullPrompt = `${prompt}, gaya visual: ${style}, rasio: ${aspect}`;
  console.log("Prompt dikirim:", fullPrompt);

  const generateBtn = document.getElementById("generateBtn");
  const resultImage = document.getElementById("resultImage");
  const outputArea = document.getElementById("outputArea");

  // Loading state
  generateBtn.disabled = true;
  generateBtn.textContent = "⏳ Memproses...";
  resultImage.classList.add("hidden");

  // Endpoint Imagen 3 (Gemini Image API)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  const payload = {
    instances: [{ prompt: fullPrompt }],
    parameters: { sampleCount: 1 }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error?.message || `HTTP Error ${res.status}`);
    }

    const data = await res.json();
    const base64 = data?.predictions?.[0]?.bytesBase64Encoded;

    if (!base64) {
      throw new Error("Gagal mendapatkan data gambar dari API.");
    }

    const imgUrl = `data:image/png;base64,${base64}`;
    resultImage.src = imgUrl;
    resultImage.classList.remove("hidden");
    outputArea.classList.remove("hidden");

    console.log("✅ Gambar berhasil dibuat!");
  } catch (err) {
    alert("❌ Error: " + err.message);
    console.error("Gagal:", err);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "🚀 Hasilkan Gambar";
  }
}

// 🔻 Fungsi Unduh
function downloadImage() {
  const imageUrl = document.getElementById("resultImage").src;
  if (!imageUrl) {
    alert("Tidak ada gambar untuk diunduh.");
    return;
  }
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = "gambar-ai-wanendira.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}