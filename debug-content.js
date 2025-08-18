// Debug version - minimal functionality for testing
(function() {
  'use strict';
  
  console.log('🚀 Token Optimizer Debug Version Loading...');
  
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
  
  // Simple prompt interception
  function interceptPrompts() {
    console.log('Setting up prompt interception...');
    
    // More aggressive event listening to bypass CSP
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        
        if (activeElement && 
            (activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
          
          const text = activeElement.value || activeElement.textContent || activeElement.innerText;
          
          if (text && text.trim().length > 10) {
            console.log('🎯 Intercepted prompt:', text.substring(0, 50) + '...');
            
            // Prevent default submission for now
            e.preventDefault();
            e.stopPropagation();
            
            // Show simple alert instead of overlay
            showSimpleOverlay(text, activeElement);
          }
        }
      }
    }, true);
  }
  
  function showSimpleOverlay(originalText, inputElement) {
    // Remove existing overlay
    const existingOverlay = document.getElementById('token-optimizer-debug');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // Create simple overlay
    const overlay = document.createElement('div');
    overlay.id = 'token-optimizer-debug';
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 999999;
      max-width: 500px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    
    // Real optimization logic
    const optimizedText = optimizeText(originalText);
    const originalTokens = estimateTokens(originalText);
    const optimizedTokens = estimateTokens(optimizedText);
    const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
    
    overlay.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #1f2937;">🚀 Token Optimizer</h3>
      
      <div style="margin-bottom: 15px;">
        <strong>Original:</strong> ${originalText.length} chars, ${originalTokens} tokens<br>
        <strong>Optimized:</strong> ${optimizedText.length} chars, ${optimizedTokens} tokens<br>
        <strong>Saved:</strong> ${tokensSaved} tokens (${Math.round((tokensSaved/originalTokens)*100)}% reduction)
      </div>
      
      <div style="margin-bottom: 15px; padding: 10px; background: #f9fafb; border-radius: 4px;">
        <strong>Optimized prompt:</strong><br>
        <span style="color: #374151;">${optimizedText}</span>
      </div>
      
      <div style="display: flex; gap: 10px;">
        <button id="send-optimized" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Send Optimized
        </button>
        <button id="send-original" style="background: #6b7280; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Send Original
        </button>
        <button id="close-overlay" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Close
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add event listeners
    document.getElementById('send-optimized').onclick = () => {
      sendText(optimizedText, inputElement);
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
  
  function sendText(text, inputElement) {
    console.log('Sending text:', text.substring(0, 50) + '...');
    
    if (inputElement.tagName === 'TEXTAREA') {
      inputElement.value = text;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      inputElement.textContent = text;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Try to find and click send button with comprehensive selectors
    const button = findSendButton();
    if (button) {
      console.log('Found send button, clicking...');
      setTimeout(() => button.click(), 100);
    } else {
      console.log('No send button found - text placed in input');
    }
  }
  
  // Comprehensive send button detection for all LLM platforms
  function findSendButton() {
    const currentSite = window.location.hostname;
    
    // Site-specific selectors first (most reliable)
    const siteSpecificSelectors = {
      'chat.openai.com': [
        '[data-testid="send-button"]',
        'button[aria-label*="Send message"]',
        'button[data-testid*="send"]'
      ],
      'claude.ai': [
        'button[aria-label*="Send Message"]',
        'button[type="submit"]',
        'button:has(svg[data-icon="send"])'
      ],
      'gemini.google.com': [
        'button[aria-label*="Send message"]',
        'button[data-test-id*="send"]',
        'button:has(svg)'
      ],
      'lovable.io': [
        'button[type="submit"]',
        'button[aria-label*="Send"]'
      ]
    };
    
    // Try site-specific selectors first
    if (siteSpecificSelectors[currentSite]) {
      for (const selector of siteSpecificSelectors[currentSite]) {
        const button = document.querySelector(selector);
        if (button && !button.disabled && button.offsetParent !== null) {
          console.log(`Found send button using site-specific selector: ${selector}`);
          return button;
        }
      }
    }
    
    // Fallback to generic selectors
    const genericSelectors = [
      // Common data attributes
      'button[data-testid*="send"]',
      'button[data-test-id*="send"]',
      '[data-testid="send-button"]',
      '[data-testid*="send-message"]',
      
      // Aria labels
      'button[aria-label*="Send message"]',
      'button[aria-label*="Send Message"]',
      'button[aria-label*="send"]',
      'button[aria-label*="Submit"]',
      
      // Form submissions
      'button[type="submit"]',
      
      // Text-based detection
      'button:contains("Send")',
      'button:contains("Submit")',
      
      // SVG icon buttons (common pattern)
      'button:has(svg)',
      'button svg[data-icon*="send"]',
      'button svg[class*="send"]',
      
      // CSS class patterns
      'button[class*="send"]',
      'button[class*="submit"]',
      '.send-button',
      '.submit-button',
      
      // Role-based
      'button[role="button"]',
      
      // Generic fallbacks
      'form button:last-child',
      'button:not([disabled])'
    ];
    
    for (const selector of genericSelectors) {
      try {
        let buttons;
        
        if (selector.includes(':contains')) {
          // Handle :contains pseudo-selector manually
          const text = selector.match(/:contains\("(.+)"\)/)?.[1];
          buttons = Array.from(document.querySelectorAll('button')).filter(btn => 
            btn.textContent.toLowerCase().includes(text.toLowerCase())
          );
        } else {
          buttons = document.querySelectorAll(selector);
        }
        
        for (const button of buttons) {
          if (button && 
              !button.disabled && 
              button.offsetParent !== null &&
              button.getBoundingClientRect().width > 0) {
            
            // Additional validation - avoid navigation buttons
            const buttonText = button.textContent.toLowerCase();
            const skipPatterns = ['back', 'cancel', 'close', 'previous', 'next'];
            
            if (!skipPatterns.some(pattern => buttonText.includes(pattern))) {
              console.log(`Found send button using generic selector: ${selector}`);
              return button;
            }
          }
        }
      } catch (error) {
        // Skip invalid selectors
        continue;
      }
    }
    
    console.log('No send button found with any selector');
    return null;
  }
  
  // Real optimization function
  function optimizeText(text) {
    let optimized = text;
    
    // Step 1: Replace verbose phrases with concise alternatives (order matters - longest first!)
    const verbosePhrases = [
      // Complete sentence starters (longest phrases first to avoid partial matches)
      ['i would really like you to please help me', 'help me'],
      ['i would like you to please help me', 'help me'],
      ['could you please help me', 'help me'],
      ['can you please help me', 'help me'],
      ['i would like you to help me', 'help me'],
      ['i need you to help me', 'help me'],
      ['could you help me', 'help me'],
      ['can you help me', 'help me'],
      ['i would like you to', ''],
      ['i need you to', ''],
      
      // Verbose phrases (longest first)
      ['due to the fact that', 'because'],
      ['at this point in time', 'now'],
      ['with regard to', 'regarding'],
      ['for the purpose of', 'for'],
      ['in order to', 'to'],
      ['i need assistance with', 'help with'],
      
      // Request simplification
      ['would you like to', ''],
      ['could you please', ''],
      ['would you mind', ''],
      ['could you', ''],
      
      // Redundant qualifiers
      ['really very', 'very'],
      ['quite really', 'quite'],
      ['that basically', 'that'],
      ['that just', 'that'],
      ['that obviously', 'that']
    ];
    
    // Apply phrase replacements
    verbosePhrases.forEach(([verbose, concise]) => {
      const regex = new RegExp(verbose.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      optimized = optimized.replace(regex, concise);
    });
    
    // Step 2: Remove standalone filler words (safer after phrase processing)
    const safeFillers = [
      'basically', 'obviously', 'clearly', 'essentially', 'ultimately',
      'literally', 'actually', 'really', 'quite', 'very much',
      'just so', 'so very', 'pretty much'
    ];
    
    safeFillers.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      optimized = optimized.replace(regex, '');
    });
    
    // Step 3: Apply semantic chunking for multi-task prompts
    optimized = applySemanticChunking(optimized);
    
    // Step 4: Clean up and fix common issues
    optimized = optimized.replace(/\s+/g, ' ').trim(); // Normalize whitespace
    optimized = optimized.replace(/^[,.\s]+/, ''); // Remove leading punctuation
    optimized = optimized.replace(/\s+([,.!?])/g, '$1'); // Fix punctuation spacing
    
    // Fix duplicate words (common after phrase replacement)
    optimized = optimized.replace(/\b(\w+)\s+\1\b/gi, '$1');
    
    // Fix common grammar issues after optimization
    optimized = optimized.replace(/^[a-z]/, match => match.toUpperCase()); // Capitalize first letter
    optimized = optimized.replace(/\s+,/g, ','); // Fix comma spacing
    optimized = optimized.replace(/\s+\./g, '.'); // Fix period spacing
    
    return optimized;
  }
  
  // Semantic chunking helper function
  function applySemanticChunking(text) {
    // Detect multi-task prompts by looking for task connectors
    const taskConnectors = [
      'and also', 'also', 'additionally', 'furthermore', 'moreover',
      'then', 'next', 'after that', 'finally', 'lastly'
    ];
    
    let hasMultipleTasks = false;
    taskConnectors.forEach(connector => {
      if (text.toLowerCase().includes(connector)) {
        hasMultipleTasks = true;
      }
    });
    
    // If multiple tasks detected, convert to numbered list
    if (hasMultipleTasks && text.length > 100) {
      // More precise splitting that preserves sentence structure
      const tasks = text.split(/\s+(?:and also|also|additionally|furthermore|moreover|and then|then|next|after that|finally|lastly)\s+/i);
      
      if (tasks.length > 1 && tasks.length <= 6) {
        const numberedTasks = tasks
          .map(task => task.trim())
          .filter(task => task.length > 10) // Longer minimum to avoid fragments
          .map((task, index) => {
            // Clean up each task
            let cleanTask = task.replace(/^[,.\s]+/, ''); // Remove leading punctuation
            cleanTask = cleanTask.replace(/\s+/g, ' ').trim();
            return `${index + 1}. ${cleanTask}`;
          })
          .join('\n');
        
        console.log('Applied semantic chunking:', numberedTasks);
        return numberedTasks;
      }
    }
    
    return text;
  }
  
  // Simple token estimation
  function estimateTokens(text) {
    if (!text) return 0;
    
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    
    // Rough GPT tokenization estimate: ~1.3 tokens per word + character adjustment
    let tokens = Math.ceil(words * 1.3);
    tokens += Math.ceil(characters / 4) * 0.1;
    
    return Math.max(1, Math.round(tokens));
  }
  
  // Initialize after a short delay
  setTimeout(() => {
    interceptPrompts();
    console.log('✅ Token Optimizer Debug Ready!');
  }, 1000);
  
})();