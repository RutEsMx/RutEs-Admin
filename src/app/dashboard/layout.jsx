import NavBar from '@/components/NavBar';
import Sidebar from '@/components/Sidebar';

const DashboardLayout = ({children}) => {
  return (
    <>
      <NavBar />
      <Sidebar>
        {children}
      </Sidebar>
    </>
  );
}

export default DashboardLayout;