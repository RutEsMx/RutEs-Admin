"use client";
import { useEffect, useState } from "react";
import {
  COLORS,
  CURRENT_DAY,
  DAYS_OPTIONS,
  STATUS_TRAVEL,
} from "@/utils/options";
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
import SelectField from "@/components/SelectField";
import { Label } from "@/components/ui/label";

const SELECT_DAY = DAYS_OPTIONS.slice(1);

const Page = ({ params }) => {
  const [route, setRoute] = useState({});
  const [color, setColor] = useState("");
  const [statusName, setStatusName] = useState("");
  const router = useRouter();
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [markers, setMarkers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(CURRENT_DAY);
  const [typeTravel, setTypeTravel] = useState("toSchool");
  const [isWorkshop, setIsWorkshop] = useState(false);
  const [listStudents, setListStudents] = useState([]);

  useEffect(() => {
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
      });
    }
  }, []);

  const successPosition = (position) => {
    const { latitude, longitude } = position.coords;
    setCenter({ lat: latitude, lng: longitude });
  };

  const errorPosition = () => {};

  useEffect(() => {
    // Obtiene la ubicación en tiempo real
    const qTracking = doc(db, "tracking", params.id);
    const unsubscribeTracking = onSnapshot(qTracking, (doc) => {
      if (!doc.exists()) return;
      const { tracking } = doc.data();
      setCenter({ lat: tracking?._lat, lng: tracking?._long });
      setMarkers((prev) => [
        ...prev,
        {
          lat: tracking?._lat,
          lng: tracking?._long,
          studentId: params.id,
          color: "#049818",
          name: "Autobús",
        },
      ]);
    });
    // Obtiene la ruta una sola vez
    const getRoute = async () => {
      try {
        const q = doc(db, "routes", params.id);
        const routeData = await getDoc(q);
        if (!routeData.exists()) {
          toast.error("Ruta no encontrada");
          return;
        }
        if (routeData.data()["workshop"]) setIsWorkshop(true);
        setRoute({ ...routeData.data(), id: routeData.id });
      } catch (error) {
        toast.error("Error al obtener la ruta");
      }
    };
    getRoute();
    return () => {
      unsubscribeTracking();
    };
  }, [params.id]);

  useEffect(() => {
    const qTravel = doc(db, "travels", params.id);
    const unsubscribeStudents = [];
    setListStudents([]);
    const unsubscribeTravel = onSnapshot(qTravel, (snp) => {
      try {
        if (!snp.exists()) return;
        const travel = snp.data();
        let students = travel[selectedDay][typeTravel]?.students || [];

        if (isWorkshop) {
          const startWorkshop = travel[selectedDay]["workshop"]?.start
            ? STATUS_TRAVEL["workshop"]
            : "Viaje de taller finalizado";
          students = travel[selectedDay]["workshop"]?.students || [];
          students.forEach(async (student) => {
            // ref student
            const qStudent = doc(db, "students", student.id);
            // ref stops
            const qStops = query(
              collection(db, "stops"),
              where("student", "==", student.id),
              where("day", "==", selectedDay),
              where("type", "==", "workshop"),
            );
            const stopResponse = await getDocs(qStops);

            const unsubscribeStudent = onSnapshot(
              qStudent,
              async (snpStudent) => {
                if (!snpStudent.exists()) return;
                const studentData = snpStudent.data();
                const colorMarker =
                  studentData["workshop"].delivered &&
                  travel[selectedDay]["workshop"]?.start
                    ? "#FFBF3B"
                    : studentData["workshop"].pickedUp
                    ? "#0867ec"
                    : "#4F504F";
                stopResponse.forEach(async (stop) => {
                  if (stop.exists() === false) return;
                  const { coords } = stop.data();
                  setMarkers((prev) => {
                    const state = [...prev];
                    const index = state.findIndex(
                      (item) => item.studentId === student.id,
                    );
                    if (index !== -1) {
                      state[index] = {
                        lat: coords.lat,
                        lng: coords.lng,
                        color: colorMarker,
                        studentId: student.id,
                        fullName: `${studentData.name || ""} ${
                          studentData.lastName || ""
                        } ${studentData.secondLastName || ""}`,
                      };
                    } else {
                      state.push({
                        lat: coords.lat,
                        lng: coords.lng,
                        color: colorMarker,
                        studentId: student.id,
                        fullName: `${studentData.name || ""} ${
                          studentData.lastName || ""
                        } ${studentData.secondLastName || ""}`,
                      });
                    }
                    return state;
                  });

                  // setListStudents push into same position
                  setListStudents((prev) => {
                    const state = [...prev];
                    // find student.id in list and update
                    const index = state.findIndex(
                      (item) => item.id === student.id,
                    );
                    if (index !== -1) {
                      state[index] = {
                        id: student.id,
                        name: studentData.name,
                        lastName: studentData.lastName,
                        secondLastName: studentData.secondLastName,
                        stop: {
                          lat: coords.lat,
                          lng: coords.lng,
                        },
                      };
                    } else {
                      state.push({
                        id: student.id,
                        name: studentData.name,
                        lastName: studentData.lastName,
                        secondLastName: studentData.secondLastName,
                        stop: {
                          lat: coords.lat,
                          lng: coords.lng,
                        },
                      });
                    }
                    return state;
                  });
                });
              },
            );
            unsubscribeStudents.push(unsubscribeStudent);
          });
          setStatusName(startWorkshop);
          return setColor(COLORS.workshop);
        }

        if (typeTravel === "toSchool") {
          const startFromSchool = travel[selectedDay][typeTravel]
            ?.startTravelFromSchool
            ? STATUS_TRAVEL[typeTravel]
            : "Viaje a escuela finalizado";
          students.forEach(async (student) => {
            // ref student
            const qStudent = doc(db, "students", student.id);
            // ref stops
            const qStops = query(
              collection(db, "stops"),
              where("student", "==", student.id),
              where("day", "==", selectedDay),
              where("type", "==", typeTravel),
            );
            const stopResponse = await getDocs(qStops);

            const unsubscribeStudent = onSnapshot(
              qStudent,
              async (snpStudent) => {
                if (!snpStudent.exists()) return;
                const studentData = snpStudent.data();
                const colorMarker =
                  studentData[typeTravel]?.delivered &&
                  !travel[selectedDay][typeTravel]?.startTravelFromSchool
                    ? "#FFBF3B"
                    : studentData[typeTravel]?.pickedUp
                    ? "#0867ec"
                    : "#4F504F";
                stopResponse.forEach(async (stop) => {
                  if (stop.exists() === false) return;
                  const { coords } = stop.data();
                  setMarkers((prev) => {
                    const state = [...prev];
                    const index = state.findIndex(
                      (item) => item?.studentId === student?.id,
                    );
                    if (index !== -1) {
                      state[index] = {
                        lat: coords.lat,
                        lng: coords.lng,
                        color: colorMarker,
                        studentId: student.id,
                        fullName: `${studentData.name || ""} ${
                          studentData.lastName || ""
                        } ${studentData.secondLastName || ""}`,
                      };
                    } else {
                      state.push({
                        lat: coords.lat,
                        lng: coords.lng,
                        color: colorMarker,
                        studentId: student.id,
                        fullName: `${studentData.name || ""} ${
                          studentData.lastName || ""
                        } ${studentData.secondLastName || ""}`,
                      });
                    }
                    return state;
                  });
                  // setListStudents push into same position
                  setListStudents((prev) => {
                    const state = [...prev];
                    // find student.id in list and update
                    const index = state.findIndex(
                      (item) => item.id === student.id,
                    );
                    if (index !== -1) {
                      state[index] = {
                        id: student.id,
                        name: studentData.name,
                        lastName: studentData.lastName,
                        secondLastName: studentData.secondLastName,
                        stop: {
                          lat: coords.lat,
                          lng: coords.lng,
                        },
                      };
                    } else {
                      state.push({
                        id: student.id,
                        name: studentData.name,
                        lastName: studentData.lastName,
                        secondLastName: studentData.secondLastName,
                        stop: {
                          lat: coords.lat,
                          lng: coords.lng,
                        },
                      });
                    }
                    return state;
                  });
                });
              },
            );
            unsubscribeStudents.push(unsubscribeStudent);
          });
          setStatusName(startFromSchool);
          return setColor(COLORS.toHome);
        } else if (typeTravel === "toHome") {
          const startFromHome = travel[selectedDay][typeTravel]?.start
            ? STATUS_TRAVEL[typeTravel]
            : "Viaje a casa finalizado";
          students.forEach(async (student) => {
            // ref student
            const qStudent = doc(db, "students", student.id);
            // ref stops
            const qStops = query(
              collection(db, "stops"),
              where("student", "==", student.id),
              where("day", "==", selectedDay),
              where("type", "==", typeTravel),
            );
            const stopResponse = await getDocs(qStops);
            const unsubscribeStudent = onSnapshot(
              qStudent,
              async (snpStudent) => {
                if (!snpStudent.exists()) return;
                const studentData = snpStudent.data();
                const colorMarker =
                  studentData[typeTravel]?.delivered &&
                  travel[selectedDay][typeTravel]?.start
                    ? "#FFBF3B"
                    : studentData[typeTravel]?.pickedUp
                    ? "#0867ec"
                    : "#4F504F";
                stopResponse.forEach(async (stop) => {
                  if (stop.exists() === false) return;
                  const { coords } = stop.data();
                  setMarkers((prev) => {
                    const state = [...prev];
                    const index = state.findIndex(
                      (item) => item.studentId === student.id,
                    );
                    if (index !== -1) {
                      state[index] = {
                        lat: coords.lat,
                        lng: coords.lng,
                        color: colorMarker,
                        studentId: student.id,
                        fullName: `${studentData.name || ""} ${
                          studentData.lastName || ""
                        } ${studentData.secondLastName || ""}`,
                      };
                    } else {
                      state.push({
                        lat: coords.lat,
                        lng: coords.lng,
                        color: colorMarker,
                        studentId: student.id,
                        fullName: `${studentData.name || ""} ${
                          studentData.lastName || ""
                        } ${studentData.secondLastName || ""}`,
                      });
                    }
                    return state;
                  });
                  // setListStudents push into same position
                  setListStudents((prev) => {
                    const state = [...prev];
                    // find student.id in list and update
                    const index = state.findIndex(
                      (item) => item.id === student.id,
                    );
                    if (index !== -1) {
                      state[index] = {
                        id: student.id,
                        name: studentData.name,
                        lastName: studentData.lastName,
                        secondLastName: studentData.secondLastName,
                        stop: {
                          lat: coords.lat,
                          lng: coords.lng,
                        },
                      };
                    } else {
                      state.push({
                        id: student.id,
                        name: studentData.name,
                        lastName: studentData.lastName,
                        secondLastName: studentData.secondLastName,
                        stop: {
                          lat: coords.lat,
                          lng: coords.lng,
                        },
                      });
                    }
                    return state;
                  });
                });
              },
            );
            unsubscribeStudents.push(unsubscribeStudent);
          });
          setStatusName(startFromHome);
          return setColor(COLORS.toSchool);
        }
      } catch (error) {
        toast.error("Error al obtener el estado del viaje");
      }
    });

    return () => {
      unsubscribeTravel();
      unsubscribeStudents.forEach((unsubscribe) => unsubscribe());
    };
  }, [params.id, selectedDay, typeTravel, isWorkshop]);

  const handleDelete = async (id) => {
    const response = await removeRoutes(id);
    if (!response?.success) {
      toast.error("Error al eliminar la ruta");
      return;
    }
    toast.success("Ruta eliminada correctamente");
    return router.replace("/dashboard/routes");
  };

  const handleStudent = (student) => {
    // recenter map
    setCenter(student.stop);
  };

  return (
    <div className="container mx-auto px-4 pb-12 h-screen pt-10">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h1 className="font-bold text-3xl">Datos de ruta</h1>
        </div>
        <div className="flex justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <ButtonAction color="bg-warning">Eliminar</ButtonAction>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  ¿Deseas eliminar la parada todos los dias?
                </DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <ButtonAction color="bg-warning">Cancelar</ButtonAction>
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
          <ButtonLink color="bg-light-gray" href={`/dashboard/routes/`}>
            Atrás
          </ButtonLink>
          <ButtonLink
            color="bg-primary"
            href={`/dashboard/routes/edit/${params.id}`}
          >
            Editar
          </ButtonLink>
        </div>
      </div>
      <div className="border border-black px-4 py-2 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="col-span-2 md:col-span-1 mx-3">
            <span className="">{route?.name}</span>
            {!isWorkshop && (
              <SelectField
                labelTitle="Tipo de viaje"
                name="typeTravel"
                options={[
                  { label: "Escuela - Casa", value: "toHome" },
                  { label: "Casa - Escuela", value: "toSchool" },
                ]}
                value={typeTravel}
                onValueChange={(value) => {
                  setTypeTravel(value);
                }}
              />
            )}
            <SelectField
              labelTitle="Día"
              name="day"
              options={SELECT_DAY}
              value={selectedDay}
              onValueChange={setSelectedDay}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col justify-around">
              <div className="flex flex-row gap-2">
                <span className="font-bold">Capacidad:</span>
                <span className="">{route?.capacity}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Estado:</span>
                <span className={`${color}`}>{statusName}</span>
              </div>
              <div className="flex flex-row gap-2 pt-2 mt-3 border-t-2">
                <Label className="text-2xl">Estudiantes</Label>
              </div>
              <div className="flex flex-col gap-2 mt-2 border-t-2">
                {listStudents.map((student) => {
                  return (
                    <div
                      key={student.id}
                      className="flex flex-row cursor-pointer mt-2"
                      onClick={() => handleStudent(student)}
                    >
                      <Label className="cursor-pointer">
                        {student.name} {student.lastName}{" "}
                        {student.secondLastName}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-gray md:h-[500px] w-full bg-yellow-300">
            <Maps markers={markers} center={center} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
