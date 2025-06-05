// components/VideoPlaylist.tsx

import { Box } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";

interface VideoPlaylistProps {
  sources: string[];        // mảng URL (so với public/) như ["/bongda.mp4", "/traicay.mp4", "/xe.mp4"]
  width?: string | number;  // chiều rộng của video, ví dụ "100%" hoặc 320
  height?: string | number; // chiều cao (thường để "auto" hoặc một giá trị cụ thể)
}

export default function VideoPlaylist({
  sources,
  width = "100%",
  height = "auto",
}: VideoPlaylistProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mỗi khi currentIndex thay đổi, cập nhật src rồi gọi play()
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.src = sources[currentIndex];
    // Nếu muốn đảm bảo video tự play ngay khi chuyển, gọi play()
    // (chú ý: trong một số trình duyệt, nếu không được người dùng tương tác trước,
    //  việc autoplay có thể bị chặn. Ở đây mặc định dùng muted để tăng khả năng autoplay)
    videoRef.current.play().catch(() => {
      /* nếu bị chặn autoplay, có thể xử lý ở đây (ví dụ: show nút play) */
    });
  }, [currentIndex, sources]);

  // Khi video kết thúc, tăng index (và quay về 0 nếu đã ở cuối mảng)
  const handleEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % sources.length);
  };

  return (
    <Box w={width} h={height} overflow="hidden" borderRadius="md">
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        muted
        autoPlay
        onEnded={handleEnded}
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
}
