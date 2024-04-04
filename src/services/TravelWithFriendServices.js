const getTravelWithFriend = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/travel-with-friend/${id}`,
    );
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

const confirmTravelWithFriend = async (data) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/travel-with-friend`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) {
      throw new Error("Error al confirmar el viaje");
    }
    const dataResponse = await response.json();
    return dataResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { getTravelWithFriend, confirmTravelWithFriend };
