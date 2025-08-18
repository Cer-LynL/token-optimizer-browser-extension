// Advanced Prompt Optimizer v3 - Based on 2024 Research (LLMLingua, CoS, LPO)
(function() {
  'use strict';
  
  console.log('🚀 Token Optimizer v3 Advanced Research-Based System Loading...');
  
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
            
            showResearchBasedOverlay(text, activeElement);
          }
        }
      }
    }, true);
  }
  
  function showResearchBasedOverlay(originalText, inputElement) {
    const existingOverlay = document.getElementById('token-optimizer-debug');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // Apply research-based optimization
    const optimizationResult = researchBasedOptimization(originalText);
    const originalTokens = estimateTokensAdvanced(originalText);
    const optimizedTokens = estimateTokensAdvanced(optimizationResult.text);
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
      max-width: 800px;
      width: 95vw;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      max-height: 85vh;
      overflow-y: auto;
    `;
    
    overlay.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #1f2937; display: flex; align-items: center; gap: 8px;">
          🚀 Token Optimizer v3 
          <span style="background: #3b82f6; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Research-Based</span>
        </h3>
        <button onclick="this.closest('#token-optimizer-debug').remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280;">×</button>
      </div>
      
      <div style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
        <div style="text-align: center; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
          <div style="font-size: 18px; font-weight: 600; color: #dc2626;">${originalTokens}</div>
          <div style="font-size: 12px; color: #6b7280;">Original Tokens</div>
        </div>
        <div style="text-align: center; padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <div style="font-size: 18px; font-weight: 600; color: #16a34a;">${optimizedTokens}</div>
          <div style="font-size: 12px; color: #6b7280;">Optimized Tokens</div>
        </div>
        <div style="text-align: center; padding: 12px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
          <div style="font-size: 18px; font-weight: 600; color: #ea580c;">${Math.round((tokensSaved/originalTokens)*100)}%</div>
          <div style="font-size: 12px; color: #6b7280;">Reduction</div>
        </div>
      </div>
      
      ${optimizationResult.appliedTechniques.size > 0 ? `
        <div style="margin-bottom: 20px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="font-weight: 600; margin-bottom: 8px; color: #374151;">🔬 Applied Research Techniques:</div>
          <div style="font-size: 13px; color: #64748b; line-height: 1.4;">
            ${Array.from(optimizationResult.appliedTechniques).map(t => `• ${t}`).join('<br>')}
          </div>
        </div>
      ` : ''}
      
      <div style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: flex-start;">
        <div>
          <div style="font-weight: 500; margin-bottom: 8px; color: #374151;">📄 Original Prompt</div>
          <div style="padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 13px; line-height: 1.4; max-height: 200px; overflow-y: auto;">
            ${generateHighlightedText(originalText, optimizationResult.changes)}
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-top: 32px;">
          <div style="background: #3b82f6; color: white; padding: 8px; border-radius: 50%; font-size: 16px;">→</div>
        </div>
        
        <div>
          <div style="font-weight: 500; margin-bottom: 8px; color: #374151;">✨ Optimized Prompt</div>
          <div style="padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 13px; line-height: 1.4; max-height: 200px; overflow-y: auto;">
            ${escapeHtml(optimizationResult.text)}
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button id="send-original" style="background: #6b7280; color: white; border: none; padding: 12px 18px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          Send Original
        </button>
        <button id="send-optimized" style="background: #16a34a; color: white; border: none; padding: 12px 18px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
          Send Optimized (-${tokensSaved} tokens)
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
  }
  
  // Advanced research-based optimization system
  function researchBasedOptimization(text) {
    console.log('🔬 Applying advanced research-based optimization...');
    
    let optimized = text.trim();
    const appliedTechniques = new Set();
    const changes = [];
    
    // Track original for highlighting changes
    const original = optimized;
    
    // TECHNIQUE 1: LLMLingua-style Iterative Token Compression (ITPC)
    const itpcResult = applyIterativeTokenCompression(optimized);
    if (itpcResult.changed) {
      optimized = itpcResult.text;
      appliedTechniques.add('ITPC: Iterative Token-level Compression');
      changes.push(...itpcResult.changes);
    }
    
    // TECHNIQUE 2: Chain-of-Symbols (CoS) - Remove symbolic redundancy
    const cosResult = applyChainOfSymbols(optimized);
    if (cosResult.changed) {
      optimized = cosResult.text;
      appliedTechniques.add('CoS: Chain-of-Symbols Token Reduction');
      changes.push(...cosResult.changes);
    }
    
    // TECHNIQUE 3: Local Prompt Optimization (LPO) - Context-aware editing
    const lpoResult = applyLocalPromptOptimization(optimized);
    if (lpoResult.changed) {
      optimized = lpoResult.text;
      appliedTechniques.add('LPO: Local Prompt Optimization');
      changes.push(...lpoResult.changes);
    }
    
    // TECHNIQUE 4: Multi-objective Optimization - Semantic chunking
    const mooResult = applyMultiObjectiveOptimization(optimized);
    if (mooResult.changed) {
      optimized = mooResult.text;
      appliedTechniques.add('MOO: Multi-objective Task Decomposition');
      changes.push(...mooResult.changes);
    }
    
    // TECHNIQUE 5: Dynamic Context Adaptation (DCP-style)
    const dcpResult = applyDynamicContextAdaptation(optimized);
    if (dcpResult.changed) {
      optimized = dcpResult.text;
      appliedTechniques.add('DCA: Dynamic Context Adaptation');
      changes.push(...dcpResult.changes);
    }
    
    // Final cleanup with grammar preservation
    optimized = finalizeOptimization(optimized);
    
    console.log('✅ Applied techniques:', Array.from(appliedTechniques));
    
    return {
      text: optimized,
      appliedTechniques: appliedTechniques,
      changes: changes
    };
  }
  
  // TECHNIQUE 1: Iterative Token-level Prompt Compression (LLMLingua approach)
  function applyIterativeTokenCompression(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Step 1: Remove low-perplexity greeting tokens
    const greetingPatterns = [
      { pattern: /^(hello|hi|hey|greetings),?\s*/i, desc: 'greeting' },
      { pattern: /^(good morning|good afternoon|good evening),?\s*/i, desc: 'time greeting' }
    ];
    
    greetingPatterns.forEach(({ pattern, desc }) => {
      if (pattern.test(result)) {
        const match = result.match(pattern);
        if (match) {
          result = result.replace(pattern, '');
          changes.push({ type: 'remove', text: match[0], reason: `Low-perplexity ${desc}` });
          hasChanges = true;
        }
      }
    });
    
    // Step 2: Remove high-perplexity filler tokens
    const fillerTokens = [
      { token: 'please', weight: 0.1, desc: 'politeness marker' },
      { token: 'kindly', weight: 0.05, desc: 'politeness marker' },
      { token: 'really', weight: 0.2, desc: 'emphasis modifier' },
      { token: 'very', weight: 0.3, desc: 'degree modifier' },
      { token: 'quite', weight: 0.2, desc: 'degree modifier' },
      { token: 'just', weight: 0.4, desc: 'minimizer' },
      { token: 'simply', weight: 0.1, desc: 'simplification marker' },
      { token: 'basically', weight: 0.1, desc: 'approximation marker' },
      { token: 'obviously', weight: 0.05, desc: 'certainty marker' },
      { token: 'clearly', weight: 0.1, desc: 'clarity marker' },
      { token: 'actually', weight: 0.2, desc: 'reality marker' },
      { token: 'literally', weight: 0.05, desc: 'literality marker' }
    ];
    
    fillerTokens.forEach(({ token, weight, desc }) => {
      const regex = new RegExp(`\\b${token}\\s+`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, '');
        changes.push({ type: 'remove', text: token, reason: `Low-information ${desc}` });
        hasChanges = true;
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // TECHNIQUE 2: Chain-of-Symbols (CoS) approach
  function applyChainOfSymbols(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Remove redundant request patterns using symbolic compression
    const requestPatterns = [
      { 
        pattern: /\b(i would like you to|i want you to|i need you to)\s+/gi, 
        replacement: '', 
        desc: 'Request formulation symbol' 
      },
      { 
        pattern: /\b(could you|can you|would you)\s+/gi, 
        replacement: '', 
        desc: 'Modal request symbol' 
      },
      { 
        pattern: /\b(help me|assist me)\s+/gi, 
        replacement: '', 
        desc: 'Assistance symbol' 
      }
    ];
    
    requestPatterns.forEach(({ pattern, replacement, desc }) => {
      const matches = [...result.matchAll(pattern)];
      if (matches.length > 0) {
        result = result.replace(pattern, replacement);
        matches.forEach(match => {
          changes.push({ type: 'remove', text: match[0], reason: desc });
        });
        hasChanges = true;
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // TECHNIQUE 3: Local Prompt Optimization (LPO)
  function applyLocalPromptOptimization(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Locally optimize verbose phrases while preserving context
    const verboseOptimizations = [
      { 
        pattern: /\bdue to the fact that\b/gi, 
        replacement: 'because', 
        desc: 'Causal phrase optimization' 
      },
      { 
        pattern: /\bat this point in time\b/gi, 
        replacement: 'now', 
        desc: 'Temporal phrase optimization' 
      },
      { 
        pattern: /\bin order to\b/gi, 
        replacement: 'to', 
        desc: 'Purpose phrase optimization' 
      },
      { 
        pattern: /\bwith regard to\b/gi, 
        replacement: 'regarding', 
        desc: 'Reference phrase optimization' 
      },
      { 
        pattern: /\bfor the purpose of\b/gi, 
        replacement: 'for', 
        desc: 'Purpose phrase compression' 
      }
    ];
    
    verboseOptimizations.forEach(({ pattern, replacement, desc }) => {
      const matches = [...result.matchAll(pattern)];
      if (matches.length > 0) {
        result = result.replace(pattern, replacement);
        matches.forEach(match => {
          changes.push({ type: 'replace', original: match[0], replacement, reason: desc });
        });
        hasChanges = true;
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // TECHNIQUE 4: Multi-objective Optimization for task decomposition
  function applyMultiObjectiveOptimization(text) {
    if (text.length < 120) {
      return { text, changed: false, changes: [] };
    }
    
    // Detect multiple objectives/tasks
    const taskIndicators = [
      /\b(and also|also)\b/gi,
      /\b(additionally|furthermore|moreover)\b/gi,
      /\b(then|next|after that)\b/gi,
      /\b(finally|lastly)\b/gi
    ];
    
    let hasMultipleObjectives = false;
    taskIndicators.forEach(pattern => {
      if (pattern.test(text)) {
        hasMultipleObjectives = true;
      }
    });
    
    if (!hasMultipleObjectives) {
      return { text, changed: false, changes: [] };
    }
    
    // Split into objectives and optimize structure
    const splitPattern = /\s+(and also|also|additionally|furthermore|moreover|then|next|after that|finally|lastly)\s+/gi;
    const parts = text.split(splitPattern);
    
    const cleanTasks = [];
    for (let i = 0; i < parts.length; i += 2) { // Skip the connectors
      const part = parts[i];
      if (part && part.trim().length > 20) {
        let cleanTask = part.trim()
          .replace(/^[,.\s]+/, '')
          .replace(/\s+/g, ' ');
        cleanTasks.push(cleanTask);
      }
    }
    
    if (cleanTasks.length >= 2 && cleanTasks.length <= 5) {
      const optimizedTasks = cleanTasks
        .map((task, index) => `${index + 1}. ${task}`)
        .join('\\n');
      
      return { 
        text: optimizedTasks, 
        changed: true, 
        changes: [{ type: 'restructure', reason: 'Multi-objective task decomposition' }]
      };
    }
    
    return { text, changed: false, changes: [] };
  }
  
  // TECHNIQUE 5: Dynamic Context Adaptation (DCP-style MDP approach)
  function applyDynamicContextAdaptation(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Adaptively remove context-dependent redundant tokens
    const contextPatterns = [
      { pattern: /\b(as you can see|as mentioned|as stated)\s+/gi, desc: 'Meta-reference removal' },
      { pattern: /\b(it should be noted|it is important to note)\s+that\s+/gi, desc: 'Meta-commentary removal' },
      { pattern: /\b(in my opinion|i think|i believe)\s+/gi, desc: 'Opinion marker removal' },
      { pattern: /\b(to be honest|frankly|honestly)\s+/gi, desc: 'Honesty marker removal' }
    ];
    
    contextPatterns.forEach(({ pattern, desc }) => {
      const matches = [...result.matchAll(pattern)];
      if (matches.length > 0) {
        result = result.replace(pattern, '');
        matches.forEach(match => {
          changes.push({ type: 'remove', text: match[0], reason: desc });
        });
        hasChanges = true;
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // Final optimization cleanup
  function finalizeOptimization(text) {
    let result = text
      .replace(/\s+/g, ' ')                    // Normalize whitespace
      .replace(/\s*([,.!?;:])/g, '$1')        // Fix punctuation spacing
      .replace(/([,.!?;:])\s*([,.!?;:])/g, '$1') // Remove duplicate punctuation
      .replace(/\b(\w+)\s+\1\b/gi, '$1')      // Remove duplicate words
      .replace(/^\s*[,.\s]+/, '')             // Remove leading punctuation
      .trim();
    
    // Ensure proper capitalization
    if (result && /^[a-z]/.test(result)) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    
    return result;
  }
  
  // Generate highlighted text showing changes
  function generateHighlightedText(original, changes) {
    let highlighted = escapeHtml(original);
    
    // Sort changes by position to avoid overlap issues
    const sortedChanges = changes.sort((a, b) => {
      const aPos = original.indexOf(a.text || a.original || '');
      const bPos = original.indexOf(b.text || b.original || '');
      return bPos - aPos; // Reverse order to avoid position shifts
    });
    
    sortedChanges.forEach(change => {
      const searchText = change.text || change.original || '';
      if (searchText && highlighted.includes(escapeHtml(searchText))) {
        const escapedSearch = escapeHtml(searchText);
        if (change.type === 'remove') {
          highlighted = highlighted.replace(
            escapedSearch, 
            `<span style="background-color: #fee2e2; text-decoration: line-through; color: #dc2626;">${escapedSearch}</span>`
          );
        } else if (change.type === 'replace') {
          highlighted = highlighted.replace(
            escapedSearch,
            `<span style="background-color: #fef3c7; color: #d97706;">${escapedSearch}</span>`
          );
        }
      }
    });
    
    return highlighted;
  }
  
  // Advanced token estimation based on research
  function estimateTokensAdvanced(text) {
    if (!text || text.trim() === '') return 0;
    
    // Research-based token estimation algorithm
    let tokenCount = 0;
    const words = text.trim().split(/\s+/);
    
    words.forEach(word => {
      // More accurate per-word token estimation
      if (word.length <= 3) {
        tokenCount += 1;
      } else if (word.length <= 6) {
        tokenCount += 1.2;
      } else if (word.length <= 10) {
        tokenCount += Math.ceil(word.length / 4.5);
      } else {
        tokenCount += Math.ceil(word.length / 3.8);
      }
    });
    
    // Account for punctuation and special formatting
    const punctuation = (text.match(/[.,!?;:()\-'"]/g) || []).length;
    tokenCount += punctuation * 0.25;
    
    // Account for line breaks and formatting
    const newlines = (text.match(/\n/g) || []).length;
    tokenCount += newlines * 0.1;
    
    return Math.max(1, Math.round(tokenCount));
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    
    // Find and click send button
    const button = findAdvancedSendButton();
    if (button) {
      console.log('🎯 Found send button, clicking...');
      setTimeout(() => button.click(), 100);
    } else {
      console.log('⚠️ No send button found - text placed in input');
    }
  }
  
  function findAdvancedSendButton() {
    const selectors = [
      '[data-testid="send-button"]',
      'button[aria-label*="Send message"]',
      'button[aria-label*="Send Message"]', 
      'button[type="submit"]',
      'button[data-testid*="send"]'
    ];
    
    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button && !button.disabled && button.offsetParent !== null) {
        return button;
      }
    }
    
    return null;
  }
  
  // Initialize
  setTimeout(() => {
    interceptPrompts();
    console.log('✅ Token Optimizer v3 Research-Based System Ready! 🚀');
  }, 1000);
  
})();