import { setAllAuxiliars } from "@/store/useAuxiliarsStore";

const getAllAuxiliars = async ({ all = false }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/auxiliars?all=${all}`,
    );

    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();
    if (data?.error) return { error: data.error };
    setAllAuxiliars(data);
    return data;
  } catch (error) {
    return { error: error.message };
  }
};
export { getAllAuxiliars };
