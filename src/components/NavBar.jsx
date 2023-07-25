"use client";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { signOut } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NavBar = () => {
  const { user, profile, school } = useAuthContext();
  const router = useRouter();
  const { name: schoolName, logo } = school || {};
  const { name, avatar } = profile || {};
  const logoSrc = logo || "/rutes_logo_grey.png";
  const avatarSrc = avatar ? avatar : "/person.png";

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      return alert(error.message);
    }
    return router.push("/signin");
  };

  return (
    <div className="flex justify-between items-center h-15 bg-yellow text-white fixed w-full z-10">
      <div className="flex items-center">
        <Image
          src={logoSrc}
          alt="l-sc"
          className="ml-10"
          priority
          width={32}
          height={32}
        />
        <h1 className="text-2xl font-bold ml-5">{schoolName || ""}</h1>
      </div>
      <div className="flex items-center mr-10">
        {user ? (
          <>
            {/* <Link href="/admin">
                <p className="font-bold m-2">Mensajes</p>
              </Link> */}
            <div className="flex flex-row items-center">
              <Image
                src={avatarSrc}
                alt="avatar"
                className="m-2 rounded-full ring-2 ring-white"
                priority
                width={32}
                height={32}
              />
              <span className="">{name || ""}</span>
            </div>
            <Link href="/dashboard/admin">
              <p className="font-bold m-2">Admin</p>
            </Link>
            <div onClick={handleLogout} className="cursor-pointer">
              <p className="font-bold m-2">Cerrar sesión</p>
            </div>
          </>
        ) : (
          <Link href="/signin">
            <p className="font-bold m-2">Iniciar sesión</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
