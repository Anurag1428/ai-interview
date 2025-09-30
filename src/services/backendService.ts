// Backend service integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Check if backend is available
export const isBackendAvailable = async (): Promise<boolean> => {
  // In production, always use local storage (Redux Persist)
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend not available, using local storage');
    return false;
  }
};

// Backend API functions
export const backendAPI = {
  // Get all candidates
  getCandidates: async (params?: { q?: string; status?: string; sort?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/candidates${query}`);
    if (!response.ok) throw new Error('Failed to fetch candidates');
    return response.json();
  },

  // Create candidate
  createCandidate: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create candidate');
    }
    return response.json();
  },

  // Get single candidate
  getCandidate: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
    if (!response.ok) throw new Error('Failed to fetch candidate');
    return response.json();
  },

  // Update candidate
  updateCandidate: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update candidate');
    return response.json();
  },

  // Add answer
  addAnswer: async (id: string, answer: any) => {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answer),
    });
    if (!response.ok) throw new Error('Failed to add answer');
    return response.json();
  },

  // Get analytics
  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },
};

// Hybrid service that uses backend when available, falls back to Redux
export class HybridDataService {
  private static backendAvailable: boolean | null = null;

  static async checkBackend(): Promise<boolean> {
    if (this.backendAvailable === null) {
      this.backendAvailable = await isBackendAvailable();
      console.log(this.backendAvailable ? '🔗 Backend connected' : '💾 Using local storage');
    }
    return this.backendAvailable;
  }

  static async getCandidates(params?: any) {
    const useBackend = await this.checkBackend();
    if (useBackend) {
      try {
        const result = await backendAPI.getCandidates(params);
        return result.items || result; // Handle both paginated and simple responses
      } catch (error) {
        console.warn('Backend error, falling back to local data:', error);
        this.backendAvailable = false;
      }
    }
    // Fallback to Redux store (handled by components)
    return null;
  }

  static async createCandidate(data: any) {
    const useBackend = await this.checkBackend();
    if (useBackend) {
      try {
        return await backendAPI.createCandidate(data);
      } catch (error) {
        console.warn('Backend error, falling back to local storage:', error);
        this.backendAvailable = false;
      }
    }
    return null;
  }

  static async updateCandidate(id: string, updates: any) {
    const useBackend = await this.checkBackend();
    if (useBackend) {
      try {
        return await backendAPI.updateCandidate(id, updates);
      } catch (error) {
        console.warn('Backend error, falling back to local storage:', error);
        this.backendAvailable = false;
      }
    }
    return null;
  }

  static async addAnswer(id: string, answer: any) {
    const useBackend = await this.checkBackend();
    if (useBackend) {
      try {
        return await backendAPI.addAnswer(id, answer);
      } catch (error) {
        console.warn('Backend error, falling back to local storage:', error);
        this.backendAvailable = false;
      }
    }
    return null;
  }

  static async getAnalytics() {
    const useBackend = await this.checkBackend();
    if (useBackend) {
      try {
        return await backendAPI.getAnalytics();
      } catch (error) {
        console.warn('Backend error, falling back to local analytics:', error);
        this.backendAvailable = false;
      }
    }
    return null;
  }
}

export default HybridDataService;