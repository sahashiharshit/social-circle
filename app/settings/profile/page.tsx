import ProfileGallery from "@/components/settings/ProfileGallery";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";




export default async function ProfileMediaSettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        return null;
    }
 
  
  return (
    <div className="max-w-6xl">
      <ProfileGallery />
    </div>
  );
}
