import InlineLoadingSpinner from "@/components/loading/inline-loading-spinner";
import VideoComponent from "@/components/media/video-component";
import type { Film } from "@/types";

type FilmDetailVideoProps = {
  /** When null, shows the reserved aspect ratio and a loading state (matches loading route). */
  film: Film | null;
};

/**
 * Film hero player: `nestShell` inside `aspect-video` so height is reserved before Mux reports dimensions.
 */
export default function FilmDetailVideo({ film }: FilmDetailVideoProps) {
  return (
    <div className="relative wrapper">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {film ? (
          <VideoComponent
            nestShell
            priorityPoster
            video={film.video}
            autoplay={false}
            controls={true}
            muted={true}
            playsInline={true}
            preload="metadata"
            videoClassName="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-muted/40"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="pointer-events-none flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs text-white backdrop-blur-md">
              <InlineLoadingSpinner />
              <span className="font-questrial">Loading</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
