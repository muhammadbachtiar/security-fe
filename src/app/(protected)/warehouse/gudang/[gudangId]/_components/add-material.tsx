/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounce } from "@/hooks/use-debounce";
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import GudangService from "@/services/gudang/gudang.service";
import { TMaterial } from "@/services/material/material.type";
import { Button, Input, InputNumber, Modal, Switch, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon, ScanQrCodeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type TempMaterial = { qty: number; desc: string; material: TMaterial };

function AddMaterial({
  onSubmit,
  currentValue,
}: {
  onSubmit: (value: TempMaterial) => void;
  currentValue: TempMaterial[];
}) {
  const modal = useDisclosure();
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [sku, setSku] = useState("");
  const [desc, setDesc] = useState("");
  const [qty, setqty] = useState<number>(1);
  const [material, setMaterial] = useState<TMaterial | null>(null);
  const code = useDebounce(sku, 300);

  const inputRef: any = useRef();

  const onCheck = async () => {
    try {
      setLoadingCheck(true);
      if (
        currentValue.some(
          (v) => v.material.sku === sku || v.material.sku === code
        )
      ) {
        throw new Error("SKU sudah ada di daftar");
      }
      const res = await GudangService.checkBahan({
        code: sku,
      });

      setMaterial(res.data);
      setSku("");
      setIsManual(false);
    } catch (error: any) {
      if (error.status === 400) {
        toast.error("SKU tidak ditemukan");
        return;
      }
      errorResponse(error as AxiosError);
    } finally {
      setLoadingCheck(false);
    }
  };

  useEffect(() => {
    if (modal.isOpen) {
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 300);
    }
  }, [modal.isOpen]);

  useEffect(() => {
    setSku("");
  }, [isManual]);

  useEffect(() => {
    if (code && !isManual) {
      onCheck();
      setSku("");
      setIsManual(false);
    }
  }, [code]);

  return (
    <>
      <Button onClick={() => modal.onOpen()} icon={<PlusIcon />} type="default">
        Tambah Item
      </Button>
      <Modal
        loading={loadingCheck}
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          setSku("");
          setIsManual(false);
          setDesc("");
          setqty(1);
          setMaterial(null);
          modal.onClose();
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: () => {
            onSubmit({
              material: material!,
              qty,
              desc,
            });
            setSku("");
            setIsManual(false);
            setDesc("");
            setqty(1);
            setMaterial(null);
            modal.onClose();
          },
          disabled: !material || !qty,
        }}
        title={<Typography.Title level={4}>Input Bahan Masuk</Typography.Title>}
      >
        {!material && (
          <div className="flex gap-2 items-center">
            <Switch
              id="manual"
              value={isManual}
              onChange={(v) => setIsManual(v)}
            />
            <label htmlFor="manual">Manual Input</label>
          </div>
        )}
        {!material ? (
          <div>
            {isManual ? (
              <div className="space-y-2 pt-3">
                <p className="italic">*) Input manual SKU</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="SKU"
                    className="w-full"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                  <Button
                    onClick={onCheck}
                    loading={loadingCheck}
                    type="text"
                    className="!border !border-blue-400 !text-blue-400"
                    disabled={!sku}
                  >
                    Cek
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center flex-col gap-4">
                <input
                  ref={inputRef as any}
                  value={sku}
                  type="text"
                  autoFocus
                  onChange={(e) => {
                    if (modal.isOpen) {
                      setSku(e.target.value);
                    }
                  }}
                  className="opacity-0 cursor-default"
                  onBlur={() => inputRef.current?.focus()}
                />
                <ScanQrCodeIcon className="w-10 h-10" />
                <p>Silahkan scan barcode</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="italic text-green-500">
                Bahan dengan SKU {material.sku} ditemukan!
              </p>
              <Button
                type="link"
                onClick={() => {
                  setMaterial(null);
                  setqty(1);
                }}
              >
                Scan Ulang
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="space-y-1 w-full">
                <p>Nama Bahan</p>
                <Input className="w-full" value={material.name} disabled />
              </div>
              <div className="space-y-1 w-full">
                <p>Kuantiti</p>
                <InputNumber
                  className="!w-full"
                  defaultValue={qty}
                  value={qty}
                  placeholder="1"
                  min={1}
                  onChange={(val) => setqty(val as number)}
                />
              </div>
            </div>
            <Input.TextArea
              placeholder="Tulis keterangan..."
              className="w-full"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </>
  );
}

export default AddMaterial;
