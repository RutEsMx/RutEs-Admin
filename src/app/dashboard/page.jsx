import Image from "next/image"

export default async function Page() {
  // redirect('/dashboard/routes')
  return <div className="container mx-auto h-screen flex justify-center items-center">
    <div >
      <Image
        src="/rutes_logo.png"
        alt="Rutes Logo"
        width="350"
        height="350"
        priority
     />
    </div>
  </div>
}
