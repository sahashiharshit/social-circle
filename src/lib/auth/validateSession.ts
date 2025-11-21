import redis from "@/src/lib/redis"
import { ObjectId } from "mongodb"
import { users } from "@/src/lib/mongodb"
import { cookies } from "next/headers"
export async function validateSession() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value
    if(!sessionId) return null
    const key = `session:${sessionId}`
    const sessionData = await redis.get(key)
    if(!sessionData) return null

    let userId:string
    try {
        const parsed = JSON.parse(sessionData)
        userId = parsed.userId
    } catch {
        userId = sessionData
    }
    const user = await users.findOne({_id:new ObjectId(userId)},{projection:{name:1,email:1}})
    return user
    ?{id:user._id.toString(),email:user.email,name:user.name}
    :null;
}