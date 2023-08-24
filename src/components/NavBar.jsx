"use client";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { signOut } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { removeCookies } from "@/services/CookiesServices";
import {
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

const ADMIN = "admin";
const ADMIN_RUTES = "admin-rutes";

const NavBar = () => {
  const { user, profile, school } = useAuthContext();
  const router = useRouter();
  const { name: schoolName, logo } = school || {};
  const { name, avatar } = profile || {};
  const logoSrc = logo || "/rutes_logo_grey.png";
  const avatarSrc = avatar ? avatar : "/person.png";
  const isAdmin =
    profile?.roles?.includes(ADMIN) || profile?.roles?.includes(ADMIN_RUTES);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      return alert(error.message);
    }
    await removeCookies();
    return router.push("/signin");
  };

  return (
    <div className="flex justify-between items-center h-15 bg-yellow text-white fixed w-full z-10">
      <div className="flex flex-row">
        <div className="flex lg:hidden items-center">
          <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div className="flex items-center">
          <Image
            src={logoSrc}
            alt="l-sc"
            className="md:ml-10"
            priority
            width={32}
            height={32}
          />
          <h1 className="text-2xl font-bold ml-5">{schoolName || ""}</h1>
        </div>
      </div>
      <div className="flex items-center mr-6">
        {user ? (
          <>
            <div className="flex flex-row items-center me-4">
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
            {isAdmin && (
              <>
                <Link href="/dashboard/admin/school">
                  <Cog6ToothIcon
                    className="h-6 w-6 m-2 cursor-pointer"
                    aria-hidden="true"
                  />
                </Link>
                <div onClick={handleLogout} className="cursor-pointer">
                  <ArrowLeftOnRectangleIcon
                    className="h-6 w-6 m-2"
                    aria-hidden="true"
                  />
                </div>
              </>
            )}
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
