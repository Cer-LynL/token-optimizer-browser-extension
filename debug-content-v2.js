// Advanced Debug Version - Based on LLMLingua and Modern Optimization Research
(function() {
  'use strict';
  
  console.log('🚀 Token Optimizer v2 Debug Version Loading...');
  
  // Test if we're on a supported site or local test file
  const supportedSites = ['chat.openai.com', 'claude.ai', 'gemini.google.com'];
  const currentSite = window.location.hostname;
  const isLocalFile = window.location.protocol === 'file:';
  
  console.log('Current site:', currentSite);
  console.log('Is local file:', isLocalFile);
  console.log('Supported:', supportedSites.includes(currentSite) || isLocalFile);
  
  if (!supportedSites.includes(currentSite) && !isLocalFile) {
    console.log('❌ Not on supported LLM site or local test');
    return;
  }
  
  console.log('✅ On supported site - setting up listeners');
  
  // Advanced prompt interception
  function interceptPrompts() {
    console.log('Setting up advanced prompt interception...');
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        
        if (activeElement && 
            (activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
          
          const text = activeElement.value || activeElement.textContent || activeElement.innerText;
          
          if (text && text.trim().length > 10) {
            console.log('🎯 Intercepted prompt:', text.substring(0, 50) + '...');
            
            e.preventDefault();
            e.stopPropagation();
            
            showAdvancedOverlay(text, activeElement);
          }
        }
      }
    }, true);
  }
  
  function showAdvancedOverlay(originalText, inputElement) {
    const existingOverlay = document.getElementById('token-optimizer-debug');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // Apply advanced optimization
    const optimizationResult = advancedOptimizeText(originalText);
    const originalTokens = estimateTokens(originalText);
    const optimizedTokens = estimateTokens(optimizationResult.text);
    const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
    
    const overlay = document.createElement('div');
    overlay.id = 'token-optimizer-debug';
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      z-index: 999999;
      max-width: 600px;
      width: 90vw;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    overlay.innerHTML = `
      <h3 style="margin: 0 0 16px 0; color: #1f2937; display: flex; align-items: center; gap: 8px;">
        🚀 Token Optimizer v2 
        <span style="background: #10b981; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Advanced</span>
      </h3>
      
      <div style="margin-bottom: 16px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
        <div style="text-align: center; padding: 12px; background: #f8fafc; border-radius: 8px;">
          <div style="font-size: 18px; font-weight: 600; color: #374151;">${originalTokens}</div>
          <div style="font-size: 12px; color: #6b7280;">Original Tokens</div>
        </div>
        <div style="text-align: center; padding: 12px; background: #ecfdf5; border-radius: 8px;">
          <div style="font-size: 18px; font-weight: 600; color: #059669;">${optimizedTokens}</div>
          <div style="font-size: 12px; color: #6b7280;">Optimized Tokens</div>
        </div>
        <div style="text-align: center; padding: 12px; background: #fef3c7; border-radius: 8px;">
          <div style="font-size: 18px; font-weight: 600; color: #d97706;">${Math.round((tokensSaved/originalTokens)*100)}%</div>
          <div style="font-size: 12px; color: #6b7280;">Reduction</div>
        </div>
      </div>
      
      ${optimizationResult.techniques.length > 0 ? `
        <div style="margin-bottom: 16px; padding: 12px; background: #f1f5f9; border-radius: 8px;">
          <div style="font-weight: 500; margin-bottom: 8px; color: #374151;">🔧 Applied Techniques:</div>
          <div style="font-size: 12px; color: #64748b;">
            ${optimizationResult.techniques.map(t => `• ${t}`).join('<br>')}
          </div>
        </div>
      ` : ''}
      
      <div style="margin-bottom: 16px;">
        <div style="font-weight: 500; margin-bottom: 8px; color: #374151;">📝 Optimized Prompt:</div>
        <div style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 14px; line-height: 1.4; white-space: pre-wrap; max-height: 200px; overflow-y: auto;">
${optimizationResult.text}</div>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button id="send-original" style="background: #6b7280; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          Send Original
        </button>
        <button id="send-optimized" style="background: #3b82f6; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
          Send Optimized (${tokensSaved} tokens saved)
        </button>
        <button id="close-overlay" style="background: #ef4444; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          Close
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Event listeners
    document.getElementById('send-optimized').onclick = () => {
      sendText(optimizationResult.text, inputElement);
      overlay.remove();
    };
    
    document.getElementById('send-original').onclick = () => {
      sendText(originalText, inputElement);
      overlay.remove();
    };
    
    document.getElementById('close-overlay').onclick = () => {
      overlay.remove();
    };
  }
  
  // Advanced optimization based on research
  function advancedOptimizeText(text) {
    console.log('🔬 Applying advanced optimization...');
    
    let optimized = text.trim();
    const techniques = [];
    
    // Step 1: Remove greeting formalities (Microsoft Research approach)
    const greetingPatterns = [
      /^(hello|hi|hey|greetings)[,\s]*/i,
      /^(good morning|good afternoon|good evening)[,\s]*/i,
      /^(please\s+)*/i
    ];
    
    greetingPatterns.forEach(pattern => {
      if (pattern.test(optimized)) {
        optimized = optimized.replace(pattern, '');
        techniques.push('Removed greeting formalities');
      }
    });
    
    // Step 2: Compress verbose request patterns (LLMLingua approach)
    const verbosePatterns = [
      // Complete request transformations (order matters - longest first)
      { pattern: /i would really like you to please help me/gi, replacement: 'help me', desc: 'Compressed verbose request' },
      { pattern: /i would like you to please help me/gi, replacement: 'help me', desc: 'Compressed polite request' },
      { pattern: /could you please help me/gi, replacement: 'help me', desc: 'Simplified help request' },
      { pattern: /can you please help me/gi, replacement: 'help me', desc: 'Simplified help request' },
      { pattern: /i would like you to/gi, replacement: '', desc: 'Removed verbose opener' },
      { pattern: /i need you to/gi, replacement: '', desc: 'Removed verbose instruction' },
      { pattern: /could you please/gi, replacement: '', desc: 'Removed politeness marker' },
      { pattern: /would you please/gi, replacement: '', desc: 'Removed politeness marker' },
      { pattern: /can you please/gi, replacement: '', desc: 'Removed politeness marker' },
      { pattern: /could you/gi, replacement: '', desc: 'Simplified request' },
      { pattern: /can you/gi, replacement: '', desc: 'Simplified request' },
      
      // Verbose phrase compression
      { pattern: /due to the fact that/gi, replacement: 'because', desc: 'Compressed causal phrase' },
      { pattern: /at this point in time/gi, replacement: 'now', desc: 'Simplified temporal reference' },
      { pattern: /in order to/gi, replacement: 'to', desc: 'Simplified purpose phrase' },
      { pattern: /for the purpose of/gi, replacement: 'for', desc: 'Compressed purpose phrase' },
      { pattern: /with regard to/gi, replacement: 'regarding', desc: 'Simplified reference phrase' },
      { pattern: /with respect to/gi, replacement: 'regarding', desc: 'Simplified reference phrase' },
      { pattern: /in relation to/gi, replacement: 'about', desc: 'Simplified relational phrase' },
      { pattern: /as a matter of fact/gi, replacement: '', desc: 'Removed filler expression' },
      { pattern: /it should be noted that/gi, replacement: '', desc: 'Removed meta-commentary' },
      { pattern: /it is important to note that/gi, replacement: '', desc: 'Removed meta-commentary' }
    ];
    
    verbosePatterns.forEach(({ pattern, replacement, desc }) => {
      if (pattern.test(optimized)) {
        optimized = optimized.replace(pattern, replacement);
        if (!techniques.includes(desc)) {
          techniques.push(desc);
        }
      }
    });
    
    // Step 3: Remove qualifier words that don't add semantic value
    const qualifiers = [
      /\b(really|very|quite|rather|pretty|fairly|somewhat|relatively)\s+/gi,
      /\b(basically|essentially|ultimately|obviously|clearly|literally|actually)\s+/gi,
      /\b(just|simply|merely|only)\s+/gi
    ];
    
    qualifiers.forEach(pattern => {
      if (pattern.test(optimized)) {
        optimized = optimized.replace(pattern, '');
        techniques.push('Removed semantic qualifiers');
      }
    });
    
    // Step 4: Apply semantic chunking for complex requests
    const chunkingResult = applyAdvancedSemanticChunking(optimized);
    if (chunkingResult.chunked) {
      optimized = chunkingResult.text;
      techniques.push('Applied semantic task chunking');
    }
    
    // Step 5: Clean up and normalize (critical for quality)
    optimized = optimized
      .replace(/\s+/g, ' ')                    // Normalize whitespace
      .replace(/\s*([,.!?;:])/g, '$1')        // Fix punctuation spacing
      .replace(/([,.!?;:])\s*([,.!?;:])/g, '$1') // Remove duplicate punctuation
      .replace(/\b(\w+)\s+\1\b/gi, '$1')      // Remove duplicate words
      .replace(/^\s*[,.;]\s*/, '')            // Remove leading punctuation
      .trim();
    
    // Capitalize first letter if it's lowercase
    if (optimized && /^[a-z]/.test(optimized)) {
      optimized = optimized.charAt(0).toUpperCase() + optimized.slice(1);
    }
    
    console.log('✅ Optimization complete:', techniques);
    
    return {
      text: optimized,
      techniques: techniques
    };
  }
  
  // Advanced semantic chunking based on research
  function applyAdvancedSemanticChunking(text) {
    if (text.length < 120) {
      return { chunked: false, text: text };
    }
    
    // Look for task coordination patterns
    const taskPatterns = [
      /\b(and also|also|additionally|furthermore|moreover)\b/gi,
      /\b(then|next|after that|subsequently)\b/gi,
      /\b(finally|lastly|in conclusion)\b/gi,
      /\b(first|second|third|fourth|fifth)\b/gi
    ];
    
    let hasMultipleTasks = false;
    taskPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        hasMultipleTasks = true;
      }
    });
    
    if (!hasMultipleTasks) {
      return { chunked: false, text: text };
    }
    
    // Split on task coordinators while preserving sentence integrity
    const splitPattern = /\s+(and also|also|additionally|furthermore|moreover|then|next|after that|finally|lastly)\s+/gi;
    const parts = text.split(splitPattern);
    
    // Filter out the coordinators and clean up parts
    const cleanParts = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part && !splitPattern.test(part) && part.trim().length > 15) {
        let cleanPart = part.trim()
          .replace(/^[,.\s]+/, '')  // Remove leading punctuation
          .replace(/\s+/g, ' ');    // Normalize spaces
        
        if (cleanPart) {
          cleanParts.push(cleanPart);
        }
      }
    }
    
    // Only chunk if we have 2-5 meaningful tasks
    if (cleanParts.length >= 2 && cleanParts.length <= 5) {
      const numberedTasks = cleanParts
        .map((task, index) => `${index + 1}. ${task}`)
        .join('\n');
      
      return { chunked: true, text: numberedTasks };
    }
    
    return { chunked: false, text: text };
  }
  
  // Improved token estimation based on research
  function estimateTokens(text) {
    if (!text || text.trim() === '') return 0;
    
    // More accurate tokenization based on GPT research
    const words = text.trim().split(/\s+/);
    let tokenCount = 0;
    
    words.forEach(word => {
      if (word.length <= 4) {
        tokenCount += 1;  // Short words are usually 1 token
      } else if (word.length <= 8) {
        tokenCount += 1.3;  // Medium words can be 1-2 tokens
      } else {
        tokenCount += Math.ceil(word.length / 4);  // Long words get split more
      }
    });
    
    // Adjust for punctuation and special characters
    const punctuation = (text.match(/[.,!?;:()-]/g) || []).length;
    tokenCount += punctuation * 0.3;
    
    // Adjust for common patterns
    if (text.includes('\n')) {
      tokenCount += (text.match(/\n/g) || []).length * 0.1;
    }
    
    return Math.max(1, Math.round(tokenCount));
  }
  
  function sendText(text, inputElement) {
    console.log('📤 Sending optimized text...');
    
    if (inputElement.tagName === 'TEXTAREA') {
      inputElement.value = text;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      inputElement.textContent = text;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Advanced button detection
    const button = findAdvancedSendButton();
    if (button) {
      console.log('🎯 Found send button, clicking...');
      setTimeout(() => button.click(), 100);
    } else {
      console.log('⚠️ No send button found - text placed in input');
    }
  }
  
  function findAdvancedSendButton() {
    // Comprehensive button detection with site-specific optimizations
    const siteSelectors = {
      'chat.openai.com': [
        '[data-testid="send-button"]',
        'button[aria-label*="Send message"]'
      ],
      'claude.ai': [
        'button[aria-label*="Send Message"]',
        'button[type="submit"]'
      ],
      'gemini.google.com': [
        'button[aria-label*="Send message"]'
      ]
    };
    
    const currentSite = window.location.hostname;
    const selectors = siteSelectors[currentSite] || [];
    
    // Try site-specific selectors first
    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button && !button.disabled && button.offsetParent !== null) {
        return button;
      }
    }
    
    // Fallback to generic detection
    const genericSelectors = [
      'button[data-testid*="send"]',
      'button[aria-label*="send" i]',
      'button[type="submit"]',
      'button:has(svg)'
    ];
    
    for (const selector of genericSelectors) {
      const buttons = document.querySelectorAll(selector);
      for (const button of buttons) {
        if (button && !button.disabled && button.offsetParent !== null) {
          const buttonText = button.textContent?.toLowerCase() || '';
          const skipPatterns = ['cancel', 'back', 'close'];
          if (!skipPatterns.some(pattern => buttonText.includes(pattern))) {
            return button;
          }
        }
      }
    }
    
    return null;
  }
  
  // Initialize
  setTimeout(() => {
    interceptPrompts();
    console.log('✅ Token Optimizer v2 Debug Ready! 🚀');
  }, 1000);
  
})();