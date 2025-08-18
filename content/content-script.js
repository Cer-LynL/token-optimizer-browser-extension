class TokenOptimizerContentScript {
  constructor() {
    this.overlay = null;
    this.isProcessing = false;
    this.currentService = null;
    this.currentModel = null;
    this.settings = {};
    
    // Wait for DOM to be ready before initializing
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  async init() {
    try {
      await this.loadSettings();
      this.detectService();
      this.overlay = new TokenOptimizerOverlay();
      this.setupEventListeners();
      
      console.log('Token Optimizer initialized on', window.location.hostname);
    } catch (error) {
      console.error('Token Optimizer initialization failed:', error);
    }
  }

  async loadSettings() {
    this.settings = await ExtensionStorage.getSettings();
  }

  detectService() {
    this.currentService = ModelDetection.detectService();
    this.currentModel = ModelDetection.detectModel();
    
    if (this.currentService) {
      console.log(`Detected ${this.currentService.name} with model ${this.currentModel}`);
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        this.handleEnterPress(e);
      }
    });

    document.addEventListener('click', (e) => {
      if (this.isSubmitButton(e.target)) {
        this.handleSubmitClick(e);
      }
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkForNewInputs(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  checkForNewInputs(element) {
    const inputs = element.querySelectorAll('textarea, div[contenteditable="true"]');
    inputs.forEach(input => {
      if (this.isRelevantInput(input) && !input.hasAttribute('data-to-monitored')) {
        input.setAttribute('data-to-monitored', 'true');
        this.setupInputListeners(input);
      }
    });
  }

  setupInputListeners(input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        this.handleEnterPress(e);
      }
    });
  }

  isRelevantInput(element) {
    if (!element || !element.isConnected) return false;
    
    const rect = element.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 30) return false;
    
    const relevantAttributes = [
      'placeholder',
      'aria-label',
      'data-testid',
      'class',
      'id'
    ];
    
    const text = relevantAttributes
      .map(attr => element.getAttribute(attr) || '')
      .join(' ')
      .toLowerCase();
    
    const keywords = ['message', 'chat', 'prompt', 'input', 'send', 'ask'];
    return keywords.some(keyword => text.includes(keyword));
  }

  isSubmitButton(element) {
    if (!element || element.tagName !== 'BUTTON') return false;
    
    const attributes = [
      element.getAttribute('type'),
      element.getAttribute('aria-label'),
      element.getAttribute('data-testid'),
      element.className,
      element.textContent
    ].join(' ').toLowerCase();
    
    return attributes.includes('send') || 
           attributes.includes('submit') ||
           element.type === 'submit';
  }

  async handleEnterPress(event) {
    if (this.isProcessing) return;
    
    const target = event.target;
    if (!this.isRelevantInput(target)) return;
    
    const text = this.extractText(target);
    if (!text || text.trim().length < 10) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    await this.processPrompt(text);
  }

  async handleSubmitClick(event) {
    if (this.isProcessing) return;
    
    const inputs = this.findNearbyInputs(event.target);
    if (inputs.length === 0) return;
    
    const text = this.extractText(inputs[0]);
    if (!text || text.trim().length < 10) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    await this.processPrompt(text);
  }

  findNearbyInputs(button) {
    const parent = button.closest('form') || button.parentElement;
    if (!parent) return [];
    
    const inputs = parent.querySelectorAll('textarea, div[contenteditable="true"]');
    return Array.from(inputs).filter(input => this.isRelevantInput(input));
  }

  extractText(element) {
    if (element.tagName === 'TEXTAREA') {
      return element.value;
    } else if (element.contentEditable === 'true') {
      return element.textContent || element.innerText;
    }
    return '';
  }

  async processPrompt(originalText) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    try {
      await this.loadSettings();
      
      if (this.settings.autoOptimize) {
        const optimized = PromptOptimizer.optimize(originalText);
        await this.sendPrompt(optimized.optimized);
        await this.updateAnalytics(originalText, optimized.optimized);
        return;
      }
      
      const optimizationResult = PromptOptimizer.optimize(originalText);
      
      const serviceId = this.settings.selectedProvider || 
                       (this.currentService ? Object.keys(ModelDetection.LLM_PROVIDERS).find(key => 
                         ModelDetection.LLM_PROVIDERS[key] === this.currentService) : 'chat.openai.com');
      const modelId = this.settings.selectedModel || this.currentModel || 
                     ModelDetection.LLM_PROVIDERS[serviceId].defaultModel;
      
      const modelInfo = ModelDetection.getModelInfo(serviceId, modelId);
      const tokenizerType = Tokenizer.getTokenizerForService(serviceId);
      
      const originalTokens = Tokenizer.estimateTokens(originalText, tokenizerType);
      const optimizedTokens = Tokenizer.estimateTokens(optimizationResult.optimized, tokenizerType);
      
      const originalCost = Tokenizer.calculateCost(originalTokens, modelInfo.inputCost, modelInfo.outputCost);
      const optimizedCost = Tokenizer.calculateCost(optimizedTokens, modelInfo.inputCost, modelInfo.outputCost);
      
      await this.updateTokenUsage(originalTokens);
      
      const overlayData = {
        original: originalText,
        optimized: optimizationResult.optimized,
        originalTokens,
        optimizedTokens,
        originalCost,
        optimizedCost,
        modelInfo,
        currentService: serviceId,
        currentModel: modelId,
        changes: optimizationResult.changes,
        isPro: this.settings.isPro,
        stats: optimizationResult.stats
      };
      
      await this.overlay.show(overlayData);
      
    } catch (error) {
      console.error('Error processing prompt:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async sendPrompt(text) {
    const inputs = document.querySelectorAll('textarea, div[contenteditable="true"]');
    const relevantInput = Array.from(inputs).find(input => this.isRelevantInput(input));
    
    if (!relevantInput) {
      console.warn('No suitable input found to send prompt');
      return;
    }
    
    if (relevantInput.tagName === 'TEXTAREA') {
      relevantInput.value = text;
      relevantInput.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      relevantInput.textContent = text;
      relevantInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    const submitButton = document.querySelector('button[type="submit"], button[data-testid*="send"], button[aria-label*="send"]');
    if (submitButton) {
      setTimeout(() => {
        submitButton.click();
      }, 100);
    }
  }

  async updateTokenUsage(tokens) {
    const currentMonth = new Date().getMonth();
    const storedMonth = this.settings.analytics.lastReset ? 
      new Date(this.settings.analytics.lastReset).getMonth() : currentMonth;
    
    let usedTokens = this.settings.usedTokens || 0;
    
    if (currentMonth !== storedMonth) {
      usedTokens = 0;
    }
    
    usedTokens += tokens;
    
    await ExtensionStorage.updateSettings({
      usedTokens,
      analytics: {
        ...this.settings.analytics,
        lastReset: currentMonth !== storedMonth ? Date.now() : this.settings.analytics.lastReset
      }
    });
    
    if (this.settings.tokenBudget > 0 && usedTokens > this.settings.tokenBudget * 0.9) {
      this.showBudgetWarning(usedTokens);
    }
  }

  showBudgetWarning(usedTokens) {
    const percentUsed = (usedTokens / this.settings.tokenBudget) * 100;
    const message = percentUsed >= 100 ? 
      'Token budget exceeded!' : 
      `Token budget ${Math.round(percentUsed)}% used`;
    
    console.warn(message);
  }

  async updateAnalytics(original, optimized) {
    const tokenizerType = Tokenizer.getTokenizerForService(
      this.settings.selectedProvider || 'chat.openai.com'
    );
    
    const originalTokens = Tokenizer.estimateTokens(original, tokenizerType);
    const optimizedTokens = Tokenizer.estimateTokens(optimized, tokenizerType);
    const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
    
    await ExtensionStorage.updateSettings({
      analytics: {
        ...this.settings.analytics,
        totalTokensSaved: this.settings.analytics.totalTokensSaved + tokensSaved,
        optimizationsCount: this.settings.analytics.optimizationsCount + 1
      }
    });
  }
}

// Initialize the extension
(function() {
  'use strict';
  
  // Ensure we only run once
  if (window.tokenOptimizerLoaded) {
    return;
  }
  window.tokenOptimizerLoaded = true;
  
  // Initialize when ready
  try {
    new TokenOptimizerContentScript();
  } catch (error) {
    console.error('Failed to initialize Token Optimizer:', error);
  }
})();