import Image from "next/image";

const LogoLayout = () => (
  <div>
    <Image src="/rutes_logo.png" alt="Rutes" width={150} height={70} priority />
  </div>
);

export default LogoLayout;
