class TokenOptimizerPopup {
  constructor() {
    this.settings = {};
    this.currentTab = null;
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.getCurrentTab();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadSettings() {
    this.settings = await ExtensionStorage.getSettings();
  }

  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tab;
    } catch (error) {
      console.warn('Unable to get current tab:', error);
    }
  }

  setupEventListeners() {
    document.getElementById('autoOptimizeToggle').addEventListener('change', (e) => {
      this.updateSetting('autoOptimize', e.target.checked);
    });

    document.getElementById('sensitiveDataToggle')?.addEventListener('change', (e) => {
      this.updateSetting('sensitiveDataDetection', e.target.checked);
    });

    document.getElementById('upgradeBtn').addEventListener('click', () => {
      this.handleUpgrade();
    });

    document.getElementById('settingsBtn').addEventListener('click', () => {
      this.openSettings();
    });

    document.getElementById('helpBtn').addEventListener('click', () => {
      this.openHelp();
    });
  }

  updateUI() {
    this.updateStatusIndicator();
    this.updateStats();
    this.updateBudgetSection();
    this.updateSiteInfo();
    this.updateLicenseSection();
    this.updateSettingsToggles();
  }

  updateStatusIndicator() {
    const indicator = document.getElementById('statusIndicator');
    const statusDot = indicator.querySelector('.status-dot');
    const statusText = indicator.querySelector('.status-text');

    if (this.settings.isPro) {
      statusDot.classList.add('pro');
      statusText.textContent = 'Pro';
    } else {
      statusDot.classList.remove('pro');
      statusText.textContent = 'Free';
    }
  }

  updateStats() {
    const tokensSaved = document.getElementById('tokensSaved');
    const optimizationsCount = document.getElementById('optimizationsCount');

    tokensSaved.textContent = (this.settings.analytics?.totalTokensSaved || 0).toLocaleString();
    optimizationsCount.textContent = (this.settings.analytics?.optimizationsCount || 0).toLocaleString();
  }

  updateBudgetSection() {
    const budgetSection = document.getElementById('budgetSection');
    
    if (!this.settings.isPro || !this.settings.tokenBudget) {
      budgetSection.style.display = 'none';
      return;
    }

    budgetSection.style.display = 'block';

    const usedTokens = this.settings.usedTokens || 0;
    const totalBudget = this.settings.tokenBudget;
    const percentUsed = Math.min(100, (usedTokens / totalBudget) * 100);

    const budgetProgress = document.getElementById('budgetProgress');
    const budgetUsed = document.getElementById('budgetUsed');
    const budgetTotal = document.getElementById('budgetTotal');
    const budgetPercentage = document.getElementById('budgetPercentage');

    budgetProgress.style.width = `${percentUsed}%`;
    budgetProgress.className = 'budget-progress';
    
    if (percentUsed >= 90) {
      budgetProgress.classList.add('danger');
    } else if (percentUsed >= 75) {
      budgetProgress.classList.add('warning');
    }

    budgetUsed.textContent = usedTokens.toLocaleString();
    budgetTotal.textContent = totalBudget.toLocaleString();
    budgetPercentage.textContent = `${Math.round(percentUsed)}%`;
  }

  updateSiteInfo() {
    const siteInfo = document.getElementById('siteInfo');
    const siteStatus = siteInfo.querySelector('.site-status');
    
    if (!this.currentTab) {
      siteStatus.textContent = 'Unable to detect current site';
      return;
    }

    const hostname = new URL(this.currentTab.url).hostname;
    const service = ModelDetection.LLM_PROVIDERS[hostname];

    if (service) {
      siteStatus.textContent = `${service.name} detected`;
      siteStatus.className = 'site-status supported';
      
      let siteDetails = siteInfo.querySelector('.site-details');
      if (!siteDetails) {
        siteDetails = document.createElement('div');
        siteDetails.className = 'site-details';
        siteInfo.appendChild(siteDetails);
      }
      
      siteDetails.innerHTML = `
        <div>✅ Token optimization available</div>
        <div>Models: ${service.models.length} supported</div>
      `;
    } else {
      siteStatus.textContent = 'Not on supported LLM site';
      siteStatus.className = 'site-status';
      
      const siteDetails = siteInfo.querySelector('.site-details');
      if (siteDetails) {
        siteDetails.remove();
      }
    }
  }

  updateLicenseSection() {
    const licenseFree = document.getElementById('licenseFree');
    const licensePro = document.getElementById('licensePro');
    const proSettingsContainer = document.getElementById('proSettingsContainer');

    if (this.settings.isPro) {
      licenseFree.style.display = 'none';
      licensePro.style.display = 'block';
      proSettingsContainer.style.display = 'block';

      const licenseKeyDisplay = document.getElementById('licenseKeyDisplay');
      const licenseExpiry = document.getElementById('licenseExpiry');

      if (this.settings.licenseKey) {
        const maskedKey = '••••••••' + this.settings.licenseKey.slice(-4);
        licenseKeyDisplay.textContent = `License: ${maskedKey}`;
      }

      if (this.settings.licenseExpiry) {
        const expiryDate = new Date(this.settings.licenseExpiry);
        licenseExpiry.textContent = `Expires: ${expiryDate.toLocaleDateString()}`;
      } else {
        licenseExpiry.textContent = 'Active subscription';
      }
    } else {
      licenseFree.style.display = 'block';
      licensePro.style.display = 'none';
      proSettingsContainer.style.display = 'none';
    }
  }

  updateSettingsToggles() {
    const autoOptimizeToggle = document.getElementById('autoOptimizeToggle');
    const sensitiveDataToggle = document.getElementById('sensitiveDataToggle');

    autoOptimizeToggle.checked = this.settings.autoOptimize || false;
    
    if (sensitiveDataToggle && this.settings.isPro) {
      sensitiveDataToggle.checked = this.settings.sensitiveDataDetection || false;
    }
  }

  async updateSetting(key, value) {
    try {
      await ExtensionStorage.updateSettings({ [key]: value });
      this.settings[key] = value;
      
      this.showToast(`${key} ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating setting:', error);
      this.showToast('Error updating setting', 'error');
    }
  }

  handleUpgrade() {
    chrome.tabs.create({ url: 'https://tokenoptimizer.com/upgrade' });
    window.close();
  }

  openSettings() {
    chrome.runtime.openOptionsPage();
    window.close();
  }

  openHelp() {
    chrome.tabs.create({ url: 'https://tokenoptimizer.com/help' });
    window.close();
  }

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
      position: fixed;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? 'var(--to-success)' : 'var(--to-danger)'};
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, 3000);
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(amount);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TokenOptimizerPopup();
});