"use client";

import Maps from "@/components/Maps";
import { db } from "@/firebase/client";
import { useRoutesStore } from "@/store/useRoutesStore";
import { COLORS_HEX } from "@/utils/options";
import { doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function MainMap() {
  const { routes } = useRoutesStore();
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const unsubscribes = routes?.map((route) => {
      return onSnapshot(doc(db, "tracking", route?.id), (querySnapshot) => {
        const { tracking } = querySnapshot.data() || {};
        if (!tracking) return null;
        const { latitude, longitude } = tracking;
        setMarkers((prevMarkers) => [
          ...prevMarkers.filter((marker) => marker.name !== route.name),
          {
            lat: latitude,
            lng: longitude,
            name: route?.name,
            color: COLORS_HEX.rutes,
          },
        ]);
      });
    });
    return () => {
      unsubscribes?.forEach((unsubscribe) => unsubscribe());
    };
  }, [routes]);

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   console.log("🚀 ~ file: MainMap.jsx:35 ~ navigator.geolocation.getCurrentPosition ~ position:", position)
    //   const { latitude, longitude } = position.coords;
    //   setCenter((prevCenter) => [
    //     ...prevCenter,
    //     { lat: latitude, lng: longitude, name: "Me", color: COLORS_HEX.me },
    //   ]);
    // });
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "prompt" || result.state === "granted") {
          var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          };
          navigator.geolocation.getCurrentPosition(
            successPosition,
            errorPosition,
            options,
          );
        }
        // if(result.state === "denied") {

        // }
      });
    }
  }, []);

  const successPosition = (position) => {
    const { latitude, longitude } = position.coords;
    setCenter({ lat: latitude, lng: longitude });
  };

  const errorPosition = () => {};

  return <Maps markers={markers} center={center} />;
}
