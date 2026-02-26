"use client";
import ButtonAction from "@/components/ButtonAction";
import FormParent from "@/components/MultiStepForm/Parent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { useState, use } from "react";
import { useEffect } from "react";
import { toast } from "sonner";

const getParent = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/parents/${id}/`,
      { cache: "no-store" },
    );
    if (!response.ok) return { error: true };
    const data = await response.json();
    data.id = id;
    return data;
  } catch (error) {
    return { error };
  }
};

const Page = props => {
  const params = use(props.params);
  const { id } = params;
  const [parent, setParent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      await getParent(id).then(setParent);
    };

    fetchData();
  }, []);

  const onChangeProfile = async () => {
    setIsLoading(true);
    const profileRef = doc(db, "profile", id);
    await updateDoc(profileRef, {
      isFirstTime: true,
      isNeedPinDrop: true,
      nip: "",
    });
    setParent({
      ...parent,
      isFirstTime: true,
      isNeedPinDrop: true,
      nip: "",
    });
    toast.success("Datos del perfil reiniciados correctamente");
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 h-screen bg-white py-8">
      <div className="grid grid-cols-1 gap-4 py-2">
        {!parent ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            <FormParent data={parent} isEdit />
            {profile?.roles.includes("admin-rutes") && (
              <Card>
                <CardHeader>
                  <CardTitle>Datos del perfil para aplicacion movil</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-full mt-4">
                      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 p-2">
                      <div>
                        <ButtonAction
                          onClick={onChangeProfile}
                          disabled={
                            parent?.isNeedPinDrop && parent?.isFirstTime
                          }
                        >
                          Reiniciar todo
                        </ButtonAction>
                        <p className="text-xs text-gray-400 text-wrap mt-2">
                          Reiniciar datos del perfil para volver a la
                          configuración inicial.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Label>¿Ya colocó su ubicación en el mapa?</Label>
                        <Checkbox checked={!parent?.isNeedPinDrop} disabled />
                        <Label>¿Ya colocó su nueva contraseña?</Label>
                        <Checkbox checked={!parent?.isFirstTime} disabled />
                        <Label>¿Ya colocó su NIP?</Label>
                        <Checkbox checked={!!parent?.nip} disabled />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
