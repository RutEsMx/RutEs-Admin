const getParents = async ({ pageIndex, pageSize, schoolId }) => {
  try {
    const response = await fetch(
      `/api/parents?pageIndex=${pageIndex}&pageSize=${pageSize}&schoolId=${schoolId}`,
    );
    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error?.message };
  }
};

const deleteParents = async (ids) => {
  try {
    const response = await fetch(`/api/parents`, {
      method: "DELETE",
      body: JSON.stringify(ids),
    });
    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error?.message };
  }
};

export { getParents, deleteParents };
