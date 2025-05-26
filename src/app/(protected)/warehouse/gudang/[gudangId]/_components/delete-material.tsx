import { useDisclosure } from "@/hooks/use-disclosure";
import { Button, Modal, Tooltip, Typography } from "antd";
import { TrashIcon } from "lucide-react";

export function DeleteMaterial({
  handleDelete,
  isLoading,
}: {
  handleDelete: () => Promise<void>;
  isLoading: boolean;
}) {
  const modal = useDisclosure();

  return (
    <Tooltip title="Hapus">
      <Button
        className="w-full px-3 !text-red-500"
        icon={<TrashIcon className="w-5 h-5 !text-red-500" />}
        type="text"
        onClick={() => modal.onOpen()}
      ></Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Hapus
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Hapus"
        okButtonProps={{
          className: "!bg-red-500",
          loading: isLoading,
        }}
        onOk={async () => {
          await handleDelete();
          modal.onClose();
        }}
      >
        <Typography.Text>
          Apakah yakin ingin menghapus barang ini?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}
