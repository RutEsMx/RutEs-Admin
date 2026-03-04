"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import {
  COLORS,
  CURRENT_DAY,
  DAYS,
  DAYS_OPTIONS,
  STATUS_TRAVEL,
} from "@/utils/options";
import DayTypePicker from "@/components/DayTypePicker";
import ButtonLink from "@/components/ButtonLink";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import Maps from "@/components/Maps";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ButtonAction from "@/components/ButtonAction";
import { removeRoutes } from "@/services/RoutesServices";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RouteInfo from "@/components/RouteDetail/RouteInfo";

const Page = (props) => {
  const params = use(props.params);
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState("");
  const [statusName, setStatusName] = useState("");
  const router = useRouter();
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(CURRENT_DAY);
  const [typeTravel, setTypeTravel] = useState("toSchool");
  const [isWorkshop, setIsWorkshop] = useState(false);
  const [listStudents, setListStudents] = useState([]);
  const [travelData, setTravelData] = useState({});

  const unsubscribeStudentsRef = useRef([]);

  // Cleanup function for Firebase listeners
  const cleanupListeners = useCallback(() => {
    unsubscribeStudentsRef.current.forEach((unsub) => {
      if (typeof unsub === "function") unsub();
    });
    unsubscribeStudentsRef.current = [];
  }, []);

  // Get user location
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "prompt" || result.state === "granted") {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCenter({ lat: latitude, lng: longitude });
          },
          () => {}, // Silent fail
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        );
      }
    });
  }, []);

  // Fetch route data
  useEffect(() => {
    const getRoute = async () => {
      try {
        const q = doc(db, "routes", params.id);
        const routeData = await getDoc(q);
        if (!routeData.exists()) {
          toast.error("Ruta no encontrada");
          router.push("/dashboard/routes");
          return;
        }
        const data = { ...routeData.data(), id: routeData.id };
        setRoute(data);
        if (data.workshop) setIsWorkshop(true);
      } catch (error) {
        toast.error("Error al obtener la ruta");
      } finally {
        setIsLoading(false);
      }
    };

    getRoute();

    return () => cleanupListeners();
  }, [params.id, router, cleanupListeners]);

  // Real-time tracking subscription
  useEffect(() => {
    const qTracking = doc(db, "tracking", params.id);
    const unsubscribeTracking = onSnapshot(qTracking, (doc) => {
      if (!doc.exists()) return;
      const { tracking } = doc.data();
      if (tracking?._lat && tracking?._long) {
        setCenter({ lat: tracking._lat, lng: tracking._long });
        setMarkers((prev) => {
          const filtered = prev.filter((m) => m.studentId !== params.id);
          return [
            ...filtered,
            {
              lat: tracking._lat,
              lng: tracking._long,
              studentId: params.id,
              color: "#000",
              name: "Autobús",
            },
          ];
        });
      }
    });

    return () => unsubscribeTracking();
  }, [params.id]);

  // Travel data subscription
  useEffect(() => {
    cleanupListeners();
    setListStudents([]);

    const qTravel = doc(db, "travels", params.id);
    const unsubscribeTravel = onSnapshot(qTravel, (snp) => {
      try {
        if (!snp.exists()) return;
        const travel = snp.data();

        const formattedTravels = {};
        Object.keys(DAYS_OPTIONS).forEach((_, idx) => {
          if (idx === 0) return;
          const dayKey = Object.keys(DAYS)[idx - 1];
          formattedTravels[dayKey] = {
            toHome: travel[dayKey]?.toHome?.students || [],
            toSchool: travel[dayKey]?.toSchool?.students || [],
            workshop: travel[dayKey]?.workshop?.students || [],
          };
        });
        setTravelData(formattedTravels);

        if (!travel[selectedDay]) {
          setMarkers((prev) => prev.filter((m) => m.studentId === params.id));
          setListStudents([]);
          setStatusName("Sin viaje");
          setColor(COLORS.finished);
          return;
        }

        const travelType = isWorkshop ? "workshop" : typeTravel;
        let students = travel[selectedDay]?.[travelType]?.students || [];

        const getStatusText = () => {
          if (isWorkshop) {
            return travel[selectedDay]?.workshop?.start
              ? STATUS_TRAVEL["workshop"]
              : "Viaje de taller finalizado";
          }
          if (typeTravel === "toSchool") {
            return travel[selectedDay]?.toSchool?.startTravelFromSchool
              ? STATUS_TRAVEL["toSchool"]
              : "Viaje a escuela finalizado";
          }
          return travel[selectedDay]?.toHome?.start
            ? STATUS_TRAVEL["toHome"]
            : "Viaje a casa finalizado";
        };

        setStatusName(getStatusText());
        const statusColor = getStatusText().includes("finalizado")
          ? COLORS.finished
          : isWorkshop
          ? COLORS.workshop
          : typeTravel === "toSchool"
          ? COLORS.toSchool
          : COLORS.toHome;
        setColor(statusColor);

        // Use for...of instead of forEach for async
        const loadStudentData = async () => {
          for (const student of students) {
            const qStudent = doc(db, "students", student.id);
            const qStops = query(
              collection(db, "stops"),
              where("student", "==", student.id),
              where("day", "==", selectedDay),
              where("type", "==", travelType),
            );

            try {
              const stopResponse = await getDocs(qStops);
              const unsubscribeStudent = onSnapshot(qStudent, (snpStudent) => {
                if (!snpStudent.exists()) return;
                const studentData = snpStudent.data();
                const delivered = studentData[travelType]?.delivered;
                const pickedUp = studentData[travelType]?.pickedUp;
                const started =
                  travel[selectedDay]?.[travelType]?.start ||
                  travel[selectedDay]?.[travelType]?.startTravelFromSchool;

                const colorMarker =
                  delivered && started
                    ? "#4F504F"
                    : pickedUp
                    ? "#FFBF3B"
                    : "#4F504F";

                stopResponse.forEach((stop) => {
                  if (!stop.exists()) return;
                  const { coords } = stop.data();
                  if (!coords) return;

                  setMarkers((prev) => {
                    const state = [...prev];
                    const index = state.findIndex(
                      (item) => item.studentId === student.id,
                    );
                    const fullName = `${studentData.name || ""} ${
                      studentData.lastName || ""
                    } ${studentData.secondLastName || ""}`.trim();

                    if (index !== -1) {
                      state[index] = {
                        lat: coords.lat,
                        lng: coords.lng,
                        color: colorMarker,
                        studentId: student.id,
                        fullName,
                      };
                    } else {
                      state.push({
                        lat: coords.lat,
                        lng: coords.lng,
                        color: colorMarker,
                        studentId: student.id,
                        fullName,
                      });
                    }
                    return state;
                  });

                  setListStudents((prev) => {
                    const state = [...prev];
                    const index = state.findIndex(
                      (item) => item.id === student.id,
                    );
                    if (index !== -1) {
                      state[index] = {
                        id: student.id,
                        name: studentData.name,
                        lastName: studentData.lastName,
                        secondLastName: studentData.secondLastName,
                        stop: { lat: coords.lat, lng: coords.lng },
                      };
                    } else {
                      state.push({
                        id: student.id,
                        name: studentData.name,
                        lastName: studentData.lastName,
                        secondLastName: studentData.secondLastName,
                        stop: { lat: coords.lat, lng: coords.lng },
                      });
                    }
                    return state;
                  });
                });
              });
              unsubscribeStudentsRef.current.push(unsubscribeStudent);
            } catch (err) {
              console.error("Error loading student:", err);
            }
          }
        };

        loadStudentData();
      } catch (error) {
        console.error("Error in travel snapshot:", error);
        toast.error("Error al obtener el estado del viaje");
      }
    });

    return () => {
      unsubscribeTravel();
      cleanupListeners();
    };
  }, [params.id, selectedDay, typeTravel, isWorkshop, cleanupListeners]);

  const handleDelete = async (id) => {
    const response = await removeRoutes(id);
    if (!response?.success) {
      toast.error("Error al eliminar la ruta");
      return;
    }
    toast.success("Ruta eliminada correctamente");
    router.replace("/dashboard/routes");
  };

  const handleStudentClick = useCallback((student) => {
    if (student.stop) {
      setCenter(student.stop);
    }
  }, []);

  const handleDayChange = useCallback((day) => {
    setSelectedDay(day);
  }, []);

  const handleTypeChange = useCallback((type) => {
    setTypeTravel(type);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-12 pt-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!route) {
    return (
      <div className="container mx-auto px-4 pb-12 pt-10 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Ruta no encontrada</h1>
        <ButtonLink href="/dashboard/routes" className="mt-4">
          Volver a rutas
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-12 pt-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="font-bold text-2xl sm:text-3xl">Datos de ruta</h1>

        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <ButtonAction color="bg-warning" aria-label="Eliminar ruta">
                Eliminar
              </ButtonAction>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>¿Eliminar esta ruta?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-600">
                Esta acción no se puede deshacer. Se eliminarán todos los datos
                asociados.
              </p>
              <DialogFooter className="gap-2 sm:justify-end">
                <DialogClose asChild>
                  <ButtonAction color="bg-light-gray">Cancelar</ButtonAction>
                </DialogClose>
                <ButtonAction
                  color="bg-primary"
                  onClick={() => handleDelete(params.id)}
                >
                  Eliminar
                </ButtonAction>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ButtonLink
            color="bg-light-gray"
            href="/dashboard/routes/"
            aria-label="Volver a rutas"
          >
            Atrás
          </ButtonLink>
          <ButtonLink
            color="bg-primary"
            href={`/dashboard/routes/edit/${params.id}`}
            aria-label="Editar ruta"
          >
            Editar
          </ButtonLink>
        </div>
      </header>

      <section
        className="border border-gray-200 rounded-lg p-4"
        aria-label="Información de la ruta"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RouteInfo
              route={route}
              travelData={travelData}
              selectedDay={selectedDay}
              typeTravel={typeTravel}
              isWorkshop={isWorkshop}
              onDayChange={handleDayChange}
              onTypeChange={handleTypeChange}
              listStudents={listStudents}
              onStudentClick={handleStudentClick}
            />
          </div>

          <div className="lg:col-span-2 min-h-[400px]">
            <div className="h-full min-h-[400px] bg-gray-100 rounded-lg overflow-hidden">
              <Maps markers={markers} center={center} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
