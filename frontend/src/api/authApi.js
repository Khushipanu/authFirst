import apiClient from "./apiClient"

export const registerUser=async(userdata)=>{
       try{
            const response=await apiClient.post("/auth/register",userdata);
            if(response.data.message!=="User registered successfully"){
                throw new Error(response.data.message || "regitrations failed")
            }
              return response.data;
          
       }catch(err){
        throw err;


       }

       
}
