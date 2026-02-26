"use client";
import NotificationItem from "@/components/NotificationItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/client";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useState, use } from "react";
import { useEffect } from "react";

const Page = props => {
  const params = use(props.params);
  const { id } = params;
  const [notificationsData, setNotificationsData] = useState([]);
  const { profile } = useAuthContext();

  useEffect(() => {
    const getData = async () => {
      try {
        const notificationsRef = query(
          collection(
            db,
            "notificationsSchool",
            profile?.schoolId,
            "notifications",
          ),
          where("routeId", "==", id),
          limit(20),
        );
        const querySnapshot = await getDocs(notificationsRef);

        const data = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setNotificationsData(data);
      } catch (error) {
        console.error("🚀 ~ getData ~ error", error);
      }
    };
    profile?.schoolId && getData();
  }, [profile?.schoolId]);

  return (
    <div className="container mx-auto my-10">
      <Card>
        <CardHeader className="border-b-2 border-yellow-500">
          <CardTitle>Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="divide-y-2">
          {notificationsData.map((item) => {
            return <NotificationItem data={item} key={item.id} />;
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
