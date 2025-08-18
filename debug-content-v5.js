// Token Optimizer v5 - Fixed All Test Cases Based on Analysis
(function() {
  'use strict';
  
  console.log('🚀 Token Optimizer v5 - All Test Cases Fixed System Loading...');
  
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
    console.log('Setting up v5 fixed prompt interception...');
    
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
            
            showFixedOverlay(text, activeElement);
          }
        }
      }
    }, true);
  }
  
  function showFixedOverlay(originalText, inputElement) {
    const existingOverlay = document.getElementById('token-optimizer-debug');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // Apply v5 fixed optimization
    const optimizationResult = fixedOptimizationV5(originalText);
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
      border: 2px solid #059669;
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
          🚀 Token Optimizer v5 
          <span style="background: #059669; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">All Tests Fixed</span>
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
          <div style="font-weight: 600; margin-bottom: 8px; color: #374151;">🔬 v5 Fixed Techniques:</div>
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
          <div style="background: #059669; color: white; padding: 8px; border-radius: 50%; font-size: 16px;">→</div>
        </div>
        
        <div>
          <div style="font-weight: 500; margin-bottom: 8px; color: #374151;">✨ Fixed Optimized Prompt</div>
          <div style="padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 13px; line-height: 1.4; max-height: 200px; overflow-y: auto;">
            ${escapeHtml(optimizationResult.text)}
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button id="send-original" style="background: #6b7280; color: white; border: none; padding: 12px 18px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          Send Original
        </button>
        <button id="send-optimized" style="background: #059669; color: white; border: none; padding: 12px 18px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
          Send Fixed (-${tokensSaved} tokens)
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
  
  // v5 Fixed Optimization System - Addresses All Test Case Failures
  function fixedOptimizationV5(text) {
    console.log('🔬 Applying v5 fixed optimization based on test analysis...');
    
    let optimized = text.trim();
    const appliedTechniques = new Set();
    const changes = [];
    
    console.log('📝 Input text:', optimized);
    
    // PASS 1: Fixed Request Pattern Removal (MUST BE FIRST)
    const requestResult = fixedRequestPatternRemoval(optimized);
    if (requestResult.changed) {
      optimized = requestResult.text;
      appliedTechniques.add('Fixed Request Pattern Removal');
      changes.push(...requestResult.changes);
      console.log('🔧 After request removal:', optimized);
    }
    
    // PASS 2: Fixed Duplicate Word Removal
    const duplicateResult = fixedDuplicateRemoval(optimized);
    if (duplicateResult.changed) {
      optimized = duplicateResult.text;
      appliedTechniques.add('Fixed Duplicate Word Removal');
      changes.push(...duplicateResult.changes);
      console.log('🔧 After duplicate removal:', optimized);
    }
    
    // PASS 3: Fixed Phrase Replacement (EXACT MATCHES)
    const phraseResult = fixedPhraseReplacement(optimized);
    if (phraseResult.changed) {
      optimized = phraseResult.text;
      appliedTechniques.add('Fixed Phrase Optimization');
      changes.push(...phraseResult.changes);
      console.log('🔧 After phrase replacement:', optimized);
    }
    
    // PASS 4: Fixed Filler Word Removal
    const fillerResult = fixedFillerRemoval(optimized);
    if (fillerResult.changed) {
      optimized = fillerResult.text;
      appliedTechniques.add('Fixed Filler Word Removal');
      changes.push(...fillerResult.changes);
      console.log('🔧 After filler removal:', optimized);
    }
    
    // PASS 5: Fixed Task Chunking (PROPER FORMAT)
    const chunkingResult = fixedTaskChunking(optimized);
    if (chunkingResult.changed) {
      optimized = chunkingResult.text;
      appliedTechniques.add('Fixed Task Chunking');
      changes.push(...chunkingResult.changes);
      console.log('🔧 After task chunking:', optimized);
    }
    
    // PASS 6: Fixed Final Cleanup
    optimized = fixedFinalCleanup(optimized);
    console.log('🔧 Final result:', optimized);
    
    console.log('✅ v5 Fixed optimization complete:', Array.from(appliedTechniques));
    
    return {
      text: optimized,
      appliedTechniques: appliedTechniques,
      changes: changes
    };
  }
  
  // FIXED TECHNIQUE 1: Request Pattern Removal (AGGRESSIVE)
  function fixedRequestPatternRemoval(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Most comprehensive request patterns (longest first)
    const patterns = [
      { pattern: /^i would really like you to please help me\s*/gi, replacement: 'Help me ', desc: 'Complex request opener' },
      { pattern: /^i would like you to please help me\s*/gi, replacement: 'Help me ', desc: 'Polite request opener' },
      { pattern: /^could you please help me\s*/gi, replacement: 'Help me ', desc: 'Modal request opener' },
      { pattern: /^can you please help me\s*/gi, replacement: 'Help me ', desc: 'Modal request opener' },
      { pattern: /^i would like you to please\s*/gi, replacement: '', desc: 'Request opener' },
      { pattern: /^could you please\s*/gi, replacement: '', desc: 'Modal request opener' },
      { pattern: /^would you please\s*/gi, replacement: '', desc: 'Modal request opener' },
      { pattern: /^can you please\s*/gi, replacement: '', desc: 'Modal request opener' },
      { pattern: /^i would like you to\s*/gi, replacement: '', desc: 'Request opener' },
      { pattern: /^i need you to\s*/gi, replacement: '', desc: 'Request opener' },
      { pattern: /^could you\s*/gi, replacement: '', desc: 'Simple request opener' },
      { pattern: /^can you\s*/gi, replacement: '', desc: 'Simple request opener' },
      { pattern: /^would you\s*/gi, replacement: '', desc: 'Simple request opener' },
      
      // Mid-sentence patterns
      { pattern: /\s+and\s+could you please/gi, replacement: ' and', desc: 'Mid-sentence request' },
      { pattern: /\s+also\s+could you please/gi, replacement: ' also', desc: 'Mid-sentence request' },
      { pattern: /\s+could you please/gi, replacement: '', desc: 'Mid-sentence request' }
    ];
    
    patterns.forEach(({ pattern, replacement, desc }) => {
      if (pattern.test(result)) {
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
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // FIXED TECHNIQUE 2: Duplicate Word Removal (COMPREHENSIVE)
  function fixedDuplicateRemoval(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Pattern 1: Immediate duplicates (word word)
    const duplicatePattern = /\b(\w+)\s+\1\b/gi;
    while (duplicatePattern.test(result)) {
      const matches = [...result.matchAll(/\b(\w+)\s+\1\b/gi)];
      if (matches.length > 0) {
        matches.forEach(match => {
          changes.push({ 
            type: 'remove', 
            text: match[0], 
            reason: `Duplicate: "${match[1]} ${match[1]}" → "${match[1]}"` 
          });
        });
        result = result.replace(/\b(\w+)\s+\1\b/gi, '$1');
        hasChanges = true;
      } else {
        break;
      }
    }
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // FIXED TECHNIQUE 3: Phrase Replacement (EXACT ORDER)
  function fixedPhraseReplacement(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    // Fixed phrases (longest first, case insensitive)
    const phrases = [
      { pattern: /\bat this point in time\b/gi, replacement: 'now', desc: '"at this point in time" → "now"' },
      { pattern: /\bdue to the fact that\b/gi, replacement: 'because', desc: '"due to the fact that" → "because"' },
      { pattern: /\bit should be noted that\b/gi, replacement: '', desc: 'Meta-commentary removal' },
      { pattern: /\bas you can see\b/gi, replacement: '', desc: 'Meta-reference removal' },
      { pattern: /\bi think\b/gi, replacement: '', desc: 'Opinion marker removal' },
      { pattern: /\bi believe\b/gi, replacement: '', desc: 'Opinion marker removal' },
      { pattern: /\bwith regard to\b/gi, replacement: 'regarding', desc: '"with regard to" → "regarding"' },
      { pattern: /\bin order to\b/gi, replacement: 'to', desc: '"in order to" → "to"' },
      { pattern: /\bfor the purpose of\b/gi, replacement: 'for', desc: '"for the purpose of" → "for"' }
    ];
    
    phrases.forEach(({ pattern, replacement, desc }) => {
      if (pattern.test(result)) {
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
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // FIXED TECHNIQUE 4: Filler Word Removal (PRECISE)
  function fixedFillerRemoval(text) {
    let result = text;
    const changes = [];
    let hasChanges = false;
    
    const fillers = [
      'basically', 'obviously', 'clearly', 'essentially', 'ultimately',
      'literally', 'actually', 'really', 'very', 'quite', 'just', 'simply'
    ];
    
    fillers.forEach(filler => {
      const pattern = new RegExp(`\\b${filler}\\b\\s*`, 'gi');
      if (pattern.test(result)) {
        const matches = [...result.matchAll(pattern)];
        if (matches.length > 0) {
          matches.forEach(match => {
            changes.push({ 
              type: 'remove', 
              text: match[0], 
              reason: `Filler word: "${filler}"` 
            });
          });
          result = result.replace(pattern, '');
          hasChanges = true;
        }
      }
    });
    
    return { text: result, changed: hasChanges, changes };
  }
  
  // FIXED TECHNIQUE 5: Task Chunking (PROPER LINE BREAKS)
  function fixedTaskChunking(text) {
    if (text.length < 60) {
      return { text, changed: false, changes: [] };
    }
    
    // Look for task coordination patterns
    const taskConnectors = /\s+(and also|also|and then|then|additionally|furthermore|moreover|finally|lastly)\s+/gi;
    
    if (!taskConnectors.test(text)) {
      return { text, changed: false, changes: [] };
    }
    
    // Split on coordinators
    const parts = text.split(taskConnectors);
    
    const cleanTasks = [];
    for (let i = 0; i < parts.length; i += 2) { // Skip connectors
      const part = parts[i];
      if (part && part.trim().length > 15) {
        let cleanTask = part.trim()
          .replace(/^[,.\s]+/, '')
          .replace(/\s+/g, ' ');
        cleanTasks.push(cleanTask);
      }
    }
    
    if (cleanTasks.length >= 2 && cleanTasks.length <= 5) {
      // Create proper numbered list with actual line breaks
      const numberedTasks = cleanTasks
        .map((task, index) => `${index + 1}. ${task}`)
        .join('\n'); // Real line break, not \\n
      
      return { 
        text: numberedTasks, 
        changed: true, 
        changes: [{ type: 'restructure', reason: 'Multi-task chunking with line breaks' }]
      };
    }
    
    return { text, changed: false, changes: [] };
  }
  
  // FIXED TECHNIQUE 6: Final Cleanup (COMPREHENSIVE)
  function fixedFinalCleanup(text) {
    let result = text
      .replace(/\s+/g, ' ')                     // Normalize whitespace
      .replace(/\s*([,.!?;:])/g, '$1')         // Fix punctuation spacing
      .replace(/([,.!?;:])\s*([,.!?;:])/g, '$1') // Remove duplicate punctuation
      .replace(/^\s*[,.\s]+/, '')              // Remove leading punctuation
      .replace(/\s*$/, '')                     // Remove trailing whitespace
      .trim();
    
    // Fix capitalization
    if (result && /^[a-z]/.test(result)) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    
    // Fix common grammar issues after optimization
    result = result
      .replace(/\s+to\s+to\s+/gi, ' to ')      // Fix "to to"
      .replace(/\s+and\s+and\s+/gi, ' and ')   // Fix "and and"
      .replace(/\s+with\s+with\s+/gi, ' with ') // Fix "with with"
      .replace(/\s{2,}/g, ' ');                // Multiple spaces
    
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
    console.log('📤 Sending fixed text...');
    
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
    console.log('✅ Token Optimizer v5 - All Test Cases Fixed System Ready! 🚀');
  }, 1000);
  
})();