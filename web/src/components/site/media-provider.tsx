"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { VideoPopOver, type VideoSource } from "@/components/skiper/video-player";
import { DocViewer } from "@/components/site/doc-viewer";
import { coverOf, type Item, isSafeUrl, localize, splitTitle, VIDEO_RE } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

/* Any card on any page opens its piece here: films in the video overlay,
   documents and images in the page viewer. */
const MediaContext = createContext<(item: Item) => void>(() => {});
export const useOpenMedia = () => useContext(MediaContext);

export function MediaProvider({ children }: { children: ReactNode }) {
  const { copy, locale } = useI18n();
  const [doc, setDoc] = useState<Item | null>(null);
  const [video, setVideo] = useState<VideoSource | null>(null);

  const open = useCallback(
    (item: Item) => {
      if (item.type === "video" && isSafeUrl(item.fileUrl) && VIDEO_RE.test(item.fileUrl)) {
        const [title] = splitTitle(localize(item.title, locale));
        setVideo({ src: item.fileUrl, poster: coverOf(item), width: item.width, height: item.height, title });
      } else setDoc(item);
    },
    [locale],
  );

  const closeDoc = useCallback(() => setDoc(null), []);
  const closeVideo = useCallback(() => setVideo(null), []);

  return (
    <MediaContext.Provider value={open}>
      {children}
      <DocViewer item={doc} onClose={closeDoc} />
      <VideoPopOver video={video} onClose={closeVideo} closeLabel={copy.viewer.close} />
    </MediaContext.Provider>
  );
}
