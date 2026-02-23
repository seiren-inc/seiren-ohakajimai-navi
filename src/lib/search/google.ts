import { SearchProvider, SearchResult } from './types';

export class GoogleSearchProvider implements SearchProvider {
    name = 'Google (Mock)';

    async search(query: string, options?: { count?: number }): Promise<SearchResult[]> {
        console.log(`[GoogleSearchProvider] Searching for: ${query}`);
        // Future implementation will use Google Custom Search API
        return [];
    }
}
