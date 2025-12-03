"use client";

import { useState } from "react";

export default function AccountComponents() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = (e.target as HTMLFormElement)
      .querySelector("input[type='file']") as HTMLInputElement;

    if (!fileInput.files?.length) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setSuccess("");

    const res = await fetch("/api/account/profile-image", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      setSuccess("Profile image updated!");
    } else {
      setSuccess("Failed to update.");
    }
  };

  return (
    <div className="max-w-xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Account</h2>
        <p className="opacity-75 text-sm">
          Manage your login, password, and profile picture.
        </p>
      </section>

      {/* PROFILE IMAGE UPDATE */}
      <section className="space-y-3 border rounded-lg p-4 bg-background/70">
        <h3 className="font-medium text-sm">Profile Image</h3>

        <form className="space-y-4" onSubmit={handleImageUpload}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-accent overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs opacity-50">
                  No Image
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={onImageChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            {loading ? "Uploading..." : "Update Image"}
          </button>
        </form>

        {success && <p className="text-xs opacity-70 pt-1">{success}</p>}
      </section>

      {/* PASSWORD SECTION */}
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
  );
}
