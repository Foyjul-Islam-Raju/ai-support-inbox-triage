const sampleMessage = "I was charged twice for my subscription this morning. Please help me get the duplicate charge reviewed.";
const messageNode = document.querySelector("#sample-message");
const notice = document.querySelector("#notice");
const runButton = document.querySelector("#run-button");
const previewButton = document.querySelector("#preview-button");

function showResult(result, mode) {
  document.querySelector("#category").innerHTML = `<span class="category-icon">${result.category === "Billing" ? "＄" : "✳"}</span> ${escapeHtml(result.category)}`;
  document.querySelector("#priority").innerHTML = `<i></i> ${escapeHtml(result.priority)}`;
  document.querySelector("#summary").textContent = result.summary;
  document.querySelector("#action").textContent = result.recommended_action;
  document.querySelector("#reply").textContent = result.reply_draft;
  const badge = document.querySelector("#mode-badge");
  badge.textContent = mode === "live_ai" ? "LIVE AI RESULT" : "SAMPLE PREVIEW";
  badge.classList.toggle("live", mode === "live_ai");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

previewButton.addEventListener("click", async () => {
  notice.textContent = "";
  messageNode.textContent = sampleMessage;
  try {
    const response = await fetch("/api/preview", { method: "POST" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not load sample preview.");
    showResult(payload.result, payload.mode);
    notice.textContent = "Sample preview loaded. No AI API request was sent.";
  } catch (error) {
    notice.textContent = error.message;
  }
});

runButton.addEventListener("click", async () => {
  const message = window.prompt("Paste a non-sensitive sample support message (up to 5,000 characters):", sampleMessage);
  if (!message || !message.trim()) return;
  if (message.length > 5000) {
    notice.textContent = "Keep the message under 5,000 characters.";
    return;
  }
  messageNode.textContent = message.trim();
  notice.textContent = "Sending to your configured AI provider…";
  runButton.disabled = true;
  runButton.textContent = "Working…";
  try {
    const response = await fetch("/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim() })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Triage request failed.");
    showResult(payload.result, payload.mode);
    notice.textContent = "Live AI result loaded. Review it before taking action.";
  } catch (error) {
    notice.textContent = error.message;
  } finally {
    runButton.disabled = false;
    runButton.innerHTML = "✦ Run live AI triage <span>→</span>";
  }
});

document.querySelector("#copy-summary").addEventListener("click", async () => {
  await navigator.clipboard.writeText(document.querySelector("#summary").textContent);
  notice.textContent = "Summary copied.";
});
document.querySelector("#copy-reply").addEventListener("click", async () => {
  await navigator.clipboard.writeText(document.querySelector("#reply").textContent);
  notice.textContent = "Reply draft copied. Nothing was sent.";
});

fetch("/api/status").then((response) => response.json()).then((status) => {
  if (!status.api_configured) {
    notice.textContent = "Sample preview is ready. Live AI requires an API key in the local environment.";
  }
}).catch(() => {});
