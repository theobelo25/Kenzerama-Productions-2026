import { getInstagramPosts } from "@/lib/actions/api.actions";
import CarouselComponent from "@/components/shared/carousel";

const Instagram = async () => {
  const response = await getInstagramPosts();
  const instagramPosts = response?.data.slice(0, 5);

  return (
    <section className="bg-ring py-10">
      <div className="wrapper space-y-10 py-0">
        <h2 className="relative h2-subheading text-white">
          Follow us on Instagram!
        </h2>
        {instagramPosts && instagramPosts.length > 0 && (
          <CarouselComponent posts={instagramPosts} />
        )}
      </div>
    </section>
  );
};

export default Instagram;
