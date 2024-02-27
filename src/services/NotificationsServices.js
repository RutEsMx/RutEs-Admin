const getNotifications = async (schoolId) => {
  try {
    const response = await fetch(`/api/notifications?schoolId=${schoolId}`);
    const notification = await response.json();

    return { success: true, data: notification };
  } catch (error) {
    return { error };
  }
};

export { getNotifications };
