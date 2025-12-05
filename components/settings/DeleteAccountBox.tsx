"use client";

import { deleteAccount } from "@/app/actions/account";
import { useState } from "react";

export function DeleteAccountBox() {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [text, setText] = useState("");

  return (
    <div className="space-y-3 border rounded-lg p-4 bg-red-500/5 border-red-500/40">
      <h3 className="font-medium text-sm text-red-500">Danger zone</h3>
      <p className="text-xs opacity-80">
        Deleting your account is permanent and cannot be undone.
      </p>

      
      {!confirmVisible && (
        <button
          type="button"
          onClick={() => setConfirmVisible(true)}
          className="rounded-md border border-red-500/60 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10"
        >
          Delete account
        </button>
      )}

     
      {confirmVisible && (
        <div className="space-y-3 animate-in fade-in">
          <p className="text-xs opacity-80">
            Type <span className="font-bold text-red-600">DELETE</span> to confirm.
          </p>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500/60"
          />

          <form action={deleteAccount}>
            <input type="hidden" name="confirm" value={text} />
            <button
              disabled={text !== "DELETE"}
              className={`rounded-md px-4 py-2 text-xs font-medium text-white 
                ${
                  text === "DELETE"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-400 opacity-50 cursor-not-allowed"
                }`}
            >
              Confirm delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
