const { describe, test, expect, beforeEach } = require('@jest/globals');

// Import the ExtensionStorage class
// Since it's not exported as a module, we'll need to load it differently
const fs = require('fs');
const path = require('path');

// Load the storage.js file content and evaluate it
const storageCode = fs.readFileSync(path.join(__dirname, '../utils/storage.js'), 'utf8');
eval(storageCode);

describe('ExtensionStorage', () => {
  describe('Chrome Extension Environment', () => {
    beforeEach(() => {
      // Ensure chrome is available for these tests
      global.chrome = {
        storage: {
          sync: {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
            clear: jest.fn()
          }
        }
      };
    });

    test('should get data from chrome storage', async () => {
      const mockData = { testKey: 'testValue' };
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback(mockData);
      });

      const result = await ExtensionStorage.get('testKey');
      
      expect(chrome.storage.sync.get).toHaveBeenCalledWith(['testKey'], expect.any(Function));
      expect(result).toBe('testValue');
    });

    test('should set data in chrome storage', async () => {
      chrome.storage.sync.set.mockImplementation((data, callback) => {
        callback();
      });

      await ExtensionStorage.set('testKey', 'testValue');
      
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        { testKey: 'testValue' }, 
        expect.any(Function)
      );
    });

    test('should remove data from chrome storage', async () => {
      chrome.storage.sync.remove.mockImplementation((keys, callback) => {
        callback();
      });

      await ExtensionStorage.remove('testKey');
      
      expect(chrome.storage.sync.remove).toHaveBeenCalledWith(['testKey'], expect.any(Function));
    });

    test('should clear all data from chrome storage', async () => {
      chrome.storage.sync.clear.mockImplementation((callback) => {
        callback();
      });

      await ExtensionStorage.clear();
      
      expect(chrome.storage.sync.clear).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('LocalStorage Environment', () => {
    beforeEach(() => {
      // Remove chrome to simulate non-extension environment
      delete global.chrome;
    });

    test('should get data from localStorage', async () => {
      const testData = { value: 'test' };
      localStorage.getItem.mockReturnValue(JSON.stringify(testData));

      const result = await ExtensionStorage.get('testKey');
      
      expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
      expect(result).toEqual(testData);
    });

    test('should return null when localStorage item does not exist', async () => {
      localStorage.getItem.mockReturnValue(null);

      const result = await ExtensionStorage.get('nonExistentKey');
      
      expect(localStorage.getItem).toHaveBeenCalledWith('nonExistentKey');
      expect(result).toBeNull();
    });

    test('should set data in localStorage', async () => {
      const testData = { value: 'test' };

      await ExtensionStorage.set('testKey', testData);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(testData));
    });

    test('should remove data from localStorage', async () => {
      await ExtensionStorage.remove('testKey');
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    test('should clear all data from localStorage', async () => {
      await ExtensionStorage.clear();
      
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe('Settings Management', () => {
    beforeEach(() => {
      // Use chrome storage for settings tests
      global.chrome = {
        storage: {
          sync: {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
            clear: jest.fn()
          }
        }
      };
    });

    test('should return default settings when no settings exist', async () => {
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ settings: undefined });
      });

      const settings = await ExtensionStorage.getSettings();
      
      expect(settings).toEqual({
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
          lastReset: expect.any(Number)
        }
      });
    });

    test('should merge existing settings with defaults', async () => {
      const existingSettings = {
        isPro: true,
        selectedModel: 'gpt-4',
        customKeywords: ['test']
      };

      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ settings: existingSettings });
      });

      const settings = await ExtensionStorage.getSettings();
      
      expect(settings.isPro).toBe(true);
      expect(settings.selectedModel).toBe('gpt-4');
      expect(settings.customKeywords).toEqual(['test']);
      expect(settings.licenseKey).toBeNull(); // Default value
      expect(settings.autoOptimize).toBe(false); // Default value
    });

    test('should update settings correctly', async () => {
      const currentSettings = {
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

      const updates = {
        isPro: true,
        selectedModel: 'gpt-4',
        tokenBudget: 1000
      };

      // Mock getSettings call
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback({ settings: currentSettings });
      });

      // Mock set call
      chrome.storage.sync.set.mockImplementation((data, callback) => {
        callback();
      });

      const updatedSettings = await ExtensionStorage.updateSettings(updates);
      
      expect(updatedSettings.isPro).toBe(true);
      expect(updatedSettings.selectedModel).toBe('gpt-4');
      expect(updatedSettings.tokenBudget).toBe(1000);
      expect(updatedSettings.autoOptimize).toBe(false); // Unchanged
      
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        { settings: updatedSettings },
        expect.any(Function)
      );
    });
  });
});
