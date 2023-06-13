import Sidebar from '@/components/Sidebar';

const DashboardLayout = ({children}) => {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
}

export default DashboardLayout;