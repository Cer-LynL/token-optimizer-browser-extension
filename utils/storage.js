class ExtensionStorage {
  static async get(key) {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.sync.get([key], (result) => {
          resolve(result[key]);
        });
      });
    }
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
  }

  static async set(key, value) {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ [key]: value }, resolve);
      });
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  static async remove(key) {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.sync.remove([key], resolve);
      });
    }
    localStorage.removeItem(key);
  }

  static async clear() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.sync.clear(resolve);
      });
    }
    localStorage.clear();
  }

  static async getSettings() {
    const defaultSettings = {
      licenseKey: null,
      isPro: false,
      autoOptimize: false,
      selectedModel: null,
      tokenBudget: 0,
      usedTokens: 0,
      customKeywords: [],
      analytics: {
        totalTokensSaved: 0,
        optimizationsCount: 0,
        lastReset: Date.now()
      }
    };

    const settings = await this.get('settings');
    return { ...defaultSettings, ...settings };
  }

  static async updateSettings(updates) {
    const currentSettings = await this.getSettings();
    const newSettings = { ...currentSettings, ...updates };
    await this.set('settings', newSettings);
    return newSettings;
  }
}