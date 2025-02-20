import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import LeaveService from "@/services/leave/leave.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { CheckIcon, XIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function ActionLeave({
  leaveId,
  status,
}: {
  leaveId: number;
  status: "rejected" | "approved";
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      await LeaveService.update(leaveId, {
        status,
      });
      toast.success("Data berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["LEAVES"] });
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title={status === "approved" ? "Konfirmasi" : "Tolak"}>
      <Button
        className="w-full px-3"
        icon={
          status === "approved" ? (
            <CheckIcon className="w-4 !text-green-500" />
          ) : (
            <XIcon className="w-4 !text-red-500" />
          )
        }
        type="text"
        onClick={() => modal.onOpen()}
      ></Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            {status === "approved" ? "Konfirmasi" : "Tolak"}
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText={status === "approved" ? "Konfirmasi" : "Tolak"}
        okButtonProps={{
          loading: isLoading,
        }}
        onOk={handleDelete}
      >
        <Typography.Text>
          Apakah yakin ingin {status === "approved" ? "konfirmasi" : "menolak"}?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}
