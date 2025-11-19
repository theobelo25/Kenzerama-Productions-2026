import Image from "next/image";
import loader from "@/assets/fade-stagger-circles.svg";

const LoadingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Image
        src={loader}
        alt="Loading..."
        width={0}
        height={0}
        sizes="50vw, 100vw"
        fetchPriority="high"
        loading="eager"
      />
    </div>
  );
};

export default LoadingPage;
