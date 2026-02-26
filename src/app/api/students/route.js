import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { getUSer } from "@/utils/functionsServer";
import { sendPassword } from "@/services/MailService";

// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request) {
  const sessionid = cookies().get("sessionid");
  const profile = await getUSer(sessionid?.value);

  if (profile?.error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const response = await firestore()
      .collection("students")
      .where("schoolId", "==", profile.schoolId)
      .orderBy("name")
      .get();

    const data = response.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data();
      return { id, ...data };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      schoolId,
      schoolName,
      countTutors,
      father,
      mother,
      includeFather,
      includeMother,
      ...studentData
    } = data;

    const auth = getAuth();

    const createParentProfileServer = async (parent, roles) => {
      if (!parent.email) return null;
      const password = Math.random().toString(36).slice(-8);

      let uid;
      try {
        const userCredential = await auth.createUser({
          email: parent.email,
          password: password,
          displayName: `${parent?.name} ${parent?.lastName || ""} ${
            parent?.secondLastName || ""
          }`.trim(),
        });
        uid = userCredential.uid;
      } catch (authError) {
        // If user already exists, we might want to just get their UID.
        // For simplicity and matching old logic, we throw if creation fails.
        throw new Error(
          `Error en auth para ${parent.email}: ${authError.message}`,
        );
      }

      const context = {
        name: `${parent?.name} ${parent?.lastName || ""} ${
          parent?.secondLastName || ""
        }`.trim(),
        school: schoolName,
        password,
      };

      try {
        await sendPassword(parent.email, context, "Cuenta creada", "WELCOME");
      } catch (emailError) {
        console.error("Error sending email", emailError);
      }

      const profileData = {
        ...parent,
        id: uid,
        password,
        roles: roles || ["user"],
        schoolId,
        avatar: null,
        isFirstTime: roles.includes("user") || roles.includes("tutor"),
        isNeedPinDrop: roles.includes("user"),
      };

      await firestore().collection("profile").doc(uid).set(profileData);
      return { id: uid, ...profileData };
    };

    const [fatherProfile, motherProfile] = await Promise.all([
      includeFather ? createParentProfileServer(father, ["user"]) : null,
      includeMother ? createParentProfileServer(mother, ["user"]) : null,
    ]);

    studentData.schoolId = schoolId;
    studentData.fullName = [
      studentData?.name?.toLowerCase(),
      studentData?.lastName?.toLowerCase(),
      studentData?.secondLastName?.toLowerCase(),
    ].filter(Boolean);

    studentData.createdAt = firestore.FieldValue.serverTimestamp();
    studentData.isDeleted = false;

    // Tutors
    const tutorsData = [];
    for (let i = 0; i < countTutors; i++) {
      const tutorKey = `tutors_${i}`;
      if (data[tutorKey]) {
        tutorsData.push(data[tutorKey]);
        delete studentData[tutorKey];
      }
    }
    const tutorProfilesTemp = await Promise.all(
      tutorsData.map((tutor) => createParentProfileServer(tutor, ["tutor"])),
    );

    const studentRef = firestore().collection("students").doc();

    const parentsRefs = [];
    const updates = [];

    if (fatherProfile?.id) {
      updates.push(
        firestore()
          .collection("profile")
          .doc(fatherProfile.id)
          .update({
            students: firestore.FieldValue.arrayUnion(studentRef),
          }),
      );
      parentsRefs.push(firestore().collection("profile").doc(fatherProfile.id));
    }
    if (motherProfile?.id) {
      updates.push(
        firestore()
          .collection("profile")
          .doc(motherProfile.id)
          .update({
            students: firestore.FieldValue.arrayUnion(studentRef),
          }),
      );
      parentsRefs.push(firestore().collection("profile").doc(motherProfile.id));
    }

    const tutorsRefs = [];
    tutorProfilesTemp.forEach((tProfile) => {
      if (tProfile?.id) {
        updates.push(
          firestore()
            .collection("profile")
            .doc(tProfile.id)
            .update({
              students: firestore.FieldValue.arrayUnion(studentRef),
            }),
        );
        tutorsRefs.push(firestore().collection("profile").doc(tProfile.id));
      }
    });

    studentData.parents = parentsRefs;
    studentData.tutors = tutorsRefs;
    studentData.tutorActive = null;

    updates.push(studentRef.set(studentData));

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: "Estudiante creado correctamente",
      id: studentRef.id,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT() {
  const students = await firestore().collection("students").get();
  students.docs.forEach(async (doc) => {
    const data = doc.data();
    const fullName = [
      data.name?.toLowerCase(),
      data.lastName?.toLowerCase(),
      data.secondLastName?.toLowerCase(),
    ].filter(Boolean);
    await firestore().collection("students").doc(doc.id).update({ fullName });
  });
  return NextResponse.json({ message: "ok" });
}
