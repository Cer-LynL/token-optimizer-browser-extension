class SensitiveDataDetector {
  constructor() {
    this.patterns = this.initializePatterns();
    this.customKeywords = [];
  }

  initializePatterns() {
    return {
      // Personal Identifiable Information (PII)
      email: {
        regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        severity: 'medium',
        category: 'contact',
        description: 'Email addresses'
      },
      
      phone: {
        regex: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
        severity: 'medium',
        category: 'contact',
        description: 'Phone numbers'
      },
      
      ssn: {
        regex: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
        severity: 'high',
        category: 'identity',
        description: 'Social Security Numbers'
      },
      
      creditCard: {
        regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
        severity: 'critical',
        category: 'financial',
        description: 'Credit card numbers'
      },
      
      // Financial Information
      bankAccount: {
        regex: /\b[0-9]{8,17}\b/g,
        severity: 'high',
        category: 'financial',
        description: 'Bank account numbers',
        context: ['account', 'routing', 'bank']
      },
      
      routingNumber: {
        regex: /\b[0-9]{9}\b/g,
        severity: 'high',
        category: 'financial',
        description: 'Bank routing numbers',
        context: ['routing', 'bank', 'aba']
      },
      
      // Identity Documents
      passport: {
        regex: /\b[A-Z]{1,2}[0-9]{6,9}\b/g,
        severity: 'high',
        category: 'identity',
        description: 'Passport numbers',
        context: ['passport']
      },
      
      driverLicense: {
        regex: /\b[A-Z]{1,2}[0-9]{6,12}\b/g,
        severity: 'high',
        category: 'identity',
        description: 'Driver license numbers',
        context: ['license', 'dl', 'driver']
      },
      
      // IP Addresses
      ipAddress: {
        regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
        severity: 'low',
        category: 'technical',
        description: 'IP addresses'
      },
      
      // API Keys and Tokens
      apiKey: {
        regex: /(?:api[_-]?key|token|secret)["\s:=]+["']?([a-zA-Z0-9_-]{16,})/gi,
        severity: 'critical',
        category: 'security',
        description: 'API keys or tokens'
      },
      
      awsKey: {
        regex: /AKIA[0-9A-Z]{16}/g,
        severity: 'critical',
        category: 'security',
        description: 'AWS access keys'
      },
      
      githubToken: {
        regex: /gh[ps]_[A-Za-z0-9_]{36}/g,
        severity: 'critical',
        category: 'security',
        description: 'GitHub personal access tokens'
      },
      
      // Passwords
      password: {
        regex: /(?:password|pwd|pass)["\s:=]+["']?([^\s"']{6,})/gi,
        severity: 'critical',
        category: 'security',
        description: 'Passwords'
      },
      
      // Medical Information
      medicalId: {
        regex: /\b[0-9]{10,15}\b/g,
        severity: 'high',
        category: 'medical',
        description: 'Medical ID numbers',
        context: ['medical', 'patient', 'mrn', 'health']
      },
      
      // Addresses
      address: {
        regex: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct)\b/gi,
        severity: 'medium',
        category: 'location',
        description: 'Physical addresses'
      }
    };
  }

  async loadCustomKeywords() {
    try {
      const settings = await ExtensionStorage.getSettings();
      this.customKeywords = settings.customKeywords || [];
    } catch (error) {
      console.warn('Failed to load custom keywords:', error);
      this.customKeywords = [];
    }
  }

  async detectSensitiveData(text) {
    if (!text || text.trim() === '') {
      return { findings: [], riskLevel: 'none', safe: true };
    }

    await this.loadCustomKeywords();

    const findings = [];
    
    // Check against built-in patterns
    Object.entries(this.patterns).forEach(([type, pattern]) => {
      const matches = this.findMatches(text, pattern, type);
      findings.push(...matches);
    });

    // Check against custom keywords
    const customFindings = this.checkCustomKeywords(text);
    findings.push(...customFindings);

    const riskLevel = this.calculateRiskLevel(findings);
    const recommendations = this.generateRecommendations(findings);

    return {
      findings,
      riskLevel,
      safe: riskLevel === 'none' || riskLevel === 'low',
      summary: this.generateSummary(findings),
      recommendations,
      stats: this.generateStats(findings)
    };
  }

  findMatches(text, pattern, type) {
    const matches = [];
    let match;

    while ((match = pattern.regex.exec(text)) !== null) {
      const matchText = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + matchText.length;
      
      // Get context around the match
      const contextStart = Math.max(0, startIndex - 20);
      const contextEnd = Math.min(text.length, endIndex + 20);
      const context = text.substring(contextStart, contextEnd);
      
      // Validate context if pattern has context requirements
      if (pattern.context && !this.validateContext(context, pattern.context)) {
        continue;
      }

      // Additional validation for specific patterns
      if (type === 'creditCard' && !this.validateCreditCard(matchText)) {
        continue;
      }

      if (type === 'ssn' && !this.validateSSN(matchText)) {
        continue;
      }

      matches.push({
        type,
        match: matchText,
        severity: pattern.severity,
        category: pattern.category,
        description: pattern.description,
        startIndex,
        endIndex,
        context: context,
        maskedValue: this.maskValue(matchText, type)
      });
    }

    // Reset regex lastIndex
    pattern.regex.lastIndex = 0;
    
    return matches;
  }

  validateContext(context, requiredTerms) {
    const lowerContext = context.toLowerCase();
    return requiredTerms.some(term => lowerContext.includes(term.toLowerCase()));
  }

  validateCreditCard(cardNumber) {
    const digits = cardNumber.replace(/\s|-/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let alternate = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      
      sum += digit;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }

  validateSSN(ssn) {
    const digits = ssn.replace(/-/g, '');
    
    if (digits.length !== 9) {
      return false;
    }

    // Check for invalid patterns
    const invalidPatterns = [
      '000000000', '111111111', '222222222', '333333333', '444444444',
      '555555555', '666666666', '777777777', '888888888', '999999999',
      '123456789'
    ];

    return !invalidPatterns.includes(digits);
  }

  checkCustomKeywords(text) {
    const findings = [];
    const lowerText = text.toLowerCase();

    this.customKeywords.forEach(keyword => {
      if (typeof keyword === 'string' && lowerText.includes(keyword.toLowerCase())) {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          findings.push({
            type: 'custom',
            match: match[0],
            severity: 'medium',
            category: 'custom',
            description: 'Custom sensitive keyword',
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            context: text.substring(
              Math.max(0, match.index - 20),
              Math.min(text.length, match.index + match[0].length + 20)
            ),
            maskedValue: this.maskValue(match[0], 'custom')
          });
        }
        
        regex.lastIndex = 0;
      }
    });

    return findings;
  }

  maskValue(value, type) {
    switch (type) {
      case 'email':
        const [local, domain] = value.split('@');
        return local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1) + '@' + domain;
      
      case 'phone':
        return value.replace(/\d(?=\d{4})/g, '*');
      
      case 'creditCard':
        return '*'.repeat(value.length - 4) + value.slice(-4);
      
      case 'ssn':
        return '***-**-' + value.slice(-4);
      
      case 'apiKey':
      case 'password':
        return '*'.repeat(Math.min(value.length, 12));
      
      default:
        if (value.length <= 4) {
          return '*'.repeat(value.length);
        }
        return value.charAt(0) + '*'.repeat(value.length - 2) + value.charAt(value.length - 1);
    }
  }

  calculateRiskLevel(findings) {
    if (findings.length === 0) return 'none';

    const hasCritical = findings.some(f => f.severity === 'critical');
    const hasHigh = findings.some(f => f.severity === 'high');
    const hasMedium = findings.some(f => f.severity === 'medium');

    if (hasCritical) return 'critical';
    if (hasHigh) return 'high';
    if (hasMedium) return 'medium';
    return 'low';
  }

  generateSummary(findings) {
    if (findings.length === 0) {
      return 'No sensitive data detected.';
    }

    const categories = {};
    findings.forEach(finding => {
      categories[finding.category] = (categories[finding.category] || 0) + 1;
    });

    const categoryText = Object.entries(categories)
      .map(([category, count]) => `${count} ${category} item${count > 1 ? 's' : ''}`)
      .join(', ');

    return `Found ${findings.length} sensitive data item${findings.length > 1 ? 's' : ''}: ${categoryText}`;
  }

  generateRecommendations(findings) {
    const recommendations = [];

    if (findings.length === 0) {
      return ['Your prompt appears safe to submit.'];
    }

    const severityGroups = findings.reduce((groups, finding) => {
      groups[finding.severity] = groups[finding.severity] || [];
      groups[finding.severity].push(finding);
      return groups;
    }, {});

    if (severityGroups.critical) {
      recommendations.push('🚨 CRITICAL: Remove all passwords, API keys, and authentication tokens before submitting.');
    }

    if (severityGroups.high) {
      recommendations.push('⚠️ HIGH RISK: Consider removing or masking personal identifiers like SSNs, financial account numbers, and ID numbers.');
    }

    if (severityGroups.medium) {
      recommendations.push('⚡ MEDIUM RISK: Consider whether email addresses, phone numbers, and personal details are necessary for your query.');
    }

    if (severityGroups.low) {
      recommendations.push('💡 LOW RISK: Technical details like IP addresses detected. Usually safe but consider privacy implications.');
    }

    recommendations.push('✏️ TIP: You can use placeholder values like [EMAIL], [PHONE], or [ACCOUNT_NUMBER] instead.');

    return recommendations;
  }

  generateStats(findings) {
    return {
      total: findings.length,
      bySeverity: findings.reduce((stats, finding) => {
        stats[finding.severity] = (stats[finding.severity] || 0) + 1;
        return stats;
      }, {}),
      byCategory: findings.reduce((stats, finding) => {
        stats[finding.category] = (stats[finding.category] || 0) + 1;
        return stats;
      }, {}),
      uniqueTypes: [...new Set(findings.map(f => f.type))].length
    };
  }

  async addCustomKeyword(keyword) {
    if (!keyword || typeof keyword !== 'string') {
      throw new Error('Invalid keyword');
    }

    await this.loadCustomKeywords();
    
    if (!this.customKeywords.includes(keyword)) {
      this.customKeywords.push(keyword);
      await ExtensionStorage.updateSettings({
        customKeywords: this.customKeywords
      });
    }
  }

  async removeCustomKeyword(keyword) {
    await this.loadCustomKeywords();
    
    const index = this.customKeywords.indexOf(keyword);
    if (index > -1) {
      this.customKeywords.splice(index, 1);
      await ExtensionStorage.updateSettings({
        customKeywords: this.customKeywords
      });
    }
  }

  async getCustomKeywords() {
    await this.loadCustomKeywords();
    return [...this.customKeywords];
  }

  getSupportedCategories() {
    const categories = new Set();
    Object.values(this.patterns).forEach(pattern => {
      categories.add(pattern.category);
    });
    return Array.from(categories);
  }

  getSeverityColors() {
    return {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#d97706',
      low: '#65a30d',
      none: '#059669'
    };
  }

  formatFindings(findings) {
    return findings.map(finding => ({
      ...finding,
      displayText: `${finding.description}: ${finding.maskedValue}`,
      severityColor: this.getSeverityColors()[finding.severity]
    }));
  }
}