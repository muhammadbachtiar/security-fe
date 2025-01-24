import { useDisclosure } from "@/hooks/use-disclosure";
import { Button, Modal, Typography } from "antd";

export function ReadDivision({ desc }: { desc: string }) {
  const modal = useDisclosure();

  return (
    <>
      <Button onClick={() => modal.onOpen()}>Baca Deskripsi</Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Deskripsi
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Hapus"
        okButtonProps={{
          className: "bg-red-500 hidden",
        }}
      >
        <Typography.Text>{desc}</Typography.Text>
      </Modal>
    </>
  );
}
