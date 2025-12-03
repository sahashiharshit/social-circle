import AccountComponents from "@/components/settings/AccountComponent";
import { auth } from "@/lib/auth";
import { deleteFromS3, keyFromImageUrl, uploadProfileImageToS3 } from "@/lib/cloudFunctions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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
  async function updateProfileImage(formData: FormData) {
    "use server";
    const currentSession = await auth.api.getSession({
      headers: await headers(),
    });
    const currentUser = currentSession?.user;
    if (!currentUser) {
      redirect("/signup?redirectTo=/settings/account");
    }
    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      // nothing to upload
      return;
    }
    const userRecord = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { id: true, image: true },
    });
    if (!userRecord) return;

    const oldImageUrl = userRecord.image ?? null;
    // 1. Upload new image
    const { url:newUrl, fileName: key } = await uploadProfileImageToS3(
      file,
      userRecord.id
    );

    // 2. Update DB, rollback upload if update fails
    try {
      await prisma.user.update({
        where: { id: userRecord.id },
        data: {
          image: newUrl,
        },
      });
    } catch (err) {
      // DB update failed – remove the new image to avoid orphan
      await deleteFromS3(key).catch(() => { });
      throw err;
    }
    // 3. Delete old profile image from S3 (if any)
    if (oldImageUrl) {
      const oldKey = keyFromImageUrl(oldImageUrl);
      if (oldKey) {
        await deleteFromS3(oldKey).catch(() => { });
      }
    }

    revalidatePath("/settings/account");
  }
  return (
    //  <AccountComponents/>
    <div className="max-w-xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Account</h2>
        <p className="opacity-75 text-sm">
          Manage your password and profile picture.
        </p>
      </section>

      {/* PROFILE IMAGE UPDATE (server action form) */}
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
                  src={dbUser.image}
                  alt={dbUser.name ?? "Profile image"}
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

      {/* PASSWORD SECTION (still UI-only, backend to be wired if you want) */}
      <section className="space-y-3 border rounded-lg p-4 bg-background/70">
        <h3 className="font-medium text-sm">Change password</h3>
        <form className="space-y-3">
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="Current password"
          />
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="New password"
          />
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="Confirm new password"
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
      <section className="space-y-3 border rounded-lg p-4 bg-red-500/5 border-red-500/40">
        <h3 className="font-medium text-sm text-red-500">Danger zone</h3>
        <p className="text-xs opacity-80">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          type="button"
          className="rounded-md border border-red-500/60 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10"
        >
          Delete account
        </button>
      </section>
    </div>
  )
}
