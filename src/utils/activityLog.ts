import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../firebase/config';

export const addActivityLog = async (userId: string, action: string) => {
  try {
    const logRef = ref(db, `users/${userId}/activityLog`);
    
    await push(logRef, {
      action,
      timestamp: serverTimestamp()
    });
    
    // Keep only the last 50 log entries (optional)
    // This would require a cloud function or backend logic to enforce
    
    return true;
  } catch (error) {
    console.error('Error adding activity log:', error);
    return false;
  }
};

export const getActivityLogs = async (userId: string) => {
  // This would fetch the activity logs
  // Implementation would depend on requirements
};