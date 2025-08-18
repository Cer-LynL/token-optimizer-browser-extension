class LicenseValidator {
  constructor() {
    this.apiEndpoint = 'https://your-deployed-backend.vercel.app/v1'; // Replace with your actual deployed URL
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000;
    this.requestTimeout = 8000;
  }

  async validateLicense(licenseKey) {
    // TEMPORARY: Skip validation for development
    if (process.env.NODE_ENV === 'development' || !licenseKey) {
      return { isValid: true, status: 'active', plan: 'pro' };
    }
    
    if (!licenseKey || typeof licenseKey !== 'string' || licenseKey.trim() === '') {
      return { isValid: false, error: 'Invalid license key format' };
    }

    const normalizedKey = licenseKey.trim();
    const cacheKey = `license_${normalizedKey}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.result;
    }

    try {
      const result = await this.validateWithServer(normalizedKey);
      
      this.cache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('License validation error:', error);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout * 24) {
        console.warn('Using cached license result due to validation error');
        return cached.result;
      }
      
      return { 
        isValid: false, 
        error: error.message,
        fallbackMode: true
      };
    }
  }

  async validateWithServer(licenseKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

    try {
      const payload = {
        license_key: licenseKey,
        source: 'browser_extension',
        version: this.getExtensionVersion(),
        timestamp: Math.floor(Date.now() / 1000),
        user_agent: navigator.userAgent
      };

      const response = await fetch(`${this.apiEndpoint}/license/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Extension-Version': payload.version,
          'X-Request-Source': 'token-optimizer-extension'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          return { 
            isValid: false, 
            error: 'License key not found or invalid',
            httpStatus: response.status
          };
        }
        
        if (response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        throw new Error(`Validation failed: ${response.status}`);
      }

      const data = await response.json();
      
      return this.parseValidationResponse(data);

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('License validation timeout - please check your connection');
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - unable to validate license');
      }
      
      throw error;
    }
  }

  parseValidationResponse(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    const isValid = data.valid === true || data.status === 'active';
    
    const result = {
      isValid,
      status: data.status,
      expiresAt: data.expires_at ? new Date(data.expires_at) : null,
      plan: data.plan || 'unknown',
      features: data.features || [],
      error: data.error || null
    };

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      result.isValid = false;
      result.error = 'License has expired';
    }

    if (data.status === 'cancelled' || data.status === 'suspended') {
      result.isValid = false;
      result.error = `Subscription is ${data.status}`;
    }

    return result;
  }

  async validateLicenseWithFallback(licenseKey) {
    const result = await this.validateLicense(licenseKey);
    
    if (result.fallbackMode) {
      return {
        ...result,
        message: 'Using offline validation due to connection issues'
      };
    }
    
    return result;
  }

  getExtensionVersion() {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
        return chrome.runtime.getManifest().version;
      }
      return '1.0.0';
    } catch (error) {
      return '1.0.0';
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
      timeout: this.cacheTimeout
    };
  }

  isValidLicenseFormat(licenseKey) {
    if (!licenseKey || typeof licenseKey !== 'string') {
      return false;
    }
    
    const trimmed = licenseKey.trim();
    
    if (trimmed.length < 10 || trimmed.length > 100) {
      return false;
    }
    
    const validPattern = /^[A-Za-z0-9\-_]+$/;
    return validPattern.test(trimmed);
  }

  async testConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.apiEndpoint}/health`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      return {
        success: response.ok,
        status: response.status,
        responseTime: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LicenseValidator;
}