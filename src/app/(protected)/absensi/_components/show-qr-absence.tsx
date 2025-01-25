/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import { Button, Modal, Tooltip, Typography } from "antd";
import { useQRCode } from "next-qrcode";

export function ShowQRAbsence() {
  const modal = useDisclosure();

  const { Canvas } = useQRCode();

  return (
    <Tooltip title="QR Code">
      <Button onClick={() => modal.onOpen()}>QR Code Absen</Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            QR Code Absen
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Download"
        onOk={() => {
          const canvas = document.getElementsByTagName("canvas")[0] as any;
          if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `QR Code Absen.png`;
            link.href = url;
            link.click();
          }
        }}
      >
        <div className="flex justify-center">
          <Canvas
            text={`https://fe-sarana-hrd.vercel.app/absence`}
            options={{
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 4,
              width: 200,
              color: {
                dark: "#000000",
                light: "#ffffff",
              },
            }}
          />
        </div>
      </Modal>
    </Tooltip>
  );
}
