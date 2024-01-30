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
import { getStudents } from "@/services/StudentsServices";

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
        const profile = await getDocumentByField("profile", "id", user?.uid);
        setUser(user);
        const jwt = await user?.getIdToken();
        await getCookies(jwt);
        const school = await getSchooldById(profile?.schoolId);
        if (school?.error) {
          throw new Error(school?.error?.message);
        }
        setProfile(profile);
        setSchool(school.data);
        setLoading(false);
        getAuxiliars();
        getDrivers();
        getUnits();
        getParents();
        getStudents();
      } catch (error) {
        alert(error.message);
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
