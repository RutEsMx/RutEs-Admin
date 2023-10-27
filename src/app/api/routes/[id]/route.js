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
  
  const daysArray = await Promise.all(Object.keys(travelsData).map(async (key) => {
    const travel = travelsData[key];
    const dayObject = {
      [key]: {
        'toHome': [],
        'toSchool': []
      }
    }
    const toHomeStudents = Object.values(travel.toHome).flat();
    const toSchoolStudents = Object.values(travel.toSchool).flat();
    dayObject[key]['toHome'] = await fetchStudentData(toHomeStudents);
    dayObject[key]['toSchool'] = await fetchStudentData(toSchoolStudents);
    
    return dayObject;
  }))

  const daysObject = Object.assign({}, ...daysArray);
  
  // const students = [];

  // if (responseStopsStudents.docs.length > 0) {
  //   const stops = responseStopsStudents.docs.map((doc) => {
  //     const data = doc.data();
  //     data.id = doc.id;
  //     return data;
  //   });

  //   const responseStudents = stops.map(async (stop) => {
  //     const getStudent = await firestore()
  //       .collection("students")
  //       .doc(stop.student)
  //       .get();
  //     const studentData = getStudent.data();
  //     studentData.id = getStudent.id;
  //     const student = students.find((student) => student.id === stop.student);
  //     if (student) {
  //       student.stops.push(stop);
  //     } else {
  //       students.push({
  //         ...studentData,
  //         stops: [stop],
  //       });
  //     }
  //   });
  //   await Promise.all(responseStudents);
  // }
  // const data = {
  //   ...routeData,
  //   id: response.id,
  //   students: students,
  // };
  const data = {
    ...routeData,
    id: response.id,
    students: daysObject,
  }
  return NextResponse.json(data);
}

async function fetchStudentData(students) {
  const studentDataList = await Promise.all(students.map(async (student) => {
    const studentSnapshot = await student.get();
    return studentSnapshot.data();
  }));
  return studentDataList;
}