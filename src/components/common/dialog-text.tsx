import { useDisclosure } from "@/hooks/use-disclosure";
import { Button, Modal, Typography } from "antd";

export function DialogText({
  content,
  textButton,
  title,
}: {
  content: string;
  title: string;
  textButton: string;
}) {
  const modal = useDisclosure();

  return (
    <>
      <Button
        className="w-full px-3"
        type="default"
        onClick={() => modal.onOpen()}
      >
        {textButton}
      </Button>

      <Modal
        maskClosable={true}
        onCancel={() => modal.onClose()}
        title={
          <Typography.Title className="font-normal" level={3}>
            {title}
          </Typography.Title>
        }
        open={modal.isOpen}
        footer={false}
      >
        <Typography.Text>{content}</Typography.Text>
      </Modal>
    </>
  );
}
