import Navbar from "@/components/custom/Navbar"
import Sidebar from "@/components/custom/Sidebar"
import { getApiLimitCount } from "@/lib/apiLimit"
const DashboardLayout = async ({children} : {
    children: React.ReactNode
}) => {

  const apiLimitCount = await getApiLimitCount();

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-800">
        <Sidebar apiLimitCount={apiLimitCount} />
      </div>
      <main className="md:pl-72">
        <Navbar apiLimitCount={apiLimitCount} />
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout