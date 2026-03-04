"use client";
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useContext } from "react";
import { getDocumentByField } from "@/firebase/crud";
import { getSchooldById } from "@/services/SchoolServices";
import { getCookies } from "@/services/CookiesServices";
import { getAuxiliars } from "@/services/AuxiliarsServices";
import { getDrivers } from "@/services/DriverServices";
import { getUnits } from "@/services/UnitsServices";
import { getParents } from "@/services/ParentsSevices";

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        setProfile(null);
        setSchool(null);
        setLoading(false);
        return;
      }
      try {
        // Obtener perfil
        const profile = await getDocumentByField("profile", "id", user?.uid);

        // Almacenar usuario de Firebase
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        });

        // Obtener token JWT y establecer cookies
        const jwt = await user?.getIdToken();
        await getCookies(jwt);

        // Obtener datos de la escuela
        const schoolResponse = await getSchooldById(profile?.schoolId);
        if (schoolResponse?.error) {
          throw new Error(schoolResponse?.error?.message);
        }

        // Establecer datos del perfil y escuela
        setProfile(profile);
        setSchool(schoolResponse.data);
        setLoading(false);

        // Cargar datos adicionales
        // Nota: students se carga via subscribeStudents() en dashboard/layout.jsx
        // para incluir las paradas (stops) de cada estudiante
        Promise.all([
          getAuxiliars(),
          getDrivers(),
          getUnits(),
          getParents(),
        ]).catch((error) => {
          console.error("Error al cargar datos adicionales:", error);
        });
      } catch (error) {
        console.error("Error en AuthContext:", error);
        alert(error.message);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        school,
        loading,
        setSchool,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
