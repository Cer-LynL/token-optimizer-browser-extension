class PromptOptimizer {
  static FILLER_WORDS = [
    'please', 'kindly', 'if you could', 'would you mind', 'i would like',
    'could you please', 'i was wondering', 'it would be great if',
    'thank you in advance', 'thanks in advance', 'i appreciate',
    'sorry to bother', 'excuse me', 'pardon me', 'forgive me',
    'just', 'simply', 'basically', 'actually', 'literally',
    'obviously', 'clearly', 'essentially', 'ultimately'
  ];

  static VERBOSE_PHRASES = {
    'in order to': 'to',
    'due to the fact that': 'because',
    'despite the fact that': 'although',
    'at this point in time': 'now',
    'for the purpose of': 'for',
    'with regard to': 'regarding',
    'in relation to': 'about',
    'as a matter of fact': '',
    'it is important to note that': '',
    'it should be noted that': '',
    'i want you to': '',
    'i need you to': '',
    'can you help me': '',
    'help me': '',
    'assist me': ''
  };

  static ABBREVIATIONS = {
    'artificial intelligence': 'AI',
    'machine learning': 'ML',
    'deep learning': 'DL',
    'natural language processing': 'NLP',
    'application programming interface': 'API',
    'user interface': 'UI',
    'user experience': 'UX',
    'database': 'DB',
    'software development kit': 'SDK',
    'integrated development environment': 'IDE',
    'version control system': 'VCS',
    'content management system': 'CMS',
    'customer relationship management': 'CRM',
    'search engine optimization': 'SEO',
    'frequently asked questions': 'FAQ',
    'hypertext markup language': 'HTML',
    'cascading style sheets': 'CSS',
    'javascript': 'JS',
    'application': 'app',
    'development': 'dev',
    'environment': 'env',
    'configuration': 'config',
    'documentation': 'docs',
    'repository': 'repo',
    'administrator': 'admin',
    'information': 'info',
    'professional': 'pro'
  };

  static optimize(originalText) {
    if (!originalText || originalText.trim() === '') {
      return {
        optimized: originalText,
        changes: [],
        stats: {
          originalLength: 0,
          optimizedLength: 0,
          reductionPercent: 0
        }
      };
    }

    let optimized = originalText.trim();
    const changes = [];

    optimized = this.removeConciseness(optimized, changes);
    optimized = this.applyAbbreviations(optimized, changes);
    optimized = this.trimContext(optimized, changes);
    optimized = this.semanticChunking(optimized, changes);
    optimized = this.patternSubstitutions(optimized, changes);

    const stats = {
      originalLength: originalText.length,
      optimizedLength: optimized.length,
      reductionPercent: Math.round(((originalText.length - optimized.length) / originalText.length) * 100)
    };

    return {
      optimized: optimized.trim(),
      changes,
      stats
    };
  }

  static removeConciseness(text, changes) {
    let result = text;
    
    this.FILLER_WORDS.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = result.match(regex);
      if (matches) {
        result = result.replace(regex, '');
        changes.push({
          type: 'filler_removal',
          description: `Removed filler word: "${filler}"`,
          count: matches.length
        });
      }
    });

    Object.entries(this.VERBOSE_PHRASES).forEach(([verbose, concise]) => {
      const regex = new RegExp(verbose.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = result.match(regex);
      if (matches) {
        result = result.replace(regex, concise);
        changes.push({
          type: 'phrase_simplification',
          description: `"${verbose}" → "${concise}"`,
          count: matches.length
        });
      }
    });

    result = result.replace(/\s+/g, ' ').trim();

    return result;
  }

  static applyAbbreviations(text, changes) {
    let result = text;
    
    Object.entries(this.ABBREVIATIONS).forEach(([full, abbr]) => {
      const regex = new RegExp(`\\b${full.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = result.match(regex);
      if (matches) {
        result = result.replace(regex, abbr);
        changes.push({
          type: 'abbreviation',
          description: `"${full}" → "${abbr}"`,
          count: matches.length
        });
      }
    });

    return result;
  }

  static trimContext(text, changes) {
    let result = text;
    
    const sentences = result.split(/[.!?]+/).filter(s => s.trim());
    
    if (sentences.length > 3) {
      const keywordSentences = sentences.filter(sentence => {
        const words = sentence.toLowerCase().split(/\s+/);
        return words.some(word => 
          ['help', 'create', 'write', 'generate', 'explain', 'analyze', 'summarize', 'translate'].includes(word)
        );
      });
      
      if (keywordSentences.length > 0 && keywordSentences.length < sentences.length) {
        result = keywordSentences.join('. ') + '.';
        changes.push({
          type: 'context_trimming',
          description: `Removed ${sentences.length - keywordSentences.length} non-essential sentences`,
          count: sentences.length - keywordSentences.length
        });
      }
    }

    const redundantPhrases = [
      /\b(as mentioned|as stated|as discussed) (before|earlier|above|previously)\b/gi,
      /\b(again|once more|repeat|reiterate)\b/gi,
      /\b(in conclusion|to summarize|in summary)\b/gi
    ];

    redundantPhrases.forEach(regex => {
      const matches = result.match(regex);
      if (matches) {
        result = result.replace(regex, '');
        changes.push({
          type: 'redundancy_removal',
          description: 'Removed redundant phrases',
          count: matches.length
        });
      }
    });

    return result.replace(/\s+/g, ' ').trim();
  }

  static semanticChunking(text, changes) {
    const tasks = text.split(/\b(?:and|also|additionally|furthermore|moreover)\b/i);
    
    if (tasks.length > 2) {
      const processedTasks = tasks
        .map(task => task.trim())
        .filter(task => task.length > 10)
        .map((task, index) => `${index + 1}. ${task}`)
        .join('\n');
      
      if (processedTasks !== text) {
        changes.push({
          type: 'semantic_chunking',
          description: `Split into ${tasks.length} numbered tasks`,
          count: 1
        });
        return processedTasks;
      }
    }
    
    return text;
  }

  static patternSubstitutions(text, changes) {
    let result = text;
    
    const patterns = [
      {
        regex: /[,;]\s*(?=[,;])/g,
        replacement: '',
        description: 'Removed duplicate punctuation'
      },
      {
        regex: /\s+([,.!?;:])/g,
        replacement: '$1',
        description: 'Fixed punctuation spacing'
      },
      {
        regex: /([,.!?;:])\s*\1+/g,
        replacement: '$1',
        description: 'Removed repeated punctuation'
      },
      {
        regex: /\n\s*\n\s*\n/g,
        replacement: '\n\n',
        description: 'Reduced excessive line breaks'
      },
      {
        regex: /\s{3,}/g,
        replacement: ' ',
        description: 'Normalized whitespace'
      }
    ];

    patterns.forEach(pattern => {
      const beforeLength = result.length;
      result = result.replace(pattern.regex, pattern.replacement);
      const afterLength = result.length;
      
      if (beforeLength !== afterLength) {
        changes.push({
          type: 'pattern_cleanup',
          description: pattern.description,
          count: 1
        });
      }
    });

    return result.trim();
  }

  static generateDiff(original, optimized) {
    const originalWords = original.split(/(\s+)/);
    const optimizedWords = optimized.split(/(\s+)/);
    
    const diff = [];
    let i = 0, j = 0;
    
    while (i < originalWords.length || j < optimizedWords.length) {
      if (i >= originalWords.length) {
        diff.push({ type: 'added', text: optimizedWords[j] });
        j++;
      } else if (j >= optimizedWords.length) {
        diff.push({ type: 'removed', text: originalWords[i] });
        i++;
      } else if (originalWords[i] === optimizedWords[j]) {
        diff.push({ type: 'unchanged', text: originalWords[i] });
        i++;
        j++;
      } else {
        diff.push({ type: 'removed', text: originalWords[i] });
        i++;
        if (j < optimizedWords.length) {
          diff.push({ type: 'added', text: optimizedWords[j] });
          j++;
        }
      }
    }
    
    return diff;
  }
}