import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request, { params }) {
  const { id } = params;
  const response = await firestore().collection("routes").doc(id).get();
  const routeData = response.data();

  // const [responseStopsStudents] = await Promise.all([
  //   firestore().collection("stops").where("route", "==", id).get(),
  // ]);

  const travels = await firestore().collection("travels").doc(id).get();
  const travelsData = travels.data();

  const daysArray = await Promise.all(
    Object.keys(travelsData).map(async (key) => {
      const travel = travelsData[key];
      const dayObject = {
        [key]: {
          toHome: [],
          toSchool: [],
          workshop: [],
        },
      };
      const toHomeStudents = travel.toHome
        ? Object.values(travel.toHome).flat()
        : [];
      const toSchoolStudents = travel.toSchool
        ? Object.values(travel.toSchool).flat()
        : [];
      const workshopStudents = travel.workshop
        ? Object.values(travel.workshop).flat()
        : [];
      dayObject[key]["toHome"] = await fetchStudentData(
        toHomeStudents,
        "toHome",
        key,
      );
      dayObject[key]["toSchool"] = await fetchStudentData(
        toSchoolStudents,
        "toSchool",
        key,
      );
      dayObject[key]["workshop"] = await fetchStudentData(
        workshopStudents,
        "workshop",
        key,
      );

      return dayObject;
    }),
  );

  const daysObject = Object.assign({}, ...daysArray);
  const data = {
    ...routeData,
    id: response.id,
    students: daysObject,
  };
  return NextResponse.json(data);
}

async function fetchStudentData(students, type, day) {
  if (!students) {
    return {};
  }

  const studentDataList = await Promise.all(
    students.map(async (student) => {
      if (!student || !student.get) {
        return null;
      }

      const studentSnapshot = await student.get();
      const stopsRef = await firestore()
        .collection("stops")
        .where("student", "==", studentSnapshot.id)
        .where("type", "==", type)
        .where("day", "==", day)
        .get();
      let stop = {};

      stopsRef.docs.forEach((doc) => {
        const data = doc.data();
        let coords = data.coords;
        coords.id = doc.id;

        stop = {
          ...data,
          coords: coords,
          id: doc.id,
        };
      });
      const studentData = studentSnapshot?.data();
      studentData["id"] = studentSnapshot?.id;
      studentData["stop"] = stop;
      return studentData;
    }),
  );
  return studentDataList;
}
