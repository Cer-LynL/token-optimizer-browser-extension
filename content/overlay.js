class TokenOptimizerOverlay {
  constructor() {
    this.overlay = null;
    this.isVisible = false;
    this.currentData = null;
  }

  async show(data) {
    this.currentData = data;
    
    if (this.overlay) {
      this.hide();
    }
    
    this.overlay = this.createOverlay(data);
    document.body.appendChild(this.overlay);
    this.isVisible = true;
    
    this.positionOverlay();
    this.attachEventListeners();
  }

  hide() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
      this.isVisible = false;
    }
  }

  createOverlay(data) {
    const overlay = document.createElement('div');
    overlay.className = 'token-optimizer-overlay';
    overlay.innerHTML = this.generateOverlayHTML(data);
    return overlay;
  }

  generateOverlayHTML(data) {
    const { original, optimized, originalTokens, optimizedTokens, originalCost, optimizedCost, modelInfo, changes, isPro } = data;
    
    const tokenSavings = originalTokens - optimizedTokens;
    const costSavings = originalCost - optimizedCost;
    const savingsPercent = Math.round((tokenSavings / originalTokens) * 100);
    
    return `
      <div class="to-overlay-header">
        <h3 class="to-overlay-title">🚀 Token Optimizer</h3>
        <button class="to-overlay-close" data-action="close">&times;</button>
      </div>

      ${this.generateStatsSection(originalTokens, optimizedTokens, originalCost, optimizedCost, savingsPercent)}
      
      ${this.generateModelSelector(data)}
      
      ${this.generatePromptComparison(original, optimized, changes)}
      
      ${isPro ? this.generateProFeatures(data) : this.generateProUpgrade()}
      
      ${this.generateAutoOptimizeToggle()}
      
      ${this.generateActionButtons()}
    `;
  }

  generateStatsSection(originalTokens, optimizedTokens, originalCost, optimizedCost, savingsPercent) {
    const tokenSavings = originalTokens - optimizedTokens;
    const costSavings = originalCost - optimizedCost;
    
    return `
      <div class="to-stats-grid">
        <div class="to-stat-card">
          <div class="to-stat-label">Original</div>
          <div class="to-stat-value">${originalTokens.toLocaleString()}</div>
          <div class="to-stat-cost">${Tokenizer.formatCost(originalCost)}</div>
        </div>
        <div class="to-stat-card">
          <div class="to-stat-label">Optimized</div>
          <div class="to-stat-value to-savings-positive">${optimizedTokens.toLocaleString()}</div>
          <div class="to-stat-cost to-savings-positive">${Tokenizer.formatCost(optimizedCost)}</div>
        </div>
      </div>
      
      ${tokenSavings > 0 ? `
        <div class="to-stat-card to-bg-success to-border-success" style="margin-bottom: 1rem;">
          <div class="to-stat-label">Savings</div>
          <div class="to-stat-value to-text-success">
            ${tokenSavings.toLocaleString()} tokens (${savingsPercent}%)
          </div>
          <div class="to-stat-cost to-text-success">${Tokenizer.formatCost(costSavings)} saved</div>
        </div>
      ` : ''}
    `;
  }

  generateModelSelector(data) {
    const { currentService, currentModel, modelInfo } = data;
    const providers = ModelDetection.getAllProviders();
    
    return `
      <div class="to-model-selector">
        <div class="to-model-row">
          <div style="flex: 1;">
            <label class="to-text-sm to-font-medium" style="display: block; margin-bottom: 0.5rem;">
              Model Provider
            </label>
            <select class="to-select to-w-full" data-action="change-provider">
              ${providers.map(provider => `
                <option value="${provider.id}" ${provider.id === currentService ? 'selected' : ''}>
                  ${provider.name}
                </option>
              `).join('')}
            </select>
          </div>
          
          <div style="flex: 1;">
            <label class="to-text-sm to-font-medium" style="display: block; margin-bottom: 0.5rem;">
              Model
            </label>
            <select class="to-select to-w-full" data-action="change-model">
              ${this.generateModelOptions(currentService, currentModel)}
            </select>
          </div>
        </div>
        
        <div style="margin-top: 0.75rem; font-size: 0.75rem; color: var(--to-text-muted);">
          Current: ${modelInfo.name} • Input: ${Tokenizer.formatCost(modelInfo.inputCost)}/1M • Output: ${Tokenizer.formatCost(modelInfo.outputCost)}/1M
        </div>
      </div>
    `;
  }

  generateModelOptions(serviceId, currentModel) {
    const service = ModelDetection.LLM_PROVIDERS[serviceId];
    if (!service) return '';
    
    return service.models.map(model => `
      <option value="${model.id}" ${model.id === currentModel ? 'selected' : ''}>
        ${model.name}
      </option>
    `).join('');
  }

  generatePromptComparison(original, optimized, changes) {
    const diff = PromptOptimizer.generateDiff(original, optimized);
    
    return `
      <div class="to-prompt-comparison">
        <div class="to-prompt-section">
          <div class="to-prompt-label">
            <span>📝 Optimized Prompt</span>
            ${changes.length > 0 ? `<span class="to-text-xs to-text-muted">(${changes.length} changes)</span>` : ''}
          </div>
          <div class="to-prompt-content to-diff-content">
            ${this.renderDiff(diff)}
          </div>
        </div>
        
        ${changes.length > 0 ? `
          <div class="to-changes-summary">
            <div class="to-text-sm to-font-medium">Optimization Changes:</div>
            <ul class="to-changes-list">
              ${changes.map(change => `
                <li>${change.description}${change.count > 1 ? ` (${change.count}x)` : ''}</li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderDiff(diff) {
    return diff.map(part => {
      switch (part.type) {
        case 'added':
          return `<span class="to-diff-added">${this.escapeHtml(part.text)}</span>`;
        case 'removed':
          return `<span class="to-diff-removed">${this.escapeHtml(part.text)}</span>`;
        default:
          return this.escapeHtml(part.text);
      }
    }).join('');
  }

  generateProFeatures(data) {
    return `
      <div class="to-pro-features">
        <div class="to-prompt-label">
          <span class="to-pro-badge">✨ PRO</span>
          <span>Advanced Features</span>
        </div>
        
        <div class="to-feature-row">
          <label class="to-checkbox">
            <input type="checkbox" data-action="toggle-paraphrase">
            <span>Context-aware paraphrasing</span>
          </label>
        </div>
        
        <div class="to-feature-row">
          <select class="to-select" data-action="select-template">
            <option value="">Apply template...</option>
            <option value="email">Email Writing</option>
            <option value="code">Code Review</option>
            <option value="analysis">Data Analysis</option>
            <option value="creative">Creative Writing</option>
          </select>
        </div>
        
        <div class="to-feature-row">
          <select class="to-select" data-action="adjust-tone">
            <option value="">Adjust tone...</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="technical">Technical</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>
      </div>
    `;
  }

  generateProUpgrade() {
    return `
      <div class="to-pro-features">
        <div class="to-prompt-label">
          <span>🔒 Pro Features</span>
        </div>
        <p class="to-text-sm to-text-muted" style="margin-bottom: 1rem;">
          Unlock advanced paraphrasing, templates, tone control, and sensitive data detection.
        </p>
        <button class="to-btn to-btn-primary" data-action="upgrade">
          Upgrade to Pro
        </button>
      </div>
    `;
  }

  generateAutoOptimizeToggle() {
    return `
      <div class="to-auto-optimize">
        <label class="to-checkbox">
          <input type="checkbox" data-action="toggle-auto-optimize">
          <span class="to-text-sm">Always optimize automatically</span>
        </label>
      </div>
    `;
  }

  generateActionButtons() {
    return `
      <div class="to-action-buttons">
        <button class="to-btn to-btn-secondary" data-action="send-original">
          Send Original
        </button>
        <button class="to-btn to-btn-success" data-action="send-optimized">
          Send Optimized
        </button>
      </div>
    `;
  }

  positionOverlay() {
    if (!this.overlay) return;
    
    const inputElements = this.findInputElements();
    if (inputElements.length === 0) {
      this.overlay.style.top = '50%';
      this.overlay.style.left = '50%';
      this.overlay.style.transform = 'translate(-50%, -50%)';
      return;
    }
    
    const inputRect = inputElements[0].getBoundingClientRect();
    const overlayRect = this.overlay.getBoundingClientRect();
    
    let top = inputRect.bottom + window.scrollY + 10;
    let left = inputRect.left + window.scrollX;
    
    if (left + overlayRect.width > window.innerWidth) {
      left = window.innerWidth - overlayRect.width - 20;
    }
    
    if (top + overlayRect.height > window.innerHeight + window.scrollY) {
      top = inputRect.top + window.scrollY - overlayRect.height - 10;
    }
    
    this.overlay.style.top = `${Math.max(10, top)}px`;
    this.overlay.style.left = `${Math.max(10, left)}px`;
  }

  findInputElements() {
    const selectors = [
      'textarea[placeholder*="message" i]',
      'textarea[placeholder*="prompt" i]',
      'div[contenteditable="true"]',
      'textarea[data-testid*="chat" i]',
      'textarea[class*="chat" i]',
      'textarea[class*="input" i]',
      'div[class*="chat" i][contenteditable="true"]'
    ];
    
    const elements = [];
    selectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      elements.push(...Array.from(found));
    });
    
    return elements.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 100 && rect.height > 30;
    });
  }

  attachEventListeners() {
    if (!this.overlay) return;
    
    this.overlay.addEventListener('click', (e) => {
      const action = e.target.getAttribute('data-action');
      if (action) {
        this.handleAction(action, e.target, e);
      }
    });
    
    this.overlay.addEventListener('change', (e) => {
      const action = e.target.getAttribute('data-action');
      if (action) {
        this.handleAction(action, e.target, e);
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  async handleAction(action, element, event) {
    switch (action) {
      case 'close':
        this.hide();
        break;
        
      case 'send-original':
        await this.sendPrompt(this.currentData.original);
        this.hide();
        break;
        
      case 'send-optimized':
        await this.sendPrompt(this.currentData.optimized);
        this.updateAnalytics();
        this.hide();
        break;
        
      case 'change-provider':
        await this.handleProviderChange(element.value);
        break;
        
      case 'change-model':
        await this.handleModelChange(element.value);
        break;
        
      case 'toggle-auto-optimize':
        await this.toggleAutoOptimize(element.checked);
        break;
        
      case 'upgrade':
        this.handleUpgrade();
        break;
        
      default:
        console.log('Unhandled action:', action);
    }
  }

  async sendPrompt(text) {
    const inputElements = this.findInputElements();
    if (inputElements.length === 0) {
      console.warn('No input elements found');
      return;
    }
    
    const input = inputElements[0];
    
    if (input.tagName === 'TEXTAREA') {
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      input.textContent = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    const submitButton = this.findSubmitButton();
    if (submitButton) {
      setTimeout(() => {
        submitButton.click();
      }, 100);
    }
  }

  findSubmitButton() {
    const selectors = [
      'button[type="submit"]',
      'button[data-testid*="send" i]',
      'button[aria-label*="send" i]',
      'button:has(svg)',
      'button[class*="send" i]'
    ];
    
    for (const selector of selectors) {
      const buttons = document.querySelectorAll(selector);
      for (const button of buttons) {
        if (button.offsetParent !== null && !button.disabled) {
          return button;
        }
      }
    }
    
    return null;
  }

  async handleProviderChange(providerId) {
    const provider = ModelDetection.LLM_PROVIDERS[providerId];
    if (!provider) return;
    
    await ExtensionStorage.updateSettings({
      selectedModel: provider.defaultModel,
      selectedProvider: providerId
    });
    
    const modelSelect = this.overlay.querySelector('[data-action="change-model"]');
    if (modelSelect) {
      modelSelect.innerHTML = this.generateModelOptions(providerId, provider.defaultModel);
    }
    
    this.recalculateTokens();
  }

  async handleModelChange(modelId) {
    await ExtensionStorage.updateSettings({
      selectedModel: modelId
    });
    
    this.recalculateTokens();
  }

  async recalculateTokens() {
    const settings = await ExtensionStorage.getSettings();
    const serviceId = settings.selectedProvider || this.currentData.currentService;
    const modelId = settings.selectedModel || this.currentData.currentModel;
    const modelInfo = ModelDetection.getModelInfo(serviceId, modelId);
    
    if (!modelInfo) return;
    
    const tokenizerType = Tokenizer.getTokenizerForService(serviceId);
    const originalTokens = Tokenizer.estimateTokens(this.currentData.original, tokenizerType);
    const optimizedTokens = Tokenizer.estimateTokens(this.currentData.optimized, tokenizerType);
    
    const originalCost = Tokenizer.calculateCost(originalTokens, modelInfo.inputCost, modelInfo.outputCost);
    const optimizedCost = Tokenizer.calculateCost(optimizedTokens, modelInfo.inputCost, modelInfo.outputCost);
    
    this.currentData = {
      ...this.currentData,
      originalTokens,
      optimizedTokens,
      originalCost,
      optimizedCost,
      modelInfo,
      currentService: serviceId,
      currentModel: modelId
    };
    
    this.updateStatsDisplay();
  }

  updateStatsDisplay() {
    const statsGrid = this.overlay.querySelector('.to-stats-grid');
    if (statsGrid) {
      const { originalTokens, optimizedTokens, originalCost, optimizedCost } = this.currentData;
      const tokenSavings = originalTokens - optimizedTokens;
      const costSavings = originalCost - optimizedCost;
      const savingsPercent = Math.round((tokenSavings / originalTokens) * 100);
      
      statsGrid.outerHTML = this.generateStatsSection(originalTokens, optimizedTokens, originalCost, optimizedCost, savingsPercent);
    }
  }

  async toggleAutoOptimize(enabled) {
    await ExtensionStorage.updateSettings({
      autoOptimize: enabled
    });
  }

  handleUpgrade() {
    window.open('https://tokenoptimizer.com/upgrade', '_blank');
  }

  async updateAnalytics() {
    const settings = await ExtensionStorage.getSettings();
    const tokensSaved = this.currentData.originalTokens - this.currentData.optimizedTokens;
    
    await ExtensionStorage.updateSettings({
      analytics: {
        ...settings.analytics,
        totalTokensSaved: settings.analytics.totalTokensSaved + tokensSaved,
        optimizationsCount: settings.analytics.optimizationsCount + 1
      }
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}