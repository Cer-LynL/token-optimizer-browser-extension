class TokenOptimizerOptions {
  constructor() {
    this.settings = {};
    this.licenseValidator = new LicenseValidator();
    this.analytics = new Analytics();
    this.sensitiveDataDetector = new SensitiveDataDetector();
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.setupNavigation();
    this.populateUI();
    this.updateProVisibility();
  }

  async loadSettings() {
    this.settings = await ExtensionStorage.getSettings();
  }

  setupEventListeners() {
    // General settings
    document.getElementById('autoOptimize').addEventListener('change', (e) => {
      this.updateSetting('autoOptimize', e.target.checked);
    });

    document.getElementById('showCosts').addEventListener('change', (e) => {
      this.updateSetting('showCosts', e.target.checked);
    });

    document.getElementById('showNotifications').addEventListener('change', (e) => {
      this.updateSetting('showNotifications', e.target.checked);
    });

    document.getElementById('defaultProvider').addEventListener('change', (e) => {
      this.updateSetting('selectedProvider', e.target.value);
      this.updateModelOptions();
    });

    document.getElementById('defaultModel').addEventListener('change', (e) => {
      this.updateSetting('selectedModel', e.target.value);
    });

    // License management
    document.getElementById('upgradeToProBtn').addEventListener('click', () => {
      this.openUpgradePage();
    });

    document.getElementById('validateLicenseBtn').addEventListener('click', () => {
      this.validateLicense();
    });

    document.getElementById('showLicenseKey').addEventListener('click', () => {
      this.toggleLicenseKeyVisibility();
    });

    document.getElementById('refreshLicense').addEventListener('click', () => {
      this.refreshLicenseStatus();
    });

    document.getElementById('removeLicense').addEventListener('click', () => {
      this.removeLicense();
    });

    document.getElementById('customerPortalLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://tokenoptimizer.com/portal' });
    });

    // Optimization settings
    document.getElementById('removeFiller').addEventListener('change', (e) => {
      this.updateSetting('optimizationRules.removeFiller', e.target.checked);
    });

    document.getElementById('useAbbreviations').addEventListener('change', (e) => {
      this.updateSetting('optimizationRules.useAbbreviations', e.target.checked);
    });

    document.getElementById('trimContext').addEventListener('change', (e) => {
      this.updateSetting('optimizationRules.trimContext', e.target.checked);
    });

    document.getElementById('semanticChunking').addEventListener('change', (e) => {
      this.updateSetting('optimizationRules.semanticChunking', e.target.checked);
    });

    document.getElementById('tokenBudget').addEventListener('change', (e) => {
      const budget = parseInt(e.target.value) || 0;
      this.updateSetting('tokenBudget', budget);
      this.updateBudgetDisplay();
    });

    // Privacy settings
    document.getElementById('enableSensitiveDetection').addEventListener('change', (e) => {
      this.updateSetting('sensitiveDataDetection', e.target.checked);
    });

    document.getElementById('blockSensitiveSubmission').addEventListener('change', (e) => {
      this.updateSetting('blockSensitiveSubmission', e.target.checked);
    });

    document.getElementById('addKeywordBtn').addEventListener('click', () => {
      this.addCustomKeyword();
    });

    document.getElementById('customKeywordInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addCustomKeyword();
      }
    });

    document.getElementById('localProcessingOnly').addEventListener('change', (e) => {
      this.updateSetting('localProcessingOnly', e.target.checked);
    });

    // Analytics settings
    document.getElementById('enableAnalytics').addEventListener('change', (e) => {
      this.updateSetting('enableAnalytics', e.target.checked);
    });

    document.getElementById('showOptimizationTips').addEventListener('change', (e) => {
      this.updateSetting('showOptimizationTips', e.target.checked);
    });

    document.getElementById('exportAnalyticsBtn').addEventListener('click', () => {
      this.exportAnalytics();
    });

    document.getElementById('resetAnalyticsBtn').addEventListener('click', () => {
      this.resetAnalytics();
    });

    // Advanced settings
    document.getElementById('enableDebugMode').addEventListener('change', (e) => {
      this.updateSetting('debugMode', e.target.checked);
    });

    document.getElementById('betaFeatures').addEventListener('change', (e) => {
      this.updateSetting('betaFeatures', e.target.checked);
    });

    document.getElementById('exportSettingsBtn').addEventListener('click', () => {
      this.exportSettings();
    });

    document.getElementById('importSettingsBtn').addEventListener('click', () => {
      document.getElementById('importSettingsFile').click();
    });

    document.getElementById('importSettingsFile').addEventListener('change', (e) => {
      this.importSettings(e.target.files[0]);
    });

    document.getElementById('resetAllSettingsBtn').addEventListener('click', () => {
      this.resetAllSettings();
    });
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.settings-section');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetSection = item.dataset.section;

        // Update nav states
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Update section visibility
        sections.forEach(section => {
          section.classList.remove('active');
          if (section.dataset.section === targetSection) {
            section.classList.add('active');
          }
        });

        // Load section-specific data
        this.loadSectionData(targetSection);
      });
    });
  }

  async loadSectionData(section) {
    switch (section) {
      case 'analytics':
        if (this.settings.isPro) {
          await this.loadAnalyticsData();
        }
        break;
      case 'privacy':
        if (this.settings.isPro) {
          await this.loadCustomKeywords();
        }
        break;
    }
  }

  async populateUI() {
    // General settings
    document.getElementById('autoOptimize').checked = this.settings.autoOptimize || false;
    document.getElementById('showCosts').checked = this.settings.showCosts !== false;
    document.getElementById('showNotifications').checked = this.settings.showNotifications !== false;

    // Populate provider options
    this.populateProviderOptions();
    this.updateModelOptions();

    // License section
    this.updateLicenseSection();

    // Optimization settings
    const rules = this.settings.optimizationRules || {};
    document.getElementById('removeFiller').checked = rules.removeFiller !== false;
    document.getElementById('useAbbreviations').checked = rules.useAbbreviations !== false;
    document.getElementById('trimContext').checked = rules.trimContext !== false;
    document.getElementById('semanticChunking').checked = rules.semanticChunking !== false;

    document.getElementById('tokenBudget').value = this.settings.tokenBudget || 0;
    this.updateBudgetDisplay();

    // Privacy settings
    document.getElementById('enableSensitiveDetection').checked = this.settings.sensitiveDataDetection || false;
    document.getElementById('blockSensitiveSubmission').checked = this.settings.blockSensitiveSubmission || false;
    document.getElementById('localProcessingOnly').checked = this.settings.localProcessingOnly || false;

    // Analytics settings
    document.getElementById('enableAnalytics').checked = this.settings.enableAnalytics !== false;
    document.getElementById('showOptimizationTips').checked = this.settings.showOptimizationTips !== false;

    // Advanced settings
    document.getElementById('enableDebugMode').checked = this.settings.debugMode || false;
    document.getElementById('betaFeatures').checked = this.settings.betaFeatures || false;

    // Version info
    if (chrome.runtime?.getManifest) {
      document.getElementById('extensionVersion').textContent = chrome.runtime.getManifest().version;
    }
  }

  populateProviderOptions() {
    const providerSelect = document.getElementById('defaultProvider');
    const providers = ModelDetection.getAllProviders();

    providerSelect.innerHTML = '<option value="">Auto-detect</option>';

    providers.forEach(provider => {
      const option = document.createElement('option');
      option.value = provider.id;
      option.textContent = provider.name;
      if (this.settings.selectedProvider === provider.id) {
        option.selected = true;
      }
      providerSelect.appendChild(option);
    });
  }

  updateModelOptions() {
    const modelSelect = document.getElementById('defaultModel');
    const providerId = document.getElementById('defaultProvider').value;

    modelSelect.innerHTML = '<option value="">Auto-detect</option>';

    if (providerId) {
      const provider = ModelDetection.LLM_PROVIDERS[providerId];
      if (provider) {
        provider.models.forEach(model => {
          const option = document.createElement('option');
          option.value = model.id;
          option.textContent = model.name;
          if (this.settings.selectedModel === model.id) {
            option.selected = true;
          }
          modelSelect.appendChild(option);
        });
      }
    }
  }

  updateProVisibility() {
    const isPro = this.settings.isPro;
    
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = isPro ? 'PRO' : 'Free';
    statusBadge.className = `status-badge ${isPro ? 'pro' : 'free'}`;

    // Show/hide pro sections in nav
    const proNavItems = ['navPrivacy', 'navAnalytics'];
    proNavItems.forEach(navId => {
      const navItem = document.getElementById(navId);
      if (navItem) {
        navItem.style.display = isPro ? 'flex' : 'none';
      }
    });

    // Update pro indicators
    const proIndicators = document.querySelectorAll('.pro-indicator');
    proIndicators.forEach(indicator => {
      indicator.style.display = isPro ? 'none' : 'inline';
    });
  }

  updateLicenseSection() {
    const isPro = this.settings.isPro;
    const freeSection = document.getElementById('licenseFreeSection');
    const proSection = document.getElementById('licenseProSection');

    if (isPro) {
      freeSection.style.display = 'none';
      proSection.style.display = 'block';
      
      // Update license details
      const licenseKeyDisplay = document.getElementById('licenseKeyDisplay');
      if (this.settings.licenseKey) {
        const maskedKey = '••••••••' + this.settings.licenseKey.slice(-4);
        licenseKeyDisplay.textContent = maskedKey;
      }
      
      const licenseExpiry = document.getElementById('licenseExpiry');
      if (this.settings.licenseExpiry) {
        const expiryDate = new Date(this.settings.licenseExpiry);
        licenseExpiry.textContent = expiryDate.toLocaleDateString();
      } else {
        licenseExpiry.textContent = 'Active';
      }
    } else {
      freeSection.style.display = 'block';
      proSection.style.display = 'none';
    }
  }

  updateBudgetDisplay() {
    const budgetDisplay = document.getElementById('budgetDisplay');
    const budget = this.settings.tokenBudget || 0;

    if (budget > 0) {
      budgetDisplay.style.display = 'block';
      
      const usedTokens = this.settings.usedTokens || 0;
      const percentUsed = Math.min(100, (usedTokens / budget) * 100);

      const progressFill = document.getElementById('budgetProgressFill');
      progressFill.style.width = `${percentUsed}%`;
      progressFill.className = 'budget-progress-fill';
      
      if (percentUsed >= 90) {
        progressFill.classList.add('danger');
      } else if (percentUsed >= 75) {
        progressFill.classList.add('warning');
      }

      document.getElementById('budgetUsed').textContent = usedTokens.toLocaleString();
      document.getElementById('budgetTotal').textContent = budget.toLocaleString();
      document.getElementById('budgetPercent').textContent = `${Math.round(percentUsed)}%`;
    } else {
      budgetDisplay.style.display = 'none';
    }
  }

  async updateSetting(key, value) {
    if (key.includes('.')) {
      // Handle nested settings
      const keys = key.split('.');
      const settings = { ...this.settings };
      let current = settings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      await ExtensionStorage.updateSettings(settings);
      this.settings = settings;
    } else {
      await ExtensionStorage.updateSettings({ [key]: value });
      this.settings[key] = value;
    }

    this.showToast('Settings updated', 'success');
  }

  async validateLicense() {
    const licenseKeyInput = document.getElementById('licenseKeyInput');
    const validateBtn = document.getElementById('validateLicenseBtn');
    const resultDiv = document.getElementById('licenseValidationResult');

    const licenseKey = licenseKeyInput.value.trim();
    
    if (!licenseKey) {
      this.showValidationResult('Please enter a license key', 'error');
      return;
    }

    validateBtn.disabled = true;
    validateBtn.textContent = 'Validating...';

    try {
      const result = await this.licenseValidator.validateLicense(licenseKey);
      
      if (result.isValid) {
        await ExtensionStorage.updateSettings({
          licenseKey,
          isPro: true,
          licenseExpiry: result.expiresAt
        });
        
        await this.loadSettings();
        this.updateProVisibility();
        this.updateLicenseSection();
        
        this.showValidationResult('License key validated successfully!', 'success');
        licenseKeyInput.value = '';
      } else {
        this.showValidationResult(result.error || 'Invalid license key', 'error');
      }
    } catch (error) {
      this.showValidationResult('Failed to validate license: ' + error.message, 'error');
    } finally {
      validateBtn.disabled = false;
      validateBtn.textContent = 'Validate';
    }
  }

  showValidationResult(message, type) {
    const resultDiv = document.getElementById('licenseValidationResult');
    resultDiv.textContent = message;
    resultDiv.className = `license-validation-result ${type}`;
    resultDiv.style.display = 'block';

    setTimeout(() => {
      resultDiv.style.display = 'none';
    }, 5000);
  }

  toggleLicenseKeyVisibility() {
    const licenseKeyDisplay = document.getElementById('licenseKeyDisplay');
    const showBtn = document.getElementById('showLicenseKey');
    
    if (licenseKeyDisplay.textContent.includes('••••')) {
      licenseKeyDisplay.textContent = this.settings.licenseKey || '';
      showBtn.textContent = 'Hide';
    } else {
      const maskedKey = '••••••••' + (this.settings.licenseKey?.slice(-4) || '');
      licenseKeyDisplay.textContent = maskedKey;
      showBtn.textContent = 'Show';
    }
  }

  async refreshLicenseStatus() {
    if (!this.settings.licenseKey) return;

    try {
      const result = await this.licenseValidator.validateLicense(this.settings.licenseKey);
      
      await ExtensionStorage.updateSettings({
        isPro: result.isValid,
        licenseExpiry: result.expiresAt
      });
      
      await this.loadSettings();
      this.updateProVisibility();
      this.updateLicenseSection();
      
      this.showToast('License status refreshed', 'success');
    } catch (error) {
      this.showToast('Failed to refresh license status', 'error');
    }
  }

  async removeLicense() {
    if (!confirm('Are you sure you want to remove your license? This will disable Pro features.')) {
      return;
    }

    await ExtensionStorage.updateSettings({
      licenseKey: null,
      isPro: false,
      licenseExpiry: null
    });
    
    await this.loadSettings();
    this.updateProVisibility();
    this.updateLicenseSection();
    
    this.showToast('License removed', 'success');
  }

  async addCustomKeyword() {
    const input = document.getElementById('customKeywordInput');
    const keyword = input.value.trim();

    if (!keyword) return;

    try {
      await this.sensitiveDataDetector.addCustomKeyword(keyword);
      input.value = '';
      await this.loadCustomKeywords();
      this.showToast('Custom keyword added', 'success');
    } catch (error) {
      this.showToast('Failed to add keyword', 'error');
    }
  }

  async loadCustomKeywords() {
    const keywordsList = document.getElementById('customKeywordsList');
    const keywords = await this.sensitiveDataDetector.getCustomKeywords();

    keywordsList.innerHTML = '';

    keywords.forEach(keyword => {
      const tag = document.createElement('div');
      tag.className = 'keyword-tag';
      tag.innerHTML = `
        <span>${keyword}</span>
        <button class="keyword-remove" data-keyword="${keyword}">×</button>
      `;
      
      tag.querySelector('.keyword-remove').addEventListener('click', () => {
        this.removeCustomKeyword(keyword);
      });
      
      keywordsList.appendChild(tag);
    });
  }

  async removeCustomKeyword(keyword) {
    try {
      await this.sensitiveDataDetector.removeCustomKeyword(keyword);
      await this.loadCustomKeywords();
      this.showToast('Keyword removed', 'success');
    } catch (error) {
      this.showToast('Failed to remove keyword', 'error');
    }
  }

  async loadAnalyticsData() {
    try {
      const summary = await this.analytics.getAnalyticsSummary();
      this.populateAnalyticsOverview(summary);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }
  }

  populateAnalyticsOverview(summary) {
    const overview = document.getElementById('analyticsOverview');
    
    const cards = [
      {
        label: 'Total Optimizations',
        value: summary.totalOptimizations.toLocaleString(),
        change: null
      },
      {
        label: 'Tokens Saved',
        value: summary.totalTokensSaved.toLocaleString(),
        change: null
      },
      {
        label: 'Average Savings',
        value: `${summary.averageOptimizationRate}%`,
        change: null
      },
      {
        label: 'Session Optimizations',
        value: summary.sessionStats.optimizationsThisSession.toString(),
        change: null
      }
    ];

    overview.innerHTML = cards.map(card => `
      <div class="analytics-card">
        <div class="analytics-card-value">${card.value}</div>
        <div class="analytics-card-label">${card.label}</div>
        ${card.change ? `<div class="analytics-card-change ${card.change > 0 ? 'positive' : 'negative'}">${card.change > 0 ? '+' : ''}${card.change}%</div>` : ''}
      </div>
    `).join('');
  }

  async exportAnalytics() {
    try {
      const data = await this.analytics.exportAnalytics();
      this.downloadFile('token-optimizer-analytics.json', data);
      this.showToast('Analytics exported', 'success');
    } catch (error) {
      this.showToast('Failed to export analytics', 'error');
    }
  }

  async resetAnalytics() {
    if (!confirm('Are you sure you want to reset all analytics data? This cannot be undone.')) {
      return;
    }

    try {
      await this.analytics.resetAnalytics();
      await this.loadAnalyticsData();
      this.showToast('Analytics reset', 'success');
    } catch (error) {
      this.showToast('Failed to reset analytics', 'error');
    }
  }

  async exportSettings() {
    try {
      const data = JSON.stringify(this.settings, null, 2);
      this.downloadFile('token-optimizer-settings.json', data);
      this.showToast('Settings exported', 'success');
    } catch (error) {
      this.showToast('Failed to export settings', 'error');
    }
  }

  async importSettings(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const settings = JSON.parse(text);
      
      await ExtensionStorage.updateSettings(settings);
      await this.loadSettings();
      this.populateUI();
      this.updateProVisibility();
      
      this.showToast('Settings imported successfully', 'success');
    } catch (error) {
      this.showToast('Failed to import settings: ' + error.message, 'error');
    }
  }

  async resetAllSettings() {
    if (!confirm('Are you sure you want to reset all settings? This will remove your license key and cannot be undone.')) {
      return;
    }

    try {
      await ExtensionStorage.clear();
      await this.loadSettings();
      this.populateUI();
      this.updateProVisibility();
      
      this.showToast('All settings reset', 'success');
    } catch (error) {
      this.showToast('Failed to reset settings', 'error');
    }
  }

  openUpgradePage() {
    chrome.tabs.create({ url: 'https://tokenoptimizer.com/upgrade' });
  }

  downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: ${type === 'success' ? 'var(--to-success)' : 'var(--to-danger)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
      box-shadow: var(--to-shadow-lg);
    `;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TokenOptimizerOptions();
});