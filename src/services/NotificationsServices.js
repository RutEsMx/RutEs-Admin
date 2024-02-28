const getNotifications = async (schoolId) => {
  try {
    const response = await fetch(`/api/notifications?schoolId=${schoolId}`);
    const notification = await response.json();

    return { success: true, data: notification };
  } catch (error) {
    return { error };
  }
};

const getNotificationsByRoute = async ({ schoolId, routeId, limit = 2 }) => {
  try {
    const response = await fetch(
      `/api/notifications/${routeId}?schoolId=${schoolId}&limit=${limit}`,
    );
    const notification = await response.json();

    return { success: true, data: notification };
  } catch (error) {
    return { error };
  }
};

export { getNotifications, getNotificationsByRoute };
