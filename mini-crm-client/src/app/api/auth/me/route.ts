import { cookies } from 'next/headers';



export async function GET(){

    const token = (await cookies())
                    .get("access_token")
                    ?.value;
    const rtoken = (await cookies())
                    .get("refresh_token")
                    ?.value;

    console.log("Setting cookiess:", token);
    console.log("Setting rrrcookiess:", rtoken);

    if(!token)
        return Response.json(null);


    const response = await fetch(
        "https://localhost:7187/api/Auth/me",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    if(response.status === 401){
        return Response.json(null,{
            status:401
        });
    }

    const user = await response.json();

    return Response.json(user);

}
