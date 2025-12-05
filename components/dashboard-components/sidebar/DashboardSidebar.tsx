"use client"
import { FALLBACK_AVATAR } from "@/lib/fallbackImage";
import { FriendList, IncomingRequest, Suggestions } from "@/types/Friends";
import Image from "next/image";
import { useState } from "react";

export default function DashboardSidebar({ friends, suggestions, requests }: { friends: FriendList[], suggestions: Suggestions[], requests: IncomingRequest[] }) {
  const [friendslist, setFriendslist] = useState(friends);
  const [suggestionslist, setSuggestionslist] = useState(suggestions);
  const [requestslist, setRequestslist] = useState(requests);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const setLoading = (id: string, on: boolean) => {
    setLoadingIds(prev =>
      on ? [...prev, id] : prev.filter(x => x !== id)
    );
  };

  async function handleSendRequest(userId: string) {
    setLoading(userId, true);
    try {
      const res = await fetch('/api/friends/request', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: userId }),
      });
      if (res.ok) {
        setSuggestionslist(prev => prev.filter(s => s.id !== userId));
      }

    } finally {
      setLoading(userId, false);
    }
  }

  async function handleRespond(requestId: string, action: "ACCEPT" | "REJECT") {
    setLoading(requestId, true);
    try {
      const res = await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      if (res.ok) {
        const request = requests.find(r => r.id === requestId);
        setRequestslist(prev => prev.filter(r => r.id !== requestId));

        if (action === "ACCEPT" && request) {
          setFriendslist(prev => [request.requester, ...prev]);
        }
      }
    } finally {
      setLoading(requestId, false);
    }
  }

  const isLoading = (id: string) => loadingIds.includes(id);
  return (
    <>
      <div className="w-full h-full p-3 space-y-6">
       
        <div>
          <h2 className="text-sm font-semibold mb-2">Friend Requests</h2>
          {requestslist.length === 0 ? (
            <p className="text-xs opacity-60">No pending requests</p>
          ) : (
            <div className="space-y-2">
              {requestslist.map(req => (
                <div key={req.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={req.requester.image || FALLBACK_AVATAR}
                      width={28}
                      height={28}
                      className="rounded-full"
                      alt={req.requester.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_AVATAR
                      }}
                    />
                    <span className="text-sm">{req.requester.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-1 text-xs rounded bg-green-500 text-white disabled:opacity-60"
                      disabled={isLoading(req.id)}
                      onClick={() => handleRespond(req.id, "ACCEPT")}
                    >
                      Accept
                    </button>
                    <button
                      className="px-2 py-1 text-xs rounded bg-gray-500 text-white disabled:opacity-60"
                      disabled={isLoading(req.id)}
                      onClick={() => handleRespond(req.id, "REJECT")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

       
        <div>
          <h2 className="text-sm font-semibold mb-2">Your Friends</h2>
          {friendslist.length === 0 ? (
            <p className="text-xs opacity-60">No friends yet</p>
          ) : (
            <div className="space-y-2">
              {friendslist.map(friend => (
                <div key={friend.id} className="flex items-center gap-2">
                  <Image
                    src={friend.image || FALLBACK_AVATAR}
                    width={28}
                    height={28}
                    className="rounded-full"
                    alt={friend.name}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_AVATAR
                    }}
                  />
                  <span className="text-sm">{friend.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

       
        <div>
          <h2 className="text-sm font-semibold mb-2">Suggestions</h2>
          {suggestionslist.length === 0 ? (
            <p className="text-xs opacity-60">No suggestions</p>
          ) : (
            <div className="space-y-2">
              {suggestionslist.map(s => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={s.image || FALLBACK_AVATAR}
                      width={28}
                      height={28}
                      className="rounded-full"
                      alt={s.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_AVATAR
                      }}
                    />
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <button
                    className="px-2 py-1 text-xs rounded bg-blue-500 text-white disabled:opacity-60"
                    disabled={isLoading(s.id)}
                    onClick={() => handleSendRequest(s.id)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>

  );
}