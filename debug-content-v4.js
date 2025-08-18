// Token Optimizer v4 - Enhanced Quality & Research-Based (Fixed All Issues)
(function() {
  'use strict';
  
  console.log('🚀 Token Optimizer v4 Enhanced Quality System Loading...');
  
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
    console.log('Setting up v4 enhanced prompt interception...');
    
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
            
            showEnhancedOverlay(text, activeElement);
          }
        }
      }
    }, true);
  }
  
  function showEnhancedOverlay(originalText, inputElement) {
    const existingOverlay = document.getElementById('token-optimizer-debug');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // Apply v4 enhanced optimization
    const optimizationResult = enhancedOptimizationV4(originalText);
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
      border: 2px solid #16a34a;
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
          🚀 Token Optimizer v4 
          <span style="background: #16a34a; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Enhanced Quality</span>
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
        <div style="margin-bottom: 20px; padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <div style="font-weight: 600; margin-bottom: 8px; color: #374151;">🔬 v4 Enhancement Techniques:</div>
          <div style="font-size: 13px; color: #16a34a; line-height: 1.4;">
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
          <div style="background: #16a34a; color: white; padding: 8px; border-radius: 50%; font-size: 16px;">→</div>
        </div>
        
        <div>
          <div style="font-weight: 500; margin-bottom: 8px; color: #374151;">✨ Enhanced Optimized Prompt</div>
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
          Send Enhanced (-${tokensSaved} tokens)
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
  
  // v4 Enhanced Optimization System - Fixes ALL Previous Issues
  function enhancedOptimizationV4(text) {
    console.log('🔬 Applying v4 enhanced optimization...');
    
    let optimized = text.trim();
    const appliedTechniques = new Set();
    const changes = [];
    
    // PASS 1: Advanced Duplicate Word Removal (CRITICAL FIX)
    const duplicateResult = advancedDuplicateRemoval(optimized);
    if (duplicateResult.changed) {
      optimized = duplicateResult.text;
      appliedTechniques.add('Advanced Duplicate Word Removal');
      changes.push(...duplicateResult.changes);
    }
    
    // PASS 2: Comprehensive Phrase Replacement (ORDERED BY LENGTH)
    const phraseResult = comprehensivePhraseReplacement(optimized);
    if (phraseResult.changed) {
      optimized = phraseResult.text;
      appliedTechniques.add('Comprehensive Phrase Optimization');
      changes.push(...phraseResult.changes);
    }
    
    // PASS 3: Enhanced Request Pattern Removal (COMPLETE REMOVAL)
    const requestResult = enhancedRequestPatternRemoval(optimized);
    if (requestResult.changed) {
      optimized = requestResult.text;
      appliedTechniques.add('Enhanced Request Pattern Removal');
      changes.push(...requestResult.changes);
    }
    
    // PASS 4: Filler Word Elimination
    const fillerResult = intelligentFillerRemoval(optimized);
    if (fillerResult.changed) {
      optimized = fillerResult.text;
      appliedTechniques.add('Intelligent Filler Word Removal');
      changes.push(...fillerResult.changes);
    }
    
    // PASS 5: Semantic Task Chunking (PROPER LINE BREAKS)
    const chunkingResult = semanticTaskChunking(optimized);
    if (chunkingResult.changed) {
      optimized = chunkingResult.text;
      appliedTechniques.add('Semantic Task Chunking');
      changes.push(...chunkingResult.changes);
    }
    
    // PASS 6: Final Grammar and Formatting Cleanup
    optimized = finalGrammarCleanup(optimized);
    
    console.log('✅ v4 Enhanced optimization complete:', Array.from(appliedTechniques));
    
    return {
      text: optimized,
      appliedTechniques: appliedTechniques,
      changes: changes
    };
  }
  
  // TECHNIQUE 1: Advanced Duplicate Word Removal
  function advancedDuplicateRemoval(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Pattern 1: Immediate duplicate words (word word)
    const immediatePattern = /\b(\w+)\s+\1\b/gi;
    const immediateMatches = [...result.matchAll(immediatePattern)];
    if (immediateMatches.length > 0) {
      immediateMatches.forEach(match => {
        changes.push({ 
          type: 'remove', 
          text: match[0], 
          reason: `Duplicate removal: "${match[1]} ${match[1]}" → "${match[1]}"` 
        });
      });
      result = result.replace(immediatePattern, '$1');
      hasChanges = true;
    }
    
    // Pattern 2: Multiple word repetitions (word word word)
    const triplePattern = /\b(\w+)\s+\1\s+\1\b/gi;
    const tripleMatches = [...result.matchAll(triplePattern)];
    if (tripleMatches.length > 0) {
      tripleMatches.forEach(match => {
        changes.push({ 
          type: 'remove', 
          text: match[0], 
          reason: `Triple word removal: "${match[0]}" → "${match[1]}"` 
        });
      });
      result = result.replace(triplePattern, '$1');
      hasChanges = true;
    }
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // TECHNIQUE 2: Comprehensive Phrase Replacement (FIXED ORDER)
  function comprehensivePhraseReplacement(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Ordered by length (longest first to prevent partial matches)
    const phrases = [
      { pattern: /\bat this point in time\b/gi, replacement: 'now', desc: 'Temporal phrase: "at this point in time" → "now"' },
      { pattern: /\bdue to the fact that\b/gi, replacement: 'because', desc: 'Causal phrase: "due to the fact that" → "because"' },
      { pattern: /\bfor the purpose of\b/gi, replacement: 'for', desc: 'Purpose phrase: "for the purpose of" → "for"' },
      { pattern: /\bwith regard to\b/gi, replacement: 'regarding', desc: 'Reference phrase: "with regard to" → "regarding"' },
      { pattern: /\bwith respect to\b/gi, replacement: 'regarding', desc: 'Reference phrase: "with respect to" → "regarding"' },
      { pattern: /\bin order to\b/gi, replacement: 'to', desc: 'Purpose phrase: "in order to" → "to"' },
      { pattern: /\bin relation to\b/gi, replacement: 'about', desc: 'Relation phrase: "in relation to" → "about"' },
      { pattern: /\bas a matter of fact\b/gi, replacement: '', desc: 'Filler phrase removal: "as a matter of fact"' },
      { pattern: /\bit should be noted that\b/gi, replacement: '', desc: 'Meta-commentary removal: "it should be noted that"' },
      { pattern: /\bit is important to note that\b/gi, replacement: '', desc: 'Meta-commentary removal: "it is important to note that"' }
    ];
    
    phrases.forEach(({ pattern, replacement, desc }) => {
      const matches = [...result.matchAll(pattern)];
      if (matches.length > 0) {
        matches.forEach(match => {
          changes.push({ 
            type: 'replace', 
            original: match[0], 
            replacement: replacement, 
            reason: desc 
          });
        });
        result = result.replace(pattern, replacement);
        hasChanges = true;
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // TECHNIQUE 3: Enhanced Request Pattern Removal (COMPLETE COVERAGE)
  function enhancedRequestPatternRemoval(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Request patterns (ordered by specificity - longest first)
    const requestPatterns = [
      { pattern: /\bi would really like you to please\b/gi, replacement: '', desc: 'Complex request removal: "I would really like you to please"' },
      { pattern: /\bi would like you to please\b/gi, replacement: '', desc: 'Polite request removal: "I would like you to please"' },
      { pattern: /\bcould you please\b/gi, replacement: '', desc: 'Modal request removal: "could you please"' },
      { pattern: /\bwould you please\b/gi, replacement: '', desc: 'Modal request removal: "would you please"' },
      { pattern: /\bcan you please\b/gi, replacement: '', desc: 'Modal request removal: "can you please"' },
      { pattern: /\bi would like you to\b/gi, replacement: '', desc: 'Request removal: "I would like you to"' },
      { pattern: /\bi need you to\b/gi, replacement: '', desc: 'Request removal: "I need you to"' },
      { pattern: /\bcould you\b/gi, replacement: '', desc: 'Simple request removal: "could you"' },
      { pattern: /\bcan you\b/gi, replacement: '', desc: 'Simple request removal: "can you"' },
      { pattern: /\bwould you\b/gi, replacement: '', desc: 'Simple request removal: "would you"' }
    ];
    
    requestPatterns.forEach(({ pattern, replacement, desc }) => {
      const matches = [...result.matchAll(pattern)];
      if (matches.length > 0) {
        matches.forEach(match => {
          changes.push({ 
            type: 'remove', 
            text: match[0], 
            reason: desc 
          });
        });
        result = result.replace(pattern, replacement);
        hasChanges = true;
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // TECHNIQUE 4: Intelligent Filler Word Removal
  function intelligentFillerRemoval(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    const fillers = [
      { pattern: /\bbasically\b/gi, desc: 'Filler word: "basically"' },
      { pattern: /\bobviously\b/gi, desc: 'Filler word: "obviously"' },
      { pattern: /\bclearly\b/gi, desc: 'Filler word: "clearly"' },
      { pattern: /\bessentially\b/gi, desc: 'Filler word: "essentially"' },
      { pattern: /\bultimately\b/gi, desc: 'Filler word: "ultimately"' },
      { pattern: /\bliterally\b/gi, desc: 'Filler word: "literally"' },
      { pattern: /\bactually\b/gi, desc: 'Filler word: "actually"' },
      { pattern: /\breally\b/gi, desc: 'Filler word: "really"' },
      { pattern: /\bvery\b/gi, desc: 'Filler word: "very"' },
      { pattern: /\bquite\b/gi, desc: 'Filler word: "quite"' },
      { pattern: /\bjust\b/gi, desc: 'Filler word: "just"' },
      { pattern: /\bsimply\b/gi, desc: 'Filler word: "simply"' }
    ];
    
    fillers.forEach(({ pattern, desc }) => {
      const matches = [...result.matchAll(pattern)];
      if (matches.length > 0) {
        matches.forEach(match => {
          changes.push({ 
            type: 'remove', 
            text: match[0], 
            reason: desc 
          });
        });
        result = result.replace(pattern, '');
        hasChanges = true;
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // TECHNIQUE 5: Semantic Task Chunking (PROPER LINE BREAKS)
  function semanticTaskChunking(text) {
    if (text.length < 80) {
      return { text, changed: false, changes: [] };
    }
    
    // Look for task coordination patterns
    const taskConnectors = [
      /\b(and also|also)\b/gi,
      /\b(and then|then)\b/gi,
      /\b(additionally|furthermore|moreover)\b/gi,
      /\b(finally|lastly)\b/gi
    ];
    
    let hasMultipleTasks = false;
    taskConnectors.forEach(pattern => {
      if (pattern.test(text)) {
        hasMultipleTasks = true;
      }
    });
    
    if (!hasMultipleTasks) {
      return { text, changed: false, changes: [] };
    }
    
    // Split on coordinators and create numbered list
    const splitPattern = /\s+(and also|also|and then|then|additionally|furthermore|moreover|finally|lastly)\s+/gi;
    const parts = text.split(splitPattern);
    
    const cleanTasks = [];
    for (let i = 0; i < parts.length; i += 2) { // Skip connectors
      const part = parts[i];
      if (part && part.trim().length > 20) {
        let cleanTask = part.trim()
          .replace(/^[,.\s]+/, '')
          .replace(/\s+/g, ' ');
        cleanTasks.push(cleanTask);
      }
    }
    
    if (cleanTasks.length >= 2 && cleanTasks.length <= 5) {
      // Use actual line breaks (\n) for proper formatting
      const numberedTasks = cleanTasks
        .map((task, index) => `${index + 1}. ${task}`)
        .join('\n');
      
      return { 
        text: numberedTasks, 
        changed: true, 
        changes: [{ type: 'restructure', reason: 'Multi-task chunking with proper line breaks' }]
      };
    }
    
    return { text, changed: false, changes: [] };
  }
  
  // Final Grammar Cleanup
  function finalGrammarCleanup(text) {
    let result = text
      .replace(/\s+/g, ' ')                    // Normalize whitespace
      .replace(/\s*([,.!?;:])/g, '$1')        // Fix punctuation spacing
      .replace(/([,.!?;:])\s*([,.!?;:])/g, '$1') // Remove duplicate punctuation
      .replace(/^\s*[,.\s]+/, '')            // Remove leading punctuation
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
  
  // Advanced token estimation
  function estimateTokensAdvanced(text) {
    if (!text || text.trim() === '') return 0;
    
    let tokenCount = 0;
    const words = text.trim().split(/\s+/);
    
    words.forEach(word => {
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
    
    const punctuation = (text.match(/[.,!?;:()\-'"]/g) || []).length;
    tokenCount += punctuation * 0.25;
    
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
    console.log('📤 Sending enhanced text...');
    
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
    console.log('✅ Token Optimizer v4 Enhanced Quality System Ready! 🚀');
  }, 1000);
  
})();