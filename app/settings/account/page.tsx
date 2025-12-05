
import { changePassword, updateProfileImage } from "@/app/actions/account";
import { DeleteAccountBox } from "@/components/settings/DeleteAccountBox";
import { auth } from "@/lib/auth";
import { FALLBACK_AVATAR } from "@/lib/fallbackImage";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";


export default async function AccountSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  if (!user) {
    redirect("/signup?redirectTo=/settings/account");
  }
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      image: true,
      email: true,
      name: true,
    },
  });
  if (!dbUser) {
    redirect("/signup?redirectTo=/settings/account");
  }
 
  return (
   
    <div className="max-w-xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Account</h2>
        <p className="opacity-75 text-sm">
          Manage your password and profile picture.
        </p>
      </section>

      <section className="space-y-3 border rounded-lg p-4 bg-background/70">
        <h3 className="font-medium text-sm">Profile Image</h3>

        <form
          className="space-y-4"
          action={updateProfileImage}
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-accent overflow-hidden flex items-center justify-center">
              {dbUser.image ? (
                <Image
                  src={dbUser.image || FALLBACK_AVATAR}
                  alt={dbUser.name || "Profile image"}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-full"
                />
              ) : (
                <span className="text-xs opacity-50">No Image</span>
              )}
            </div>

            <input
              type="file"
              name="image"
              accept="image/*"
              className="text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Update Image
          </button>
        </form>
      </section>

    
      <section className="space-y-3 border rounded-lg p-4 bg-background/70">
        <h3 className="font-medium text-sm">Change password</h3>
        <form className="space-y-3"action={changePassword}>
         <input
            type="password"
            name="currentPassword"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="Current password"
            required
          />
          <input
            type="password"
            name="newPassword"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="New password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="Confirm new password"
            required
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Update password
          </button>
        </form>
      </section>

      {/* DANGER ZONE */}
     <DeleteAccountBox/>
    </div>
  )
}
