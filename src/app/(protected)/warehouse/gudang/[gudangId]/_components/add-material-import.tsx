/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounce } from "@/hooks/use-debounce";
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import GudangService from "@/services/gudang/gudang.service";
import { TMaterial } from "@/services/material/material.type";
import { Button, Input, InputNumber, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type TempMaterial = { qty: number; desc: string; material: TMaterial };

function AddMaterialImport({
  onSubmit,
  currentValue,
}: {
  onSubmit: (value: TempMaterial) => void;
  currentValue: TempMaterial[];
}) {
  const modal = useDisclosure();
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [sku, setSku] = useState("");
  const [desc, setDesc] = useState("");
  const [qty, setqty] = useState<number>(1);
  const [material, setMaterial] = useState<TMaterial | null>(null);
  const code = useDebounce(sku, 300);

  const inputRef: any = useRef();

  const onCheck = async () => {
    try {
      setLoadingCheck(true);
      if (currentValue.some((v) => v.material.sku === sku)) {
        throw new Error("SKU sudah ada di daftar");
      }
      const res = await GudangService.checkBahan({
        code: sku,
      });

      setMaterial(res.data);
      setSku("");
    } catch (error: any) {
      if (error.status === 400) {
        console.log({ error: error.status });
        toast.error("SKU tidak ditemukan");
        return;
      }
      errorResponse(error as AxiosError);
    } finally {
      setLoadingCheck(false);
    }
  };

  useEffect(() => {
    if (modal.isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modal]);

  useEffect(() => {
    if (code) {
      onCheck();
      setSku("");
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
            setDesc("");
            setqty(1);
            setMaterial(null);
            modal.onClose();
          },
          disabled: !material || !qty,
        }}
        title={<Typography.Title level={4}>Input Bahan Masuk</Typography.Title>}
      >
        {/* <input
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
        /> */}
        {!material ? (
          <div className="space-y-2">
            <p className="italic">*) Scan barcode atau input manual SKU</p>
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
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="italic text-green-500">
                Bahan dengan SKU {sku} ditemukan!
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

export default AddMaterialImport;
