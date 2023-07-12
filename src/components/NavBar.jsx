// NavBar component
// with logo and links to other pages
// --------------------------------------------------------

import Link from 'next/link';

const NavBar = () => {
  const school = {}
  const user = {}
  const { name: schoolName, logo } = school 
  const { name, avatar} = user
  const logoSrc = logo ? logo : '/logo.png'
  const avatarSrc = avatar ? avatar : '/logo.png'

  return (
    <div className="flex justify-between items-center h-15 bg-yellow text-white fixed w-full z-10">
      <div className="flex items-center">
        <img src={logoSrc} alt="logo-school" className="w-20 ml-10" />
        <h1 className="text-2xl font-bold ml-5">{schoolName || ''}</h1>
      </div>
      <div className="flex items-center mr-10">
        <Link href="/admin">
          <p className="font-bold m-2">Mensajes</p>
        </Link>
        <div className="flex flex-row items-center">
          <img src={avatarSrc} alt="avatar" className="w-20 m-2" />
          <span className="">{name || 'Administrador Escuela'}</span>
        </div>
        <Link href="/dashboard/admin">
          <p className="font-bold m-2">Admin</p>
        </Link>
        <Link href="/logout">
          <p className="font-bold m-2">Cerrar sesión</p>
        </Link>
      </div>
    </div>
  );
}

export default NavBar;