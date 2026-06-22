import { getUser } from '@/lib/auth';
import { SheetForm } from './_components/add-customer';
import { CustomersSection } from './_components/customers-section';

export default async function Page() {
    const user = await getUser();
    // console.log(user.email);
    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-2xl font-semibold">Customers</h1>
                    <span className="text-muted-foreground text-sm">
                        Manage customers and their information
                    </span>
                </div>

                {user?.roles.includes('Admin') && (
                    <SheetForm />
                )}
            </div>

            <CustomersSection />
        </>
    );
}