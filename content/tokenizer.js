class Tokenizer {
  static estimateTokens(text, tokenizerType = 'gpt') {
    if (!text || text.trim() === '') return 0;
    
    switch (tokenizerType) {
      case 'gpt':
        return this.estimateGPTTokens(text);
      case 'claude':
        return this.estimateClaudeTokens(text);
      case 'gemini':
        return this.estimateGeminiTokens(text);
      case 'llama':
        return this.estimateLlamaTokens(text);
      case 'deepseek':
        return this.estimateDeepSeekTokens(text);
      case 'grok':
        return this.estimateGrokTokens(text);
      case 'mistral':
        return this.estimateMistralTokens(text);
      default:
        return this.estimateGPTTokens(text);
    }
  }

  static estimateGPTTokens(text) {
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    
    let tokens = Math.ceil(words * 1.3);
    
    tokens += Math.ceil(characters / 4) * 0.1;
    
    const specialTokens = (text.match(/[{}[\]().,!?;:"'`~@#$%^&*+=<>\/\\|_-]/g) || []).length;
    tokens += specialTokens * 0.5;
    
    const unicodeChars = (text.match(/[^\x00-\x7F]/g) || []).length;
    tokens += unicodeChars * 0.3;
    
    return Math.max(1, Math.round(tokens));
  }

  static estimateClaudeTokens(text) {
    const baseTokens = Math.ceil(text.length / 3.5);
    
    const words = text.trim().split(/\s+/).length;
    const wordBonus = Math.ceil(words * 0.2);
    
    return Math.max(1, baseTokens + wordBonus);
  }

  static estimateGeminiTokens(text) {
    const characters = text.length;
    const words = text.trim().split(/\s+/).length;
    
    const tokens = Math.ceil((characters / 4) + (words * 0.3));
    
    return Math.max(1, tokens);
  }

  static estimateLlamaTokens(text) {
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    
    const tokens = Math.ceil(words * 1.2 + characters / 4.5);
    
    return Math.max(1, tokens);
  }

  static estimateDeepSeekTokens(text) {
    return this.estimateGPTTokens(text);
  }

  static estimateGrokTokens(text) {
    return this.estimateGPTTokens(text);
  }

  static estimateMistralTokens(text) {
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    
    const tokens = Math.ceil(words * 1.1 + characters / 4.2);
    
    return Math.max(1, tokens);
  }

  static calculateCost(tokens, inputCostPer1M, outputCostPer1M = null) {
    const inputCost = (tokens / 1000000) * inputCostPer1M;
    
    if (outputCostPer1M) {
      const avgOutputTokens = tokens * 0.3;
      const outputCost = (avgOutputTokens / 1000000) * outputCostPer1M;
      return inputCost + outputCost;
    }
    
    return inputCost;
  }

  static formatCost(cost) {
    if (cost < 0.001) {
      return `$${(cost * 1000).toFixed(3)}‰`;
    }
    if (cost < 0.01) {
      return `$${(cost * 100).toFixed(2)}¢`;
    }
    return `$${cost.toFixed(4)}`;
  }

  static getTokenizerForService(serviceId) {
    const service = ModelDetection.LLM_PROVIDERS[serviceId];
    return service ? service.tokenizer : 'gpt';
  }
}