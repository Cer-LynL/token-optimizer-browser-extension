class TokenOptimizerBackground {
  constructor() {
    this.licenseValidator = null;
    this.init();
  }

  init() {
    // Initialize license validator
    this.licenseValidator = new LicenseValidator();
    
    chrome.runtime.onInstalled.addListener(this.handleInstall.bind(this));
    chrome.runtime.onStartup.addListener(this.handleStartup.bind(this));
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    this.schedulePeriodicTasks();
  }

  handleInstall(details) {
    if (details.reason === 'install') {
      this.initializeExtension();
    } else if (details.reason === 'update') {
      this.handleUpdate(details.previousVersion);
    }
  }

  async initializeExtension() {
    const defaultSettings = {
      licenseKey: null,
      isPro: false,
      autoOptimize: false,
      selectedModel: null,
      selectedProvider: null,
      tokenBudget: 0,
      usedTokens: 0,
      customKeywords: [],
      analytics: {
        totalTokensSaved: 0,
        optimizationsCount: 0,
        lastReset: Date.now()
      },
      notifications: {
        budgetWarnings: true,
        optimizationTips: true
      }
    };

    await chrome.storage.sync.set({ settings: defaultSettings });
    
    chrome.tabs.create({
      url: chrome.runtime.getURL('options/options.html')
    });
  }

  async handleUpdate(previousVersion) {
    const result = await chrome.storage.sync.get(['settings']);
    const settings = result.settings || {};
    
    const updatedSettings = {
      ...settings,
      analytics: {
        totalTokensSaved: 0,
        optimizationsCount: 0,
        lastReset: Date.now(),
        ...settings.analytics
      },
      notifications: {
        budgetWarnings: true,
        optimizationTips: true,
        ...settings.notifications
      }
    };

    await chrome.storage.sync.set({ settings: updatedSettings });
  }

  handleStartup() {
    this.validateLicenseOnStartup();
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'validateLicense':
          const isValid = await this.licenseValidator.validateLicense(request.licenseKey);
          sendResponse({ success: true, isValid });
          break;

        case 'getSettings':
          const result = await chrome.storage.sync.get(['settings']);
          sendResponse({ success: true, settings: result.settings });
          break;

        case 'updateSettings':
          await chrome.storage.sync.set({ settings: request.settings });
          sendResponse({ success: true });
          break;

        case 'showNotification':
          this.showNotification(request.title, request.message, request.type);
          sendResponse({ success: true });
          break;

        case 'openUpgrade':
          chrome.tabs.create({ url: 'https://tokenoptimizer.com/upgrade' });
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({ success: false, error: error.message });
    }

    return true;
  }

  async validateLicenseOnStartup() {
    const result = await chrome.storage.sync.get(['settings']);
    const settings = result.settings;
    
    if (settings?.licenseKey) {
      const isValid = await this.licenseValidator.validateLicense(settings.licenseKey);
      
      if (settings.isPro !== isValid) {
        const updatedSettings = { ...settings, isPro: isValid };
        await chrome.storage.sync.set({ settings: updatedSettings });
        
        if (!isValid) {
          this.showNotification(
            'Token Optimizer',
            'Your Pro subscription has expired. Some features have been disabled.',
            'basic'
          );
        }
      }
    }
  }

  schedulePeriodicTasks() {
    setInterval(() => {
      this.validateLicenseOnStartup();
      this.checkTokenBudget();
    }, 60 * 60 * 1000);
  }

  async checkTokenBudget() {
    const result = await chrome.storage.sync.get(['settings']);
    const settings = result.settings;
    
    if (!settings?.tokenBudget || !settings.notifications?.budgetWarnings) return;
    
    const currentMonth = new Date().getMonth();
    const lastResetMonth = settings.analytics?.lastReset ? 
      new Date(settings.analytics.lastReset).getMonth() : currentMonth;
    
    let usedTokens = settings.usedTokens || 0;
    
    if (currentMonth !== lastResetMonth) {
      usedTokens = 0;
      const updatedSettings = {
        ...settings,
        usedTokens: 0,
        analytics: {
          ...settings.analytics,
          lastReset: Date.now()
        }
      };
      await chrome.storage.sync.set({ settings: updatedSettings });
    }
    
    const percentUsed = (usedTokens / settings.tokenBudget) * 100;
    
    if (percentUsed >= 90 && percentUsed < 100) {
      this.showNotification(
        'Token Budget Warning',
        `You've used ${Math.round(percentUsed)}% of your monthly token budget.`,
        'basic'
      );
    } else if (percentUsed >= 100) {
      this.showNotification(
        'Token Budget Exceeded',
        'You have exceeded your monthly token budget. Consider upgrading or adjusting your usage.',
        'basic'
      );
    }
  }

  showNotification(title, message, type = 'basic') {
    const options = {
      type: type,
      iconUrl: chrome.runtime.getURL('assets/icons/icon48.png'),
      title: title,
      message: message
    };

    if (type === 'basic') {
      chrome.notifications.create('token-optimizer-' + Date.now(), options);
    }
  }
}

class LicenseValidator {
  constructor() {
    this.apiEndpoint = 'https://api.tokenoptimizer.com';
    this.cache = new Map();
    this.cacheTimeout = 60 * 60 * 1000;
  }

  async validateLicense(licenseKey) {
    if (!licenseKey || licenseKey.trim() === '') {
      return false;
    }

    const cacheKey = `license_${licenseKey}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.isValid;
    }

    try {
      const isValid = await this.validateWithServer(licenseKey);
      
      this.cache.set(cacheKey, {
        isValid,
        timestamp: Date.now()
      });
      
      return isValid;
    } catch (error) {
      console.error('License validation error:', error);
      
      if (cached) {
        return cached.isValid;
      }
      
      return false;
    }
  }

  async validateWithServer(licenseKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${this.apiEndpoint}/validate-license`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          licenseKey: licenseKey,
          source: 'extension',
          version: chrome.runtime.getManifest().version
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          return false;
        }
        throw new Error(`Validation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.valid === true && data.status === 'active';

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('License validation timeout');
      }
      
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

new TokenOptimizerBackground();