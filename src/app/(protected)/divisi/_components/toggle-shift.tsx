import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import DivisionService from "@/services/divisi/divisi.service";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { ToggleLeftIcon, ToggleRightIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function ToggleShift({
  divId,
  shift,
}: {
  divId: number;
  shift: boolean;
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleAct() {
    try {
      setIsLoading(true);
      await DivisionService.update(divId, {
        is_shift: !shift,
      });
      toast.success("Data berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["DIVISIONS"] });
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title="Shift">
      <Button
        className="w-full px-3"
        icon={
          shift ? (
            <ToggleLeftIcon className="!text-blue-500" />
          ) : (
            <ToggleRightIcon className="!text-red-500" />
          )
        }
        type="text"
        onClick={() => modal.onOpen()}
      ></Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            {shift ? "Ubah ke Nonshift" : "Ubah ke Shift"}
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText={"Simpan"}
        okButtonProps={{
          loading: isLoading,
        }}
        onOk={handleAct}
      >
        <Typography.Text>
          Apakah yakin ingin mengubah menjadi {shift ? "unshift" : "shift"}?
        </Typography.Text>
      </Modal>
    </Tooltip>
  );
}
