class Analytics {
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      optimizationsThisSession: 0,
      tokensProcessedThisSession: 0,
      tokensSavedThisSession: 0
    };
  }

  async recordOptimization(originalTokens, optimizedTokens, service, model) {
    const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
    
    // Update session data
    this.sessionData.optimizationsThisSession++;
    this.sessionData.tokensProcessedThisSession += originalTokens;
    this.sessionData.tokensSavedThisSession += tokensSaved;

    // Update persistent analytics
    const settings = await ExtensionStorage.getSettings();
    const analytics = settings.analytics || {};
    
    const updatedAnalytics = {
      ...analytics,
      totalTokensSaved: (analytics.totalTokensSaved || 0) + tokensSaved,
      optimizationsCount: (analytics.optimizationsCount || 0) + 1,
      totalTokensProcessed: (analytics.totalTokensProcessed || 0) + originalTokens,
      lastOptimization: Date.now(),
      
      // Service-specific stats
      serviceStats: {
        ...analytics.serviceStats,
        [service]: {
          ...((analytics.serviceStats && analytics.serviceStats[service]) || {}),
          optimizations: ((analytics.serviceStats && analytics.serviceStats[service] && analytics.serviceStats[service].optimizations) || 0) + 1,
          tokensSaved: ((analytics.serviceStats && analytics.serviceStats[service] && analytics.serviceStats[service].tokensSaved) || 0) + tokensSaved,
          tokensProcessed: ((analytics.serviceStats && analytics.serviceStats[service] && analytics.serviceStats[service].tokensProcessed) || 0) + originalTokens
        }
      },
      
      // Model-specific stats
      modelStats: {
        ...analytics.modelStats,
        [model]: {
          ...((analytics.modelStats && analytics.modelStats[model]) || {}),
          optimizations: ((analytics.modelStats && analytics.modelStats[model] && analytics.modelStats[model].optimizations) || 0) + 1,
          tokensSaved: ((analytics.modelStats && analytics.modelStats[model] && analytics.modelStats[model].tokensSaved) || 0) + tokensSaved,
          tokensProcessed: ((analytics.modelStats && analytics.modelStats[model] && analytics.modelStats[model].tokensProcessed) || 0) + originalTokens
        }
      }
    };

    await ExtensionStorage.updateSettings({ analytics: updatedAnalytics });
    
    return {
      sessionSavings: this.sessionData.tokensSavedThisSession,
      totalSavings: updatedAnalytics.totalTokensSaved,
      optimizationRate: this.calculateOptimizationRate(originalTokens, optimizedTokens)
    };
  }

  async recordSensitiveDataDetection(findings, severity) {
    const settings = await ExtensionStorage.getSettings();
    const analytics = settings.analytics || {};
    
    const updatedAnalytics = {
      ...analytics,
      sensitiveDataDetections: {
        ...analytics.sensitiveDataDetections,
        total: (analytics.sensitiveDataDetections?.total || 0) + 1,
        [severity]: (analytics.sensitiveDataDetections?.[severity] || 0) + 1,
        lastDetection: Date.now(),
        categoriesFound: {
          ...analytics.sensitiveDataDetections?.categoriesFound,
          ...findings.reduce((acc, finding) => {
            acc[finding.category] = (acc[finding.category] || 0) + 1;
            return acc;
          }, {})
        }
      }
    };

    await ExtensionStorage.updateSettings({ analytics: updatedAnalytics });
  }

  async recordProFeatureUsage(feature) {
    const settings = await ExtensionStorage.getSettings();
    const analytics = settings.analytics || {};
    
    const updatedAnalytics = {
      ...analytics,
      proFeatureUsage: {
        ...analytics.proFeatureUsage,
        [feature]: (analytics.proFeatureUsage?.[feature] || 0) + 1,
        lastUsed: Date.now()
      }
    };

    await ExtensionStorage.updateSettings({ analytics: updatedAnalytics });
  }

  async getAnalyticsSummary() {
    const settings = await ExtensionStorage.getSettings();
    const analytics = settings.analytics || {};
    
    const summary = {
      // Overall stats
      totalOptimizations: analytics.optimizationsCount || 0,
      totalTokensSaved: analytics.totalTokensSaved || 0,
      totalTokensProcessed: analytics.totalTokensProcessed || 0,
      
      // Averages
      averageTokensSavedPerOptimization: this.calculateAverage(
        analytics.totalTokensSaved || 0,
        analytics.optimizationsCount || 0
      ),
      averageOptimizationRate: this.calculateAverageOptimizationRate(analytics),
      
      // Time-based stats
      accountAge: this.calculateAccountAge(analytics.lastReset || Date.now()),
      daysSinceLastOptimization: this.calculateDaysSince(analytics.lastOptimization),
      
      // Session stats
      sessionStats: {
        ...this.sessionData,
        sessionDuration: Date.now() - this.sessionData.startTime
      },
      
      // Service breakdown
      serviceStats: this.processServiceStats(analytics.serviceStats || {}),
      
      // Model breakdown
      modelStats: this.processModelStats(analytics.modelStats || {}),
      
      // Pro features (if applicable)
      proFeatureUsage: this.processProFeatureStats(analytics.proFeatureUsage || {}),
      
      // Sensitive data detection
      sensitiveDataStats: this.processSensitiveDataStats(analytics.sensitiveDataDetections || {}),
      
      // Insights and recommendations
      insights: this.generateInsights(analytics)
    };
    
    return summary;
  }

  calculateOptimizationRate(original, optimized) {
    if (original === 0) return 0;
    return Math.round(((original - optimized) / original) * 100);
  }

  calculateAverage(total, count) {
    return count > 0 ? Math.round(total / count) : 0;
  }

  calculateAverageOptimizationRate(analytics) {
    const totalProcessed = analytics.totalTokensProcessed || 0;
    const totalSaved = analytics.totalTokensSaved || 0;
    
    if (totalProcessed === 0) return 0;
    return Math.round((totalSaved / totalProcessed) * 100);
  }

  calculateAccountAge(startDate) {
    const now = Date.now();
    const diffMs = now - startDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Less than a day';
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  }

  calculateDaysSince(timestamp) {
    if (!timestamp) return null;
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  processServiceStats(serviceStats) {
    return Object.entries(serviceStats).map(([service, stats]) => ({
      service,
      ...stats,
      averageTokensSaved: this.calculateAverage(stats.tokensSaved || 0, stats.optimizations || 0),
      optimizationRate: this.calculateOptimizationRate(
        stats.tokensProcessed || 0,
        (stats.tokensProcessed || 0) - (stats.tokensSaved || 0)
      )
    })).sort((a, b) => b.optimizations - a.optimizations);
  }

  processModelStats(modelStats) {
    return Object.entries(modelStats).map(([model, stats]) => ({
      model,
      ...stats,
      averageTokensSaved: this.calculateAverage(stats.tokensSaved || 0, stats.optimizations || 0),
      optimizationRate: this.calculateOptimizationRate(
        stats.tokensProcessed || 0,
        (stats.tokensProcessed || 0) - (stats.tokensSaved || 0)
      )
    })).sort((a, b) => b.optimizations - a.optimizations);
  }

  processProFeatureStats(proFeatureUsage) {
    return Object.entries(proFeatureUsage)
      .filter(([key]) => key !== 'lastUsed')
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count);
  }

  processSensitiveDataStats(sensitiveDataDetections) {
    return {
      totalDetections: sensitiveDataDetections.total || 0,
      bySeverity: {
        critical: sensitiveDataDetections.critical || 0,
        high: sensitiveDataDetections.high || 0,
        medium: sensitiveDataDetections.medium || 0,
        low: sensitiveDataDetections.low || 0
      },
      byCategory: sensitiveDataDetections.categoriesFound || {},
      daysSinceLastDetection: this.calculateDaysSince(sensitiveDataDetections.lastDetection)
    };
  }

  generateInsights(analytics) {
    const insights = [];
    
    const totalTokensSaved = analytics.totalTokensSaved || 0;
    const optimizationsCount = analytics.optimizationsCount || 0;
    const avgOptimizationRate = this.calculateAverageOptimizationRate(analytics);
    
    // Token savings insights
    if (totalTokensSaved > 10000) {
      insights.push({
        type: 'achievement',
        title: 'Token Savings Champion!',
        description: `You've saved over ${Math.floor(totalTokensSaved / 1000)}K tokens! That's impressive optimization work.`,
        icon: '🏆'
      });
    } else if (totalTokensSaved > 1000) {
      insights.push({
        type: 'progress',
        title: 'Great Progress',
        description: `You've saved ${Math.floor(totalTokensSaved / 100) / 10}K tokens so far. Keep optimizing!`,
        icon: '📈'
      });
    }
    
    // Optimization rate insights
    if (avgOptimizationRate > 30) {
      insights.push({
        type: 'efficiency',
        title: 'Highly Efficient Prompts',
        description: `Your average optimization rate of ${avgOptimizationRate}% shows you're writing very efficient prompts.`,
        icon: '⚡'
      });
    } else if (avgOptimizationRate > 15) {
      insights.push({
        type: 'improvement',
        title: 'Room for Improvement',
        description: `With a ${avgOptimizationRate}% optimization rate, there's potential to make your prompts even more concise.`,
        icon: '💡'
      });
    }
    
    // Usage frequency insights
    if (optimizationsCount > 100) {
      insights.push({
        type: 'habit',
        title: 'Optimization Expert',
        description: `With ${optimizationsCount} optimizations, you've made token efficiency a habit!`,
        icon: '🔥'
      });
    }
    
    // Service diversity insights
    const serviceCount = Object.keys(analytics.serviceStats || {}).length;
    if (serviceCount >= 3) {
      insights.push({
        type: 'diversity',
        title: 'Multi-Platform User',
        description: `You're optimizing across ${serviceCount} different LLM platforms. Great coverage!`,
        icon: '🌐'
      });
    }
    
    // Cost savings estimate
    if (totalTokensSaved > 1000) {
      const estimatedSavings = (totalTokensSaved / 1000000) * 5; // Rough estimate at $5/1M tokens
      if (estimatedSavings > 0.1) {
        insights.push({
          type: 'savings',
          title: 'Cost Savings',
          description: `Your optimizations have saved approximately $${estimatedSavings.toFixed(2)} in API costs.`,
          icon: '💰'
        });
      }
    }
    
    return insights;
  }

  async exportAnalytics() {
    const summary = await this.getAnalyticsSummary();
    const settings = await ExtensionStorage.getSettings();
    
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      analytics: summary,
      settings: {
        isPro: settings.isPro,
        autoOptimize: settings.autoOptimize,
        tokenBudget: settings.tokenBudget
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  async resetAnalytics() {
    const settings = await ExtensionStorage.getSettings();
    
    const resetAnalytics = {
      totalTokensSaved: 0,
      optimizationsCount: 0,
      totalTokensProcessed: 0,
      lastReset: Date.now(),
      serviceStats: {},
      modelStats: {},
      proFeatureUsage: {},
      sensitiveDataDetections: {}
    };

    await ExtensionStorage.updateSettings({ analytics: resetAnalytics });
    
    // Reset session data
    this.sessionData = {
      startTime: Date.now(),
      optimizationsThisSession: 0,
      tokensProcessedThisSession: 0,
      tokensSavedThisSession: 0
    };
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}