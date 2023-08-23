import { customInitApp } from "@/firebase/admin";
import { getStorage } from "firebase-admin/storage";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";

const bucket = getStorage(customInitApp()).bucket();

const uploadFile = async (file, destination) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name}`;
  const path = `/tmp/${filename}`;
  await writeFile(path, buffer);
  const options = {
    destination: `${destination}/${filename}`,
  };

  return await bucket.upload(path, options);
};

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("avatar");
  const type = data.get("type") || "profiles";
  !file &&
    NextResponse.json({
      success: false,
      message: "No se ha enviado ninguna imagen",
    });

  const responseUpdload = await uploadFile(file, type);
  const filename = responseUpdload[0].name;

  return NextResponse.json({
    success: true,
    result: filename,
    message: "Imagen subida correctamente",
  });
}
