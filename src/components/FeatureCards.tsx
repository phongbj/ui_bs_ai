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
  VStack,
  CloseButton,
  Slider,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import ZoomableImage from "./ZoomableImage";

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
  const [expanded, setExpanded] = useState<string | null>(null);
  const [value, setValue] = useState([0.35])
  const [endValue, setEndValue] = useState([0.35])
  const cards = [
    {
      title: "Phân Loại Thông Minh",
      desc: "Nhận diện và phân loại hình ảnh tự động với độ chính xác vượt trội.",
      mode: "class",
      img: "/classification.jpg",
    },
    {
      title: "Phát Hiện Đối Tượng Chuẩn Xác",
      desc: "Xác định vị trí và nhận dạng đối tượng tức thì, tối ưu cho mọi tình huống.",
      mode: "detect",
      img: "/detection.jpg",
    },
    {
      title: "Phân Vùng Siêu Chi Tiết",
      desc: "Tách vùng mục tiêu với mức độ chi tiết cao, hỗ trợ phân tích y tế chuyên sâu.",
      mode: "segment",
      img: "/segementation.jpg",
    },
  ];


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

  useEffect(() => {
    handleSubmit()
  }, [endValue])

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
    if (expanded === "detect") {
      formData.append("confidence", endValue.toString());
    }
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
        const dets = data.detections.map(
          (d: {
            class_id: number;
            confidence: number;
            bbox: [number, number, number, number];
          }) => ({
            class_id: d.class_id,
            confidence: Number((d.confidence * 100).toFixed(2)),
            bbox: d.bbox as [number, number, number, number],
          })
        );
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
        console.error("Unexpected type:", data);
        setApiResponse(null);
      }
    } catch (err) {
      console.error(err);
      setApiResponse(null);
      alert("Có lỗi khi gọi API: " + (err as Error).message);
    }
  };

  return (
    <Flex
      direction="row"
      gap={6}
      mt={10}
      w="100%"
      align="flex-start"
      justify={expanded ? "flex-start" : "center"}
    >
      <Flex
        direction={expanded ? "column" : "row"}
        gap={4}
        flexWrap="wrap"
        width={expanded ? "auto" : "100%"}
        maxW={expanded ? "320px" : "100%"}
        justify={expanded ? "flex-start" : "center"}
      >
        {cards.map((card) => {
          const isOpen = expanded === card.mode;
          return (
            <Box
              key={card.mode}
              bg={isOpen ? "blue.200" : "whiteAlpha.800"}
              borderRadius="xl"
              p={6}
              w={expanded ? "100%" : "calc(33.333% - 16px)"}
              minW={expanded ? "auto" : "280px"}
              transition="all 0.3s ease"
              boxShadow={isOpen ? "2xl" : "md"}
              transform={isOpen ? "scale(1.02)" : "scale(1)"}
              cursor="pointer"
              onClick={() => {
                setExpanded((prev) => (prev === card.mode ? null : card.mode));
                setPreviewURL(null);
                setFileObject(null);
                setApiResponse(null);
              }}
            >
              <Heading fontSize="lg" className="text-gray-900">
                {card.title}
              </Heading>

              {!expanded && (
                <>
                  <Text mb={2} className="text-gray-700">{card.desc}</Text>
                  <AspectRatio
                    ratio={4 / 3}
                    w="100%"
                    maxH="400px"
                    borderRadius="md"
                    overflow="hidden"
                    mt={4}
                  >
                    <ChakraImage
                      src={card.img}
                      alt="Preview"
                      objectFit="cover"
                      w="100%"
                      h="100%"
                    />
                  </AspectRatio>
                </>
              )}
            </Box>
          );
        })}
      </Flex>
      {/* BÊN PHẢI: Nội dung upload + kết quả tương ứng */}
      {expanded && (
        <Box
          flex="1"
          bg="whiteAlpha.900"
          borderRadius="xl"
          boxShadow="2xl"
          p={6}
        >
          <Heading fontSize="2xl" mb={2} className="text-gray-700">
            {cards.find((c) => c.mode === expanded)?.title}
          </Heading>
          <Text mb={4} color="gray.600">
            {cards.find((c) => c.mode === expanded)?.desc}
          </Text>

          <Flex gap={6} flexDir={{ base: "column", md: "row" }} className="text-gray-700">
            {/* UPLOAD HÌNH ẢNH */}
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
                  <Box className="flex flex-col">
                    <ChakraImage
                      src={previewURL}
                      alt="Preview"
                      objectFit="contain"
                      w="100%"
                      h="100%"
                      borderRadius="md"
                    />
                    {expanded === "detect" && (
                      <Box className="px-2!" w={"50%"} position={"absolute"} top={200} right={90} color={"white"}>
                        <Slider.Root colorPalette="orange" maxW="sm" size="sm" value={value} min={0}
                          max={1}
                          step={0.01}
                          onValueChange={(e) => setValue(e.value)}
                          onValueChangeEnd={(e) => setEndValue(e.value)}>
                          <HStack justify="space-between">
                            <Slider.Label background={"blackAlpha.600"}>Confidence: {(value[0] * 100).toFixed(0)}%</Slider.Label>

                          </HStack>
                          <Slider.Control>
                            <Slider.Track>
                              <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs rounded="full" />
                          </Slider.Control>
                        </Slider.Root>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Center h="100%" flexDir="column" gap={2}>
                    <Text color="gray.400">Chưa có ảnh nào được chọn</Text>
                    <Button
                      size="sm"
                      colorScheme="orange"
                      onClick={() => fileInputRef.current?.click()}
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
                  onClick={() => {
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
                  onClick={handleSubmit}
                  disabled={!previewURL}
                >
                  Submit
                </Button>
              </Flex>
            </Box>

            {/* KẾT QUẢ */}
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
                        <ZoomableImage
                          src={`${BASE_URL}${apiResponse.annotated_image}`}
                          alt="Mask"
                        />
                        {/* <ChakraImage
                          src={`${BASE_URL}${apiResponse.annotated_image}`}
                          alt="Annotated"
                          borderRadius="md"
                          w="100%"
                          maxH="200px"
                          objectFit="contain"
                        /> */}
                      </Box>
                    </VStack>
                  )}

                  {apiResponse.type === "detection" && (
                    <VStack align="stretch" gap={3}>
                      <Box>
                        <Text fontWeight="bold" mb={1}>
                          Annotated Image:
                        </Text>
                        <ZoomableImage
                          src={`${BASE_URL}${apiResponse.annotated_image}`}
                          alt="Mask"
                        />
                        {/* <ChakraImage
                          src={`${BASE_URL}${apiResponse.annotated_image}`}
                          alt="Annotated"
                          borderRadius="md"
                          w="100%"
                          maxH="200px"
                          objectFit="contain"
                        /> */}
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
                        <ZoomableImage
                          src={`${BASE_URL}${apiResponse.annotated_image}`}
                          alt="Mask"
                        />
                        {/* <ChakraImage
                          src={`${BASE_URL}${apiResponse.annotated_image}`}
                          alt="Polygon Annotated"
                          borderRadius="md"
                          w="100%"
                          maxH="200px"
                          objectFit="contain"
                        /> */}
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
      )}
    </Flex>
  );
}
