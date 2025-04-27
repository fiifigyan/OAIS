export const groupByDate = (notifications) => {
  if (!notifications || !notifications.length) return {};
  
  return notifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});
};

export const formatNotificationTime = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const notificationDate = new Date(timestamp);
  const diffInHours = (now - notificationDate) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return notificationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return notificationDate.toLocaleDateString();
  }
};