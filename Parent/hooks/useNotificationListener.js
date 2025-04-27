import React from 'react';
import NotificationService from '../services/NotificationService';

const useNotificationListener = (navigation) => {
  React.useEffect(() => {
    const cleanup = NotificationService.setupNotificationHandlers(navigation);
    return cleanup;
  }, [navigation]);
};

export default useNotificationListener;