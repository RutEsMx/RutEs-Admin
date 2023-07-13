'use client'
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { signOut } from '@/firebase/auth';
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const { user, profile } = useAuthContext()
  const router = useRouter()
  const school = {}
  const { name: schoolName, logo } = school 
  const { name, avatar } = profile || {}
  const logoSrc = logo ? logo : '/logo.png'
  const avatarSrc = avatar ? avatar : '/logo.png'
  
  const handleLogout = async () => {
    const {result, error} = await signOut()
    if (error) {
      return alert(error.message)
    }
    return router.push('/signin')
    
  }

  return (
    <div className="flex justify-between items-center h-15 bg-yellow text-white fixed w-full z-10">
      <div className="flex items-center">
        <img src={logoSrc} alt="logo-school" className="w-20 ml-10" />
        <h1 className="text-2xl font-bold ml-5">{schoolName || ''}</h1>
      </div>
      <div className="flex items-center mr-10">
        {
          user ? (
            <>
              {/* <Link href="/admin">
                <p className="font-bold m-2">Mensajes</p>
              </Link> */}
              <div className="flex flex-row items-center">
                <img src={avatarSrc} alt="avatar" className="w-20 m-2" />
                <span className="">{name || 'Administrador Escuela'}</span>
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
          )
        }
      </div>
    </div>
  );
}

export default NavBar;