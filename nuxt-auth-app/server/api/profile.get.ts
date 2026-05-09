import { IUser } from "../models/User"
import { getUserFromToken } from "../utils/auth"

export default defineEventHandler(async(event)=>{
    

const user = await getUserFromToken(event) as IUser

return{
    status:true,
    statusCode:200,
    message:"user profile",
    data:user
}

})