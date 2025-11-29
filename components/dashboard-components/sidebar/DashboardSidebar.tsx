import { FriendList, Suggestions } from "@/types/Friends";
import Image from "next/image";

export default function  DashboardSidebar({friends,suggestions}:{friends:FriendList[],suggestions:Suggestions[]}){

    return(
        <>
<div>
              <h2 className="text-sm font-semibold mb-2">Your Friends</h2>
              <div className="space-y-2">
                {friends.length === 0 && (
                  <p className="text-xs opacity-60">No friends yet 😢</p>
                )}
                {friends.map(friend => (
                  <div key={friend.id} className="flex items-center gap-2">
                    <Image
                      src={friend.image ?? "/logo.png"}
                      width={32}
                      height={32}
                      className="rounded-full"
                      alt={friend.name}
                    />
                    <p className="text-sm">{friend.name}</p>
                  </div>
                ))}
              </div>
            </div>
        
                <hr className="my-4 border-gray-300"/>
            <div>
              <h2 className="text-sm font-semibold mb-2">Suggestions</h2>
              <div className="space-y-2">
                {suggestions.map(s => (
                  <div key={s.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src={s.image ?? "/logo.png"}
                        width={32}
                        height={32}
                        className="rounded-full"
                        alt={s.name}
                      />
                      <p className="text-sm">{s.name}</p>
                    </div>

                    <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
            </>

    );
}