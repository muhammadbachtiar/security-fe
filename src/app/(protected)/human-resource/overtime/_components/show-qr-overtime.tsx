/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import { Button, Modal, Tooltip, Typography } from "antd";
import { useQRCode } from "next-qrcode";
import { useEffect, useState } from "react";

export function ShowQRAOvertime() {
   const [origin, setOrigin] = useState("");
   const modal = useDisclosure();

   const { Canvas } = useQRCode();
   useEffect(() => {
    if (window.location) {
      setOrigin(window.location.origin);
    }
  }, []);
 
  return (
    <Tooltip title="QR Code">
      <Button onClick={() => modal.onOpen()}>QR Code Lembur</Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            QR Code Lembur
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
            link.download = `QR Code Lembur.png`;
            link.href = url;
            link.click();
          }
        }}
      >
        <div className="flex justify-center">
          <Canvas
            text={`${origin}/overtime-input`}
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
