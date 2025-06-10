// components/VideoPlaylist.tsx

import { Box } from "@chakra-ui/react";
import { useRef, useState, useEffect, useMemo } from "react";

interface VideoPlaylistProps {
  // sources có thể là 1 string hoặc 1 mảng string
  sources: string | string[];
  width?: string | number;  // ví dụ "100%" hoặc 320
  height?: string | number;
  loop?: boolean
}

export default function VideoPlaylist({
  sources,
  width = "100%",
  height = "auto",
  loop = false
}: VideoPlaylistProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const videoSources: string[] = useMemo(
    () => (Array.isArray(sources) ? sources : [sources]),
    [sources]
  );

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.src = videoSources[currentIndex];
    videoRef.current
      .play()
      .catch(() => {
        /* Nếu autoplay bị chặn, xử lý thêm ở đây nếu cần (ví dụ: hiển thị nút Play) */
      });
  }, [currentIndex, videoSources]);

  // Khi video kết thúc, chuyển sang video kế tiếp (hoặc về video đầu nếu hết mảng)
  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % videoSources.length);
  };

  return (
    <Box w={width} h={height} overflow="hidden" borderRadius="md">
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        muted
        loop = {loop}
        autoPlay
        onEnded={handleEnded}
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
}
