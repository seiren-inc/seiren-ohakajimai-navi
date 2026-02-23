/**
 * Utility interface for search providers (Google, Bing, etc.)
 * This allows swapping search engines easily.
 */
export interface SearchResult {
    title: string;
    url: string;
    snippet: string;
}

export interface SearchProvider {
    name: string;
    search(query: string, options?: { count?: number }): Promise<SearchResult[]>;
}
