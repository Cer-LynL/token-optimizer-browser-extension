class ModelDetection {
  static LLM_PROVIDERS = {
    'chat.openai.com': {
      name: 'OpenAI',
      models: [
        { id: 'gpt-4o', name: 'GPT-4o', inputCost: 2.50, outputCost: 10.00 },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', inputCost: 0.15, outputCost: 0.60 },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', inputCost: 10.00, outputCost: 30.00 },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', inputCost: 0.50, outputCost: 1.50 }
      ],
      defaultModel: 'gpt-4o',
      tokenizer: 'gpt'
    },
    'claude.ai': {
      name: 'Anthropic',
      models: [
        { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', inputCost: 3.00, outputCost: 15.00 },
        { id: 'claude-3-opus', name: 'Claude 3 Opus', inputCost: 15.00, outputCost: 75.00 },
        { id: 'claude-3-haiku', name: 'Claude 3 Haiku', inputCost: 0.25, outputCost: 1.25 }
      ],
      defaultModel: 'claude-3-5-sonnet',
      tokenizer: 'claude'
    },
    'gemini.google.com': {
      name: 'Google',
      models: [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', inputCost: 1.25, outputCost: 5.00 },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', inputCost: 0.075, outputCost: 0.30 },
        { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', inputCost: 0.50, outputCost: 1.50 }
      ],
      defaultModel: 'gemini-1.5-pro',
      tokenizer: 'gemini'
    },
    'llama.meta.ai': {
      name: 'Meta',
      models: [
        { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', inputCost: 5.32, outputCost: 16.00 },
        { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', inputCost: 0.99, outputCost: 2.99 },
        { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', inputCost: 0.20, outputCost: 0.20 }
      ],
      defaultModel: 'llama-3.1-70b',
      tokenizer: 'llama'
    },
    'deepseek.com': {
      name: 'DeepSeek',
      models: [
        { id: 'deepseek-v2.5', name: 'DeepSeek V2.5', inputCost: 0.14, outputCost: 0.28 },
        { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', inputCost: 0.14, outputCost: 0.28 }
      ],
      defaultModel: 'deepseek-v2.5',
      tokenizer: 'deepseek'
    },
    'grok.x.ai': {
      name: 'xAI',
      models: [
        { id: 'grok-beta', name: 'Grok Beta', inputCost: 5.00, outputCost: 15.00 }
      ],
      defaultModel: 'grok-beta',
      tokenizer: 'grok'
    },
    'mistral.ai': {
      name: 'Mistral',
      models: [
        { id: 'mistral-large-2', name: 'Mistral Large 2', inputCost: 2.00, outputCost: 6.00 },
        { id: 'mistral-small', name: 'Mistral Small', inputCost: 0.20, outputCost: 0.60 }
      ],
      defaultModel: 'mistral-large-2',
      tokenizer: 'mistral'
    },
    'lovable.io': {
      name: 'Lovable',
      models: [
        { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet (Lovable)', inputCost: 3.00, outputCost: 15.00 }
      ],
      defaultModel: 'claude-3-5-sonnet',
      tokenizer: 'claude'
    }
  };

  static detectService() {
    const hostname = window.location.hostname;
    return this.LLM_PROVIDERS[hostname] || null;
  }

  static detectModel() {
    const service = this.detectService();
    if (!service) return null;

    const hostname = window.location.hostname;
    
    try {
      switch (hostname) {
        case 'chat.openai.com':
          return this.detectOpenAIModel() || service.defaultModel;
        case 'claude.ai':
          return this.detectClaudeModel() || service.defaultModel;
        case 'gemini.google.com':
          return this.detectGeminiModel() || service.defaultModel;
        default:
          return service.defaultModel;
      }
    } catch (error) {
      console.warn('Model detection failed:', error);
      return service.defaultModel;
    }
  }

  static detectOpenAIModel() {
    const modelButton = document.querySelector('[data-testid="model-switcher-dropdown"]');
    if (modelButton) {
      const modelText = modelButton.textContent.toLowerCase();
      if (modelText.includes('gpt-4o-mini')) return 'gpt-4o-mini';
      if (modelText.includes('gpt-4o')) return 'gpt-4o';
      if (modelText.includes('gpt-4-turbo')) return 'gpt-4-turbo';
      if (modelText.includes('gpt-3.5')) return 'gpt-3.5-turbo';
    }
    return null;
  }

  static detectClaudeModel() {
    const modelIndicator = document.querySelector('[data-value*="claude"]');
    if (modelIndicator) {
      const modelText = modelIndicator.textContent.toLowerCase();
      if (modelText.includes('opus')) return 'claude-3-opus';
      if (modelText.includes('sonnet')) return 'claude-3-5-sonnet';
      if (modelText.includes('haiku')) return 'claude-3-haiku';
    }
    return null;
  }

  static detectGeminiModel() {
    const urlParams = new URLSearchParams(window.location.search);
    const model = urlParams.get('model');
    if (model) return model;
    
    const modelText = document.body.textContent.toLowerCase();
    if (modelText.includes('gemini-1.5-pro')) return 'gemini-1.5-pro';
    if (modelText.includes('gemini-1.5-flash')) return 'gemini-1.5-flash';
    if (modelText.includes('gemini-1.0-pro')) return 'gemini-1.0-pro';
    
    return null;
  }

  static getModelInfo(serviceId, modelId) {
    const service = this.LLM_PROVIDERS[serviceId];
    if (!service) return null;
    
    return service.models.find(model => model.id === modelId) || service.models[0];
  }

  static getAllProviders() {
    return Object.entries(this.LLM_PROVIDERS).map(([key, value]) => ({
      id: key,
      ...value
    }));
  }
}