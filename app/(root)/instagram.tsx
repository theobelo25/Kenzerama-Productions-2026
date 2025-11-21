import { getInstagramPosts } from "@/lib/actions/api.actions";
import { InstagramPost } from "@/types";
import InstagramPostComponent from "@/components/shared/carousel/instagram-post";
import CarouselComponent from "@/components/shared/carousel";

const Instagram = async () => {
  const response = await getInstagramPosts();
  const instagramPosts = response?.data.slice(0, 5);
  console.log(instagramPosts);

  return (
    <section className="bg-background-grey py-10">
      <div className="wrapper space-y-10 py-0">
        <h2 className="relative h2-subheading text-white">
          Follow us on Instagram!
        </h2>
        <CarouselComponent posts={instagramPosts} />
        {/* <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {instagramPosts.map((post: InstagramPost) => (
            <li key={post.id}>
              <InstagramPostComponent post={post} />
            </li>
          ))}
        </ul> */}
      </div>
    </section>
  );
};

export default Instagram;
