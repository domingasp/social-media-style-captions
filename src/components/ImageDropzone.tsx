import { Button, Group, Stack, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconX } from "@tabler/icons-react";

type ImageDropzoneProps = {
  hasImage: boolean;
  setCustomImageFile: React.Dispatch<React.SetStateAction<File | null>>;
};
const ImageDropzone = function ImageDropzone({
  hasImage,
  setCustomImageFile,
}: ImageDropzoneProps) {
  return (
    <Stack>
      <Dropzone
        onDrop={(files) => {
          if (files.length > 0) {
            setCustomImageFile(files[0]);
          }
        }}
        accept={IMAGE_MIME_TYPE}
        maxSize={3 * 1024 ** 2}
      >
        <Group>
          <Dropzone.Idle>
            <IconPhoto size="1.5rem" stroke={1.5} />
          </Dropzone.Idle>

          <Text size="md">Drag Image here or click for file picker</Text>
        </Group>
      </Dropzone>
      <Button
        disabled={!hasImage}
        onClick={() => setCustomImageFile(null)}
        variant="subtle"
        color="red"
        leftIcon={<IconX />}
      >
        Clear
      </Button>
    </Stack>
  );
};

export default ImageDropzone;
