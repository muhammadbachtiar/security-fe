import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import LeaveService from "@/services/leave/leave.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import * as React from "react";
import { toast } from "sonner";

export function ActionLeaveMulti({
  leaveId,
  status,
  clear,
}: {
  leaveId: number[];
  status: "rejected" | "approved";
  clear: () => void;
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);
      await LeaveService.updateStatusMulti({
        status,
        id: leaveId,
      });
      toast.success("Data berhasil diperbarui!");
      queryClient.resetQueries({ queryKey: ["LEAVES"] });
      clear();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title={status === "approved" ? "Konfirmasi" : "Tolak"}>
      {status === "approved" ? (
        <Button type="primary" onClick={() => modal.onOpen()}>
          Approve
        </Button>
      ) : (
        <Button
          className="!border-red-500 !text-red-500"
          onClick={() => modal.onOpen()}
        >
          Reject
        </Button>
      )}

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
