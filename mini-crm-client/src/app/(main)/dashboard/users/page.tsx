import { SheetForm } from './_components/add-user'
import { UsersSection } from './_components/users-section'
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

type AuthUser = {
  roles?: string[] | string;
};

// function hasAdminRole(user: AuthUser | null) {
//   const roleClaim =
//     user?.[
//       "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
//     ];
//   const roles = [user?.roles, user?.role, roleClaim]
//     .flat()
//     .filter((role): role is string => typeof role === "string")
//     .map((role) => role.trim().toLowerCase());

//   return roles.includes("admin");
// }

export default async function Page() {
  // if (!hasAdminRole(user)) {
  //   redirect("/forbidden");
  // }

  const user = (await getUser()) as AuthUser | null;

    const isAdmin = user?.roles?.includes("Admin") ?? false;

    if (!isAdmin) {
        redirect("/forbidden");
    }
  
  return (
    <>
        <div className="flex justify-between items-center mb-5">
            <div>
                <h1 className='text-2xl font-semibold'>Users</h1>
                <span className='text-muted-foreground text-sm'>Manage your organization members and their access.</span>
            </div>
            
            <SheetForm />
        </div>
        <UsersSection />
    </>
    
  )
}
