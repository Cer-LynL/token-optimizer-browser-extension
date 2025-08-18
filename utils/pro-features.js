class ProFeatures {
  constructor() {
    this.templates = this.loadTemplates();
  }

  loadTemplates() {
    return {
      email: {
        name: 'Email Writing',
        description: 'Professional email composition',
        template: 'Subject: {subject}\n\nDear {recipient},\n\n{main_content}\n\n{closing}\n\nBest regards,\n{sender}',
        variables: ['subject', 'recipient', 'main_content', 'closing', 'sender'],
        category: 'communication'
      },
      code: {
        name: 'Code Review',
        description: 'Code analysis and review prompts',
        template: 'Review the following {language} code for:\n- Code quality and best practices\n- Security vulnerabilities\n- Performance optimizations\n- Documentation completeness\n\nCode:\n```{language}\n{code}\n```\n\nFocus areas: {focus_areas}',
        variables: ['language', 'code', 'focus_areas'],
        category: 'development'
      },
      analysis: {
        name: 'Data Analysis',
        description: 'Data analysis and insights',
        template: 'Analyze the following data:\n\nDataset: {dataset_description}\nObjective: {analysis_objective}\nKey metrics: {key_metrics}\n\nProvide insights on:\n1. Key patterns and trends\n2. Statistical significance\n3. Business implications\n4. Recommended actions\n\nData format: {data_format}',
        variables: ['dataset_description', 'analysis_objective', 'key_metrics', 'data_format'],
        category: 'analytics'
      },
      creative: {
        name: 'Creative Writing',
        description: 'Creative content generation',
        template: 'Create a {content_type} with the following specifications:\n\nTopic/Theme: {theme}\nTone: {tone}\nTarget audience: {audience}\nLength: {length}\nStyle: {style}\n\nKey elements to include:\n{key_elements}\n\nConstraints or requirements:\n{constraints}',
        variables: ['content_type', 'theme', 'tone', 'audience', 'length', 'style', 'key_elements', 'constraints'],
        category: 'creative'
      },
      research: {
        name: 'Research Summary',
        description: 'Research and information synthesis',
        template: 'Research and summarize information about: {topic}\n\nScope: {scope}\nPerspectives to cover: {perspectives}\nDepth level: {depth}\nTarget format: {format}\n\nPlease include:\n- Executive summary\n- Key findings\n- Supporting evidence\n- Limitations\n- Conclusion\n\nSources to prioritize: {source_types}',
        variables: ['topic', 'scope', 'perspectives', 'depth', 'format', 'source_types'],
        category: 'research'
      },
      translation: {
        name: 'Translation',
        description: 'Language translation with context',
        template: 'Translate the following text from {source_language} to {target_language}:\n\n"{original_text}"\n\nContext: {context}\nTone: {tone}\nTarget audience: {target_audience}\nSpecial requirements: {requirements}\n\nProvide:\n1. Direct translation\n2. Cultural adaptation (if needed)\n3. Alternative phrasings\n4. Explanation of key choices',
        variables: ['source_language', 'target_language', 'original_text', 'context', 'tone', 'target_audience', 'requirements'],
        category: 'language'
      },
      meeting: {
        name: 'Meeting Summary',
        description: 'Meeting notes and action items',
        template: 'Meeting Summary\n\nDate: {date}\nAttendees: {attendees}\nPurpose: {purpose}\n\nKey Discussion Points:\n{discussion_points}\n\nDecisions Made:\n{decisions}\n\nAction Items:\n{action_items}\n\nNext Steps:\n{next_steps}\n\nFollow-up Date: {follow_up}',
        variables: ['date', 'attendees', 'purpose', 'discussion_points', 'decisions', 'action_items', 'next_steps', 'follow_up'],
        category: 'productivity'
      }
    };
  }

  async paraphraseText(originalText, options = {}) {
    const { tone = 'neutral', formality = 'balanced', style = 'clear' } = options;
    
    try {
      const paraphrasedText = await this.performParaphrasing(originalText, { tone, formality, style });
      
      return {
        success: true,
        paraphrased: paraphrasedText,
        changes: this.analyzeParaphrasingChanges(originalText, paraphrasedText),
        metadata: { tone, formality, style }
      };
    } catch (error) {
      console.error('Paraphrasing failed:', error);
      return {
        success: false,
        error: error.message,
        fallback: originalText
      };
    }
  }

  async performParaphrasing(text, options) {
    const { tone, formality, style } = options;
    
    let paraphrased = text;
    
    paraphrased = this.adjustTone(paraphrased, tone);
    paraphrased = this.adjustFormality(paraphrased, formality);
    paraphrased = this.adjustStyle(paraphrased, style);
    
    return paraphrased;
  }

  adjustTone(text, tone) {
    const tonePatterns = {
      formal: {
        replacements: {
          "don't": "do not",
          "can't": "cannot",
          "won't": "will not",
          "it's": "it is",
          "we're": "we are",
          "you're": "you are",
          "I'd like": "I would appreciate",
          "thanks": "thank you",
          "hi": "greetings",
          "hey": "hello"
        },
        additions: ["Please", "Kindly", "I would appreciate if"]
      },
      casual: {
        replacements: {
          "do not": "don't",
          "cannot": "can't",
          "will not": "won't",
          "it is": "it's",
          "we are": "we're",
          "you are": "you're",
          "I would appreciate": "I'd like",
          "thank you": "thanks",
          "greetings": "hi",
          "hello": "hey"
        }
      },
      friendly: {
        additions: ["Hope you're doing well!", "Looking forward to", "Thanks so much"]
      },
      technical: {
        style: "precise",
        avoid: ["maybe", "might", "perhaps", "I think"]
      }
    };
    
    const pattern = tonePatterns[tone];
    if (!pattern) return text;
    
    let result = text;
    
    if (pattern.replacements) {
      Object.entries(pattern.replacements).forEach(([from, to]) => {
        const regex = new RegExp(`\\b${from}\\b`, 'gi');
        result = result.replace(regex, to);
      });
    }
    
    return result;
  }

  adjustFormality(text, formality) {
    if (formality === 'formal') {
      let result = text;
      
      result = result.replace(/\b(gonna|wanna|gotta)\b/gi, (match) => {
        const replacements = {
          'gonna': 'going to',
          'wanna': 'want to',
          'gotta': 'have to'
        };
        return replacements[match.toLowerCase()] || match;
      });
      
      result = result.replace(/\s+/g, ' ');
      
      return result;
    }
    
    return text;
  }

  adjustStyle(text, style) {
    if (style === 'concise') {
      let result = text;
      
      const fillerWords = ['really', 'very', 'quite', 'rather', 'pretty', 'sort of', 'kind of'];
      fillerWords.forEach(word => {
        const regex = new RegExp(`\\s*\\b${word}\\b\\s*`, 'gi');
        result = result.replace(regex, ' ');
      });
      
      result = result.replace(/\s+/g, ' ').trim();
      
      return result;
    }
    
    return text;
  }

  analyzeParaphrasingChanges(original, paraphrased) {
    const changes = [];
    
    const originalWords = original.toLowerCase().split(/\s+/);
    const paraphrasedWords = paraphrased.toLowerCase().split(/\s+/);
    
    if (originalWords.length !== paraphrasedWords.length) {
      changes.push({
        type: 'length_change',
        description: `Word count changed from ${originalWords.length} to ${paraphrasedWords.length}`
      });
    }
    
    const vocabularyChanges = this.findVocabularyChanges(originalWords, paraphrasedWords);
    if (vocabularyChanges.length > 0) {
      changes.push({
        type: 'vocabulary',
        description: `${vocabularyChanges.length} vocabulary improvements`,
        details: vocabularyChanges
      });
    }
    
    return changes;
  }

  findVocabularyChanges(originalWords, paraphrasedWords) {
    const changes = [];
    
    const originalSet = new Set(originalWords);
    const paraphrasedSet = new Set(paraphrasedWords);
    
    const removed = [...originalSet].filter(word => !paraphrasedSet.has(word));
    const added = [...paraphrasedSet].filter(word => !originalSet.has(word));
    
    for (let i = 0; i < Math.min(removed.length, added.length); i++) {
      changes.push({
        from: removed[i],
        to: added[i],
        type: 'substitution'
      });
    }
    
    return changes;
  }

  getTemplate(templateId) {
    return this.templates[templateId] || null;
  }

  getAllTemplates() {
    return Object.entries(this.templates).map(([id, template]) => ({
      id,
      ...template
    }));
  }

  getTemplatesByCategory(category) {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  applyTemplate(templateId, variables = {}) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }
    
    let result = template.template;
    
    template.variables.forEach(variable => {
      const value = variables[variable] || `{${variable}}`;
      const regex = new RegExp(`\\{${variable}\\}`, 'g');
      result = result.replace(regex, value);
    });
    
    return {
      prompt: result,
      template: template,
      missingVariables: template.variables.filter(v => !variables[v])
    };
  }

  async summarizeConversation(messages, options = {}) {
    const { maxLength = 500, focus = 'key_points', includeContext = true } = options;
    
    if (!messages || messages.length === 0) {
      return {
        success: false,
        error: 'No messages to summarize'
      };
    }
    
    try {
      const summary = await this.performSummarization(messages, { maxLength, focus, includeContext });
      
      return {
        success: true,
        summary,
        originalLength: this.calculateTotalLength(messages),
        summaryLength: summary.length,
        compressionRatio: Math.round((1 - summary.length / this.calculateTotalLength(messages)) * 100)
      };
    } catch (error) {
      console.error('Summarization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async performSummarization(messages, options) {
    const { maxLength, focus, includeContext } = options;
    
    let summary = '';
    
    if (includeContext && messages.length > 0) {
      summary += `Context: ${messages[0].content.substring(0, 100)}...\n\n`;
    }
    
    if (focus === 'key_points') {
      summary += this.extractKeyPoints(messages);
    } else if (focus === 'decisions') {
      summary += this.extractDecisions(messages);
    } else if (focus === 'action_items') {
      summary += this.extractActionItems(messages);
    } else {
      summary += this.createGeneralSummary(messages);
    }
    
    if (summary.length > maxLength) {
      summary = this.truncateToLength(summary, maxLength);
    }
    
    return summary;
  }

  extractKeyPoints(messages) {
    const keyPoints = [];
    
    messages.forEach((message, index) => {
      if (message.content && message.content.length > 50) {
        const sentences = message.content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        const importantSentences = sentences.filter(sentence => 
          sentence.toLowerCase().includes('important') ||
          sentence.toLowerCase().includes('key') ||
          sentence.toLowerCase().includes('main') ||
          sentence.toLowerCase().includes('significant')
        );
        
        keyPoints.push(...importantSentences.slice(0, 2));
      }
    });
    
    return keyPoints.length > 0 ? 
      'Key Points:\n' + keyPoints.map(point => `• ${point.trim()}`).join('\n') :
      'No specific key points identified.';
  }

  extractDecisions(messages) {
    const decisions = [];
    
    messages.forEach(message => {
      if (message.content) {
        const decisionIndicators = [
          /decided to .+/gi,
          /we will .+/gi,
          /agreed that .+/gi,
          /conclusion is .+/gi
        ];
        
        decisionIndicators.forEach(regex => {
          const matches = message.content.match(regex);
          if (matches) {
            decisions.push(...matches.slice(0, 2));
          }
        });
      }
    });
    
    return decisions.length > 0 ?
      'Decisions Made:\n' + decisions.map(decision => `• ${decision.trim()}`).join('\n') :
      'No explicit decisions found.';
  }

  extractActionItems(messages) {
    const actions = [];
    
    messages.forEach(message => {
      if (message.content) {
        const actionIndicators = [
          /need to .+/gi,
          /should .+/gi,
          /must .+/gi,
          /will .+ by .+/gi,
          /action item.+/gi
        ];
        
        actionIndicators.forEach(regex => {
          const matches = message.content.match(regex);
          if (matches) {
            actions.push(...matches.slice(0, 2));
          }
        });
      }
    });
    
    return actions.length > 0 ?
      'Action Items:\n' + actions.map(action => `• ${action.trim()}`).join('\n') :
      'No action items identified.';
  }

  createGeneralSummary(messages) {
    if (messages.length === 0) return 'No messages to summarize.';
    
    const firstMessage = messages[0].content.substring(0, 200);
    const lastMessage = messages[messages.length - 1].content.substring(0, 200);
    const messageCount = messages.length;
    
    return `Conversation Summary (${messageCount} messages):\n\nStarted with: ${firstMessage}${firstMessage.length >= 200 ? '...' : ''}\n\nEnded with: ${lastMessage}${lastMessage.length >= 200 ? '...' : ''}`;
  }

  calculateTotalLength(messages) {
    return messages.reduce((total, message) => total + (message.content?.length || 0), 0);
  }

  truncateToLength(text, maxLength) {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength - 3);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );
    
    if (lastSentenceEnd > maxLength * 0.5) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }
    
    return truncated + '...';
  }

  validateProAccess() {
    return ExtensionStorage.getSettings().then(settings => settings.isPro);
  }
}