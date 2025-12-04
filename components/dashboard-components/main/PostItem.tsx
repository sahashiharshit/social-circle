import PostCard from "@/components/dashboard-components/main/Postcard";

export default async function PostItem({ post }: { post: any }) {
  return <PostCard post={post} />;
}
