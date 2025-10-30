import api from './api.js';

/**
 * Metrics Service - Developer metrics and analytics
 */
class MetricsService {
  constructor() {
    this.baseUrl = api.API_BASE.METRICS_SERVICE;
  }

  /**
   * Get developer metrics (commits per developer)
   * @returns {Promise<Array>} Metrics data
   */
  async getMetrics() {
    return api.apiCall(`${this.baseUrl}/metrics`);
  }

  /**
   * Push a metric to the service
   * @param {Object} metric - Metric data to push
   * @returns {Promise<Object>} Success response
   */
  async pushMetric(metric) {
    return api.apiCall(`${this.baseUrl}/metrics`, {
      method: 'POST',
      body: JSON.stringify(metric)
    });
  }
}

export default new MetricsService();

