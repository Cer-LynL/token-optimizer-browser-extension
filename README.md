# Token Optimizer Browser Extension

Testing driftor vol21

IM WRITING TEST LINE FOR TESTING DRIFTOR*S WEBHOOK INTEGRATION VOL 5

**Token Optimizer** is a browser extension that optimizes prompts for major LLM chat services, featuring real-time token counting, cost estimation, and advanced optimization techniques based on 2024 research papers.

The extension intercepts your prompts before sending, optimizes them for clarity and token efficiency using research-based algorithms, and shows you exactly how much you could save.

## 🚧 **IMPLEMENTATION STATUS: IN DEVELOPMENT**

### ✅ **Core Features Completed**
- ✅ **Browser Extension Framework**: Manifest V3, content script injection, overlay UI
- ✅ **Prompt Interception**: Works on ChatGPT, Claude, Gemini, and local test files
- ✅ **Research-Based Optimization**: 5 advanced techniques (ITPC, CoS, LPO, MOO, DCA)
- ✅ **Token Counting**: Advanced estimation with research-based algorithms
- ✅ **Side-by-Side UI**: Original vs optimized display with change highlighting
- ✅ **Comprehensive Testing**: Multiple test suites with validation and debugging

### 🔧 **Currently Under Development**
- 🔧 **Optimization Quality**: Fine-tuning algorithms to match expected test results
- 🔧 **Cross-Browser Compatibility**: Testing and optimization for Firefox, Safari
- 🔧 **Production Deployment**: Final testing and publishing preparation

### 📋 **Planned Features (Not Yet Implemented)**
- 📋 **Pro Tier Features**: Advanced paraphrasing, templates, summarization
- 📋 **Stripe Integration**: License key validation, subscription management
- 📋 **Sensitive Data Detection**: Privacy protection and content filtering
- 📋 **Analytics & Budgeting**: Usage tracking and spending limits
- 📋 **Additional LLM Platforms**: DeepSeek, Grok, Mistral, Lovable support

---

## ✨ Current Features

### **Free Tier (Implemented)**
- **Research-Based Optimization**: Advanced algorithms from 2024 research papers
  - ITPC: Iterative Token-level Prompt Compression
  - CoS: Chain-of-Symbols approach
  - LPO: Local Prompt Optimization
  - MOO: Multi-objective Task Decomposition
  - DCA: Dynamic Context Adaptation
- **Smart Duplicate Removal**: Fixes "please please", "to to" issues
- **Phrase Compression**: "at this point in time" → "now", etc.
- **Task Chunking**: Multi-task prompts → numbered lists with proper line breaks
- **Token Estimation**: Advanced estimation based on research
- **Visual Feedback**: Side-by-side comparison with change highlighting

### **Planned Pro Tier Features**
- **Context-aware paraphrasing & tone control**
- **Prompt templates & suggestions**
- **Conversation summarisation**
- **Sensitive-data detection**
- **Advanced analytics & feedback**
- **Token budgeting**

---

## 🛠 Currently Supported LLM Providers
- ✅ OpenAI – GPT-3.5, GPT-4 (ChatGPT)
- ✅ Anthropic – Claude 3 family  
- ✅ Google DeepMind – Gemini
- 🔧 Meta – Llama 3 (planned)
- 📋 DeepSeek – DeepSeek LLM (planned)
- 📋 xAI – Grok (planned)
- 📋 Mistral – Mistral family (planned)

---

## 🧩 How It Works
1. **Detection**: Monitors supported LLM web apps for text input
2. **Interception**: Captures prompts when you press Enter
3. **Optimization**: Applies 5 research-based optimization techniques
4. **Preview**: Shows side-by-side comparison with highlighted changes
5. **Selection**: Choose optimized or original prompt to send

---

## 📦 Tech Stack
- **Extension Framework**: WebExtensions API (Manifest V3)
- **Languages**: JavaScript (ES6+)
- **UI**: Vanilla CSS/JS with responsive overlay system
- **Optimization**: Research-based algorithms from 2024 papers
- **Testing**: Comprehensive test suites with validation
- **Backend**: Node.js + Express + Stripe (planned)

---

## 🚀 Development Setup

### Prerequisites
- Chrome or Edge browser
- Basic knowledge of browser extensions

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd token-optimizer-extension
   ```

2. **Load into Chrome/Edge**
   - Go to `chrome://extensions/` (or `edge://extensions/`)
   - Enable **Developer mode**
   - Click **Load unpacked** and select the project folder

3. **Test the extension**
   - Open any of the test HTML files:
     - `test-simple.html` - Manual testing
     - `test-bulk-fixed.html` - Automated test suite
     - `debug-test.html` - Step-by-step debugging
   - Try typing in textareas and pressing Enter

### Development Files
- `debug-content-v5.js` - Main optimization engine
- `manifest.json` - Extension configuration
- `test-*.html` - Various test suites for development

---

## 🧪 Testing

### Available Test Suites
1. **Simple Manual Testing**: `test-simple.html`
   - Click in textareas and press Enter to test optimization

2. **Automated Bulk Testing**: `test-bulk-fixed.html`
   - Runs 10 test cases automatically with pass/fail validation

3. **Debug Analysis**: `debug-test.html`
   - Step-by-step breakdown of optimization process
   - Shows exactly where optimization succeeds or fails

### Current Test Status
- 🔧 **Optimization Quality**: Working on improving algorithm accuracy
- ✅ **Extension Loading**: Successfully loads and intercepts prompts
- ✅ **UI Functionality**: Overlay displays correctly with proper formatting
- ✅ **Token Counting**: Accurate estimation algorithms

---

## 🔍 Known Issues & Limitations

### Current Development Challenges
1. **Optimization Accuracy**: Some test cases don't match expected results exactly
2. **Pattern Matching**: Complex regex patterns need refinement
3. **Edge Cases**: Handling unusual input formats and punctuation

### Browser Compatibility
- ✅ **Chrome**: Fully functional
- ✅ **Edge**: Fully functional  
- 🔧 **Firefox**: Needs testing and potential manifest updates
- 📋 **Safari**: Requires Web Extension conversion

---

## 💡 Contributing

This project is under active development. Current focus areas:
- Improving optimization algorithm accuracy
- Adding comprehensive error handling
- Expanding test coverage
- Cross-browser compatibility testing

---

## 📋 Development Roadmap

### Phase 1: Core Optimization (Current)
- ✅ Basic extension framework
- 🔧 Optimization algorithm refinement
- ✅ Comprehensive testing suite

### Phase 2: Production Ready
- 📋 Cross-browser compatibility
- 📋 Error handling and edge cases
- 📋 Performance optimization
- 📋 User experience polish

### Phase 3: Advanced Features
- 📋 Pro tier implementation
- 📋 Stripe integration
- 📋 Additional LLM platforms
- 📋 Advanced analytics

### Phase 4: Scale & Deploy
- 📋 Chrome Web Store submission
- 📋 Firefox Add-ons submission
- 📋 Safari App Store submission
- 📋 Production backend deployment

---

## 📄 License
MIT License – see [LICENSE](LICENSE) for details.

---

## ⚠️ Disclaimer
This extension is currently in development and should be considered experimental. Use with caution and always review optimized prompts before sending. The optimization algorithms are based on research papers but may not work perfectly for all use cases.