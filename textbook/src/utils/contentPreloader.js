/**
 * Content preloading strategies for the textbook
 * Helps improve perceived performance by preloading likely-needed content
 */

export class ContentPreloader {
  constructor() {
    this.preloadedContent = new Map();
    this.preloadQueue = [];
  }

  /**
   * Preload content for a specific URL
   * @param {string} url - The URL to preload
   * @param {Object} options - Preload options
   */
  async preloadContent(url, options = {}) {
    const { timeout = 5000, cache = true } = options;

    // Don't reload if already preloaded recently
    if (this.preloadedContent.has(url)) {
      const { timestamp } = this.preloadedContent.get(url);
      if (Date.now() - timestamp < 300000) { // 5 minutes cache
        return this.preloadedContent.get(url).data;
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'X-Requested-With': 'preload',
        },
        cache: 'force-cache'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Preload failed: ${response.status}`);
      }

      const data = await response.text();

      if (cache) {
        this.preloadedContent.set(url, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.warn(`Failed to preload content from ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Preload chapter content based on navigation predictions
   * @param {Array<string>} nextChapterUrls - Potential next chapter URLs to preload
   */
  async preloadChapters(nextChapterUrls) {
    const promises = nextChapterUrls.slice(0, 3).map(url => 
      this.preloadContent(url, { timeout: 3000 })
    );

    const results = await Promise.allSettled(promises);
    return results;
  }

  /**
   * Preload search index for faster searches
   */
  async preloadSearchIndex() {
    try {
      // Preload the search index if it exists
      const searchIndexPath = '/api/v1/search/';
      return await this.preloadContent(searchIndexPath, { timeout: 5000 });
    } catch (error) {
      console.warn('Could not preload search index:', error.message);
      return null;
    }
  }

  /**
   * Preload API endpoints that are commonly used
   */
  async preloadAPIEndpoints() {
    const endpoints = [
      '/api/v1/health',
      '/api/v1/chapters/',
      '/api/v1/chat/'
    ];

    const promises = endpoints.map(endpoint => 
      this.preloadContent(endpoint, { timeout: 2000 })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Clear preloaded content (useful for memory management)
   */
  clearPreloadedContent() {
    this.preloadedContent.clear();
  }

  /**
   * Get preloaded content if available
   * @param {string} url - The URL to get preloaded content for
   * @returns {any|null} - Preloaded content or null if not available
   */
  getPreloadedContent(url) {
    if (this.preloadedContent.has(url)) {
      const { data, timestamp } = this.preloadedContent.get(url);
      // Check if content is still fresh (less than 5 minutes old)
      if (Date.now() - timestamp < 300000) {
        return data;
      } else {
        this.preloadedContent.delete(url);
      }
    }
    return null;
  }
}

// Singleton instance
export const contentPreloader = new ContentPreloader();

// Initialize preloading when the module is imported
if (typeof window !== 'undefined') {
  // Preload common API endpoints when the app loads
  contentPreloader.preloadAPIEndpoints().catch(console.warn);
  
  // Preload search index
  contentPreloader.preloadSearchIndex().catch(console.warn);
}