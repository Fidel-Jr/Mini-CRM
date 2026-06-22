import { cookies } from 'next/headers';


export async function POST(){

    const cookieStore =
        await cookies();


    cookieStore.delete(
        "access_token"
    );


    return Response.json({
        success:true
    });

}