// Utility to clear all stored data for fresh deployment
export const clearAllStorageData = (): void => {
  try {
    // Clear Redux Persist data
    localStorage.removeItem('persist:root');
    
    // Clear theme preference (optional - users might want to keep this)
    // localStorage.removeItem('darkMode');
    
    // Clear any other app-specific data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('ai-interview-') || 
        key.startsWith('candidate-') ||
        key.startsWith('interview-') ||
        key.includes('redux')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('✅ Storage data cleared for fresh deployment');
  } catch (error) {
    console.warn('⚠️ Could not clear storage data:', error);
  }
};

// Function to check if there's any existing data
export const hasExistingData = (): boolean => {
  try {
    const persistedData = localStorage.getItem('persist:root');
    if (persistedData) {
      const parsed = JSON.parse(persistedData);
      // Check if there are any candidates or active sessions
      const candidates = parsed.candidates ? JSON.parse(parsed.candidates) : null;
      const interviews = parsed.interviews ? JSON.parse(parsed.interviews) : null;
      
      return (
        (candidates && candidates.candidates && candidates.candidates.length > 0) ||
        (interviews && interviews.currentSession)
      );
    }
    return false;
  } catch (error) {
    return false;
  }
};