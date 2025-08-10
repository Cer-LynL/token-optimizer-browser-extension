# LLM Prompt Optimizer Extension

**LLM Prompt Optimizer** is a cross-browser extension (Chrome, Edge, Safari) that helps you write better, shorter, and cheaper prompts for popular large-language-model (LLM) chat services like ChatGPT, Claude, Gemini, Lovable, and more.

The extension intercepts your prompts right before sending, optimises them for clarity and token efficiency, and shows you exactly how much you could save. Pro users unlock advanced tools for paraphrasing, templates, summarisation, sensitive-data checks, and usage analytics.

---

## ✨ Features

### **Free Tier**
- **Prompt optimisation:** Automatic removal of fillers, verbose phrasing, and redundant context.
- **Abbreviation rules:** Replace long entity names with common abbreviations.
- **Semantic chunking:** Split complex multi-task prompts into concise, focused ones.
- **Token & cost estimation:** See the before/after token count and estimated price for your prompt.
- **Model detection & dropdown:** Detects LLM provider from current tab and lets you override the selection.
- **Always-count mode:** Tracks token usage even if you skip optimisation.

### **Pro Tier**
- **Context-aware paraphrasing & tone control:** Adjust formality, style, and clarity with advanced rewrites.
- **Prompt templates & suggestions:** Curated and user-saved templates for common tasks.
- **Conversation summarisation:** Compress chat history to keep within model limits.
- **Sensitive-data detection:** Warns before sending personal or confidential info.
- **Advanced analytics & feedback:** Tracks total tokens used, saved, and suggests usage improvements.
- **Custom model integration:** Use your own API key for richer features.
- **Token budgeting:** Set a monthly limit and get alerts as you approach it.

---

## 🛠 Supported LLM Providers
- OpenAI – GPT-3.5, GPT-4 (ChatGPT)
- Anthropic – Claude 3 family
- Google DeepMind – Gemini
- Meta – Llama 3
- DeepSeek – DeepSeek LLM
- xAI – Grok
- Mistral – Mistral family

---

## 🧩 How It Works
1. Detects the chat input on supported LLM web apps.
2. Intercepts the prompt when you hit **Enter** or click **Send**.
3. Runs optimisation logic locally in your browser.
4. Displays an overlay with:
   - Optimised prompt preview
   - Token & cost savings
   - Model selection dropdown
   - Optional Pro tools
5. Sends either the optimised or original prompt.

---

## 📦 Tech Stack
- **Extension framework:** WebExtensions API (Manifest V3)
- **Languages:** TypeScript / JavaScript
- **UI:** Lightweight CSS/Vanilla JS UI components
- **Token estimation:** JS tokenizer libs + custom heuristics
- **Backend (Pro verification):** Node.js + Express (or FastAPI) with Stripe integration
- **Packaging:** Chrome/Edge unpacked extension, Safari Web Extension Converter

---

## 🚀 Local Development

### Prerequisites
- Node.js ≥ 18
- npm / yarn / pnpm
- Stripe account (test mode for dev)
- Chrome or Edge browser (Safari optional for testing)

### Install dependencies
```bash
npm install
```

### Build extension
```bash
npm run build
```

### Load into Chrome/Edge
1. Go to `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `/dist` folder.

### Run local backend (for Pro verification)
```bash
npm run dev:server
```
This serves:
- `/verify` – Check if a licence key is valid.
- `/stripe-webhook` – Handle subscription events.

---

## 💳 Stripe Integration
- Pro subscriptions are purchased via an external landing page.
- On successful payment, a licence key is generated and emailed to the user.
- The extension verifies the key via your backend before unlocking Pro features.

---

## 🔒 Privacy
- All Free-tier optimisation logic and token counting happens locally in your browser.
- Pro features that require cloud processing (e.g. advanced paraphrasing) send data only after explicit consent.
- No prompt data is stored server-side without user permission.

---

## 🧪 Testing
- Mock LLM chat pages locally for safe DOM testing.
- Use Stripe test mode and Stripe CLI for simulating subscription events.
- Unit tests for optimisation logic, token counting, and sensitive-data detection.

---

## 📅 Roadmap
- Multi-language optimisation support
- Expanded template library
- Team and enterprise plans
- Per-provider cost tracking

---

## 📄 License
MIT License – see [LICENSE](LICENSE) for details.
