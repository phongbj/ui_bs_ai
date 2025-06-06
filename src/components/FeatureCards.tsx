import { CloseButton } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Image as ChakraImage,
  Flex,
  Heading,
  Input,
  Text,
  VStack
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const BASE_URL = "http://localhost:8000";

type ClassificationResponse = {
  status: "success";
  type: "classification";
  class_id: number;
  confidence: number; // server returns 0–1, UI converts to %
  annotated_image: string; // e.g. "/images/xxx_annotated.png"
};

type DetectResponse = {
  status: "success";
  type: "detection";
  detections: Array<{
    class_id: number;
    confidence: number; // 0–1
    bbox: [number, number, number, number];
  }>;
  annotated_image: string; // e.g. "/images/xxx_annotated.png"
};

type SegmentResponse = {
  status: "success";
  type: "segmentation";
  mask_image: string; // e.g. "/images/xxx_mask.png"
  annotated_image: string; // e.g. "/images/xxx_annotated.png"
  confidences: number[]; // percentages like [87.3, 45.9, …]
};

type ApiResponse = ClassificationResponse | DetectResponse | SegmentResponse;

export default function FeatureCards() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const cards = [
    {
      title: "Classification with YOLOv8",
      desc: "Phân loại hình ảnh chính xác nhờ sức mạnh của YOLOv8.",
      mode: "class",
      img: "/classification.jpg"
    },
    {
      title: "Object Detection with YOLOv8",
      desc: "Phát hiện đối tượng nhanh chóng và chính xác.",
      mode: "detect",
      img: "/detection.jpg"
    },
    {
      title: "Segmentation with YOLOv8",
      desc: "Phân vùng ảnh chi tiết, hỗ trợ xử lý ảnh y tế và nhiều lĩnh vực khác.",
      mode: "segment",
      img: "/segementation.jpg"
    },
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [expanded]);

  // 1. Lưu DataURL để hiển thị preview
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  // 2. Lưu file object để gửi lên API
  const [fileObject, setFileObject] = useState<File | null>(null);

  // 3. ApiResponse chung cho cả 3 loại
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  // ẩn <input type="file">, kích hoạt bằng nút
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Khi user chọn file, lưu File object & tạo DataURL để preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileObject(f);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewURL(reader.result);
      }
    };
    reader.readAsDataURL(f);
  };

  // Khi user bấm “Submit”, gọi đúng endpoint dựa trên `expanded` (mode)
  const handleSubmit = async () => {
    if (!fileObject || !expanded) return;

    const endpoint =
      expanded === "class"
        ? "/medical/classify"
        : expanded === "detect"
          ? `/medical/detect?confidence=0.25`
          : "/medical/segment";

    const url = BASE_URL + endpoint;
    const formData = new FormData();
    formData.append("file", fileObject);

    try {
      const resp = await fetch(url, {
        method: "POST",
        body: formData,
        // Nếu bạn có JWT auth, thêm header Authorization ở đây, ví dụ:
        // headers: { "Authorization": "Bearer " + yourToken }
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${text}`);
      }
      const data = await resp.json();

      if (data.type === "classification") {
        // server trả confidence 0–1, UI convert sang %
        const confPercent = Number((data.confidence * 100).toFixed(2));
        const result: ClassificationResponse = {
          status: data.status,
          type: "classification",
          class_id: data.class_id,
          confidence: confPercent,
          annotated_image: data.annotated_image,
        };
        setApiResponse(result);
      } else if (data.type === "detection") {
        const dets = data.detections.map((d: { class_id: number; confidence: number; bbox: [number, number, number, number]; }) => ({
          class_id: d.class_id,
          confidence: Number((d.confidence * 100).toFixed(2)),
          bbox: d.bbox as [number, number, number, number],
        }));
        const result: DetectResponse = {
          status: data.status,
          type: "detection",
          detections: dets,
          annotated_image: data.annotated_image,
        };
        setApiResponse(result);
      } else if (data.type === "segmentation") {
        // confidences server trả dưới dạng phần trăm (round(score*100,1))
        const result: SegmentResponse = {
          status: data.status,
          type: "segmentation",
          mask_image: data.mask_image,
          annotated_image: data.annotated_image,
          confidences: data.confidences as number[],
        };
        setApiResponse(result);
      } else {
        // Unexpected type
        console.error("Unexpected type:", data);
        setApiResponse(null);
      }
    } catch (err) {
      console.error(err);
      setApiResponse(null);
      alert("Có lỗi khi gọi API: " + (err as Error).message);
    }
  };

  // Sắp xếp card sao cho card đang mở (expanded) lên đầu
  const orderedCards = expanded
    ? [
      ...cards.filter((c) => c.mode === expanded),
      ...cards.filter((c) => c.mode !== expanded),
    ]
    : cards;

  return (
    <Flex
      zIndex={3}
      mb={30}
      position="relative"
      mt={10}
      px={10}
      gap={6}
      flexWrap="wrap"
      className="flex justify-center md:flex-row flex-col"
    >
      {orderedCards.map((card) => {
        const isOpen = expanded === card.mode;
        return (
          <Box
            key={card.mode}
            bg="whiteAlpha.800"
            borderRadius="xl"
            p={6}
            className={`${expanded !== null
                ? isOpen
                  ? "max-w-full"
                  : "md:max-w-[49.15%] max-w-[100%]"
                : "md:max-w-[32.2%] max-w-[100%]"
              }`}
            w="full"
            transition="all 0.5s ease"
            boxShadow={isOpen ? "2xl" : "md"}
            transform={isOpen ? "scale(1.03)" : "scale(1)"}
            cursor="pointer"
            onClick={() => {
              // Mở/đóng card này. Nếu đang mở lại bấm thì đóng
              setExpanded((prev) => (prev === card.mode ? null : card.mode));

              // Khi chuyển sang mode mới, reset preview & kết quả
              setPreviewURL(null);
              setFileObject(null);
              setApiResponse(null);
            }}
          >
            <Heading fontSize="xl" mb={2}>
              {card.title}
            </Heading>
            <Text mb={2}>{card.desc}</Text>
            {expanded === null && (
              <AspectRatio
                ratio={4 / 3}
                w="100%"
                maxH="400px"
                borderRadius="md"
                overflow="hidden"
                mb={4}
              >
                <ChakraImage
                  src={card.img}
                  alt="Preview"
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              </AspectRatio>
            )
            }
            {/* Nội dung chi tiết chỉ hiện khi isOpen === true */}
            <Box
              mt={4}
              bg="whiteAlpha.900"
              borderRadius="xl"
              boxShadow={isOpen ? "2xl" : "md"}
              w="full"
              hidden={!isOpen}
              onClick={(e) => e.stopPropagation()}
            >
              <Box p={6}>
                <Flex gap={6} flexDir={{ base: "column", md: "row" }}>
                  {/* --------- BÊN TRÁI: UPLOAD / PREVIEW IMAGE --------- */}
                  <Box
                    flex="1"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      display="none"
                      onChange={handleFileChange}
                    />

                    <Box
                      h={{ base: "200px", md: "250px" }}
                      w="100%"
                      border="1px dashed"
                      borderColor="gray.300"
                      borderRadius="md"
                      position="relative"
                      overflow="hidden"
                    >
                      {previewURL ? (
                        <ChakraImage
                          src={previewURL}
                          alt="Preview"
                          objectFit="contain"
                          w="100%"
                          h="100%"
                          borderRadius="md"
                        />
                      ) : (
                        <Center h="100%" flexDir="column" gap={2}>
                          <Text color="gray.400">Chưa có ảnh nào được chọn</Text>
                          <Button
                            size="sm"
                            colorScheme="orange"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            Upload Image
                          </Button>
                        </Center>
                      )}

                      {previewURL && (
                        <CloseButton
                          position="absolute"
                          top="-2"
                          right="-2"
                          _hover={{ color: "red" }}
                          onClick={() => {
                            setPreviewURL(null);
                            setFileObject(null);
                            setApiResponse(null);
                          }}
                        />
                      )}
                    </Box>

                    <Flex mt={4} justify="space-between">
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewURL(null);
                          setFileObject(null);
                          setApiResponse(null);
                        }}
                        disabled={!previewURL}
                      >
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="orange"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubmit();
                        }}
                        disabled={!previewURL}
                      >
                        Submit
                      </Button>
                    </Flex>
                  </Box>

                  {/* --------- BÊN PHẢI: HIỂN THỊ KẾT QUẢ --------- */}
                  <Box
                    flex="1"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                  >
                    {apiResponse ? (
                      <>
                        {/* Common: Status */}
                        <Flex justify="space-between" mb={2}>
                          <Text fontWeight="bold">Status:</Text>
                          <Text>{apiResponse.status}</Text>
                        </Flex>
                        <Flex justify="space-between" mb={4}>
                          <Text fontWeight="bold">Type:</Text>
                          <Text>{apiResponse.type}</Text>
                        </Flex>

                        {apiResponse.type === "classification" && (
                          <VStack align="stretch" gap={3}>
                            <Flex justify="space-between">
                              <Text fontWeight="bold">Class ID:</Text>
                              <Text>{apiResponse.class_id}</Text>
                            </Flex>
                            <Flex justify="space-between">
                              <Text fontWeight="bold">Confidence:</Text>
                              <Text>{apiResponse.confidence}%</Text>
                            </Flex>
                            <Box>
                              <Text fontWeight="bold" mb={1}>
                                Annotated Image:
                              </Text>
                              <ChakraImage
                                src={`${BASE_URL}${apiResponse.annotated_image}`}
                                alt="Annotated"
                                borderRadius="md"
                                w="100%"
                                maxH="200px"
                                objectFit="contain"
                              />
                            </Box>
                          </VStack>
                        )}

                        {apiResponse.type === "detection" && (
                          <VStack align="stretch" gap={3}>
                            {/* <Box>
                              <Text fontWeight="bold" mb={1}>
                                Detections:
                              </Text>
                              <Box gap={1}>
                                {apiResponse.detections.map((d, idx) => (
                                  <Box key={idx}>
                                    Class {d.class_id} — Confidence: {d.confidence}% — 
                                    BBox: [{d.bbox.join(", ")}]
                                  </Box>
                                ))}
                              </Box>
                            </Box> */}
                            <Box>
                              <Text fontWeight="bold" mb={1}>
                                Annotated Image:
                              </Text>
                              <ChakraImage
                                src={`${BASE_URL}${apiResponse.annotated_image}`}
                                alt="Annotated"
                                borderRadius="md"
                                w="100%"
                                maxH="200px"
                                objectFit="contain"
                              />
                            </Box>
                          </VStack>
                        )}

                        {apiResponse.type === "segmentation" && (
                          <VStack align="stretch" gap={3}>
                            <Box>
                              <Text fontWeight="bold" mb={1}>
                                Mask Image (grayscale):
                              </Text>
                              <ChakraImage
                                src={`${BASE_URL}${apiResponse.mask_image}`}
                                alt="Mask"
                                borderRadius="md"
                                w="100%"
                                maxH="200px"
                                objectFit="contain"
                              />
                            </Box>
                            <Box>
                              <Text fontWeight="bold" mb={1}>
                                Polygon Overlay:
                              </Text>
                              <ChakraImage
                                src={`${BASE_URL}${apiResponse.annotated_image}`}
                                alt="Polygon Annotated"
                                borderRadius="md"
                                w="100%"
                                maxH="200px"
                                objectFit="contain"
                              />
                            </Box>
                          </VStack>
                        )}
                      </>
                    ) : (
                      <Center h="100%">
                        <Text color="gray.500">Chưa có kết quả</Text>
                      </Center>
                    )}
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Box>
        );
      })}
      <Box ref={bottomRef} />
    </Flex>
  );
}
