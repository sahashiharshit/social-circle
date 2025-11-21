import { createClient } from "redis";
const client = createClient({
    url:process.env.REDIS_URL,
});
client.on("error",(err)=>{
    console.error("Redis Client Error:",err);

});
let redis:ReturnType<typeof createClient>;
if(!global.redis){
    global.redis =client;
    client.connect();
}
redis = global.redis;
export default redis;

declare global {
    var redis:ReturnType<typeof createClient> |undefined;
}