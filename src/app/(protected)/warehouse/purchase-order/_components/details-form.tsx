/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Input, InputNumber, Button, Space, Card, Empty, Select } from "antd";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TPurchaseDetailInput } from "@/services/purchase-order/purchase.type";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import ProductService from "@/services/product/product.service";
import MaterialService from "@/services/material/material.service";
import { v4 as uuidv4 } from "uuid";

const { TextArea } = Input;

type ErrorField = {
  name?: string;
  jumlah?: string;
  price?: string;
  keterangan?: string;
  product_id?: string;
  bahan_id?: string;
};

const SortableItem = ({
  id,
  children,
}: {
  id: string | number;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id });

  // const style: React.CSSProperties = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  //   marginBottom: 16,
  //   border: "1px solid #d9d9d9",
  //   padding: 16,
  //   borderRadius: 8,
  //   background: "#fafafa",
  // };

  return (
    <div ref={setNodeRef}>
      <div
        className="mb-[8px] cursor-grab font-semibold"
        {...attributes}
        {...listeners}
      >
        ⠿ Geser untuk urutkan
      </div>
      {children}
    </div>
  );
};

const FormDetailPO = ({
  onSubmit,
}: {
  onSubmit: (values: TPurchaseDetailInput[]) => void;
}) => {
  const [details, setDetails] = useState<TPurchaseDetailInput[]>([]);

  const { data: products } = useQuery({
    queryKey: ["PRODUCTS"],
    queryFn: async () => {
      const response = await ProductService.getAll({
        select: true,
        page_size: 99999,
      });
      return response;
    },
  });

  const { data: materials } = useQuery({
    queryKey: ["MATERIALS"],
    queryFn: async () => {
      const response = await MaterialService.getAll({
        page_size: 9999,
        page: 1,
      });
      return response;
    },
  });

  const [errors, setErrors] = useState<Record<string, ErrorField>>({});

  const sensors = useSensors(useSensor(PointerSensor));

  const handleChange = (
    index: number,
    key: keyof TPurchaseDetailInput,
    value: string | number | null
  ) => {
    const newUsers = [...details];
    newUsers[index][key] = value as never;
    setDetails(newUsers);

    // Clear error when typing
    const id = newUsers[index].id;
    setErrors((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: undefined },
    }));
  };

  const handleAdd = (type: "product" | "bahan") => {
    const newDetail: TPurchaseDetailInput = {
      id: uuidv4(),
      bahan_id: null,
      product_id: null,
      keterangan: "",
      jumlah: null,
      price: null,
      type,
    };
    setDetails([...details, newDetail]);
  };

  const handleRemove = (id: string | number) => {
    setDetails(details.filter((u) => u.id !== id));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = details.findIndex((detail) => detail.id === active.id);
      const newIndex = details.findIndex((detail) => detail.id === over?.id);

      setDetails((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, ErrorField> = {};

    details.forEach((u) => {
      const err: ErrorField = {};
      if (u.jumlah === null) {
        err.jumlah = "Jumlah wajib diisi";
        isValid = false;
      }
      if (u.price === null) {
        err.price = "Harga wajib diisi";
        isValid = false;
      }
      if (u.bahan_id === null && u.type === "bahan") {
        err.bahan_id = "Bahan wajib diisi";
        isValid = false;
      }
      if (u.product_id === null && u.type === "product") {
        err.product_id = "Produk wajib diisi";
        isValid = false;
      }
      if (Object.keys(err).length > 0) {
        newErrors[u.id] = err;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // const countAmountProduct = (detail: TPurchaseDetailInput) => {
  //   const qty = detail.jumlah || 0;
  //   const price =
  //     products?.data?.find((p) => p.id === detail?.product_id)?.harga || 0;

  //   return formatCurrency(qty * price);
  // };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }

    onSubmit(details);
  };

  return (
    <Card
      title={
        <div className="flex justify-between">
          <p>Tambah Bahan atau Produk</p>
          <div className="space-x-2">
            <Button
              type="text"
              className="!border !border-blue-500 !text-blue-500"
              onClick={() => handleAdd("bahan")}
            >
              Tambah Bahan
            </Button>
            <Button
              type="text"
              className="!border !border-blue-500 !text-blue-500"
              onClick={() => handleAdd("product")}
            >
              Tambah Produk
            </Button>
          </div>
        </div>
      }
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={details.map((u) => u.id)}
          strategy={verticalListSortingStrategy}
        >
          <Space direction="vertical" className="w-full">
            {details.map((detail, index) => {
              const error = errors[detail.id] || {};
              return (
                <SortableItem key={detail.id} id={detail.id}>
                  <Space direction="vertical" className="w-full">
                    {detail.type === "product" && (
                      <>
                        <Select
                          className="!w-full"
                          placeholder="Pilih Produk"
                          options={products?.data.map((val) => ({
                            label: val.name,
                            value: val.id,
                          }))}
                          status={error.product_id ? "error" : ""}
                          onChange={(v) => handleChange(index, "product_id", v)}
                        />
                        {error.product_id && (
                          <div className="text-[#ff4d4f] text-sm">
                            {error.product_id}
                          </div>
                        )}
                      </>
                    )}
                    {detail.type === "bahan" && (
                      <>
                        <Select
                          className="!w-full"
                          placeholder="Pilih Bahan"
                          options={materials?.data.map((val) => ({
                            label: val.name,
                            value: val.id,
                          }))}
                          status={error.bahan_id ? "error" : ""}
                          onChange={(v) => handleChange(index, "bahan_id", v)}
                        />
                        {error.bahan_id && (
                          <div className="text-[#ff4d4f] text-sm">
                            {error.bahan_id}
                          </div>
                        )}
                      </>
                    )}
                    <InputNumber
                      placeholder="Jumlah"
                      value={detail.jumlah}
                      onChange={(val) => handleChange(index, "jumlah", val)}
                      className="w-full"
                      status={error.jumlah ? "error" : ""}
                    />
                    {error.jumlah && (
                      <div className="text-[#ff4d4f] text-sm">
                        {error.jumlah}
                      </div>
                    )}
                    <InputNumber
                      placeholder="Harga"
                      value={detail.price}
                      onChange={(val) => handleChange(index, "price", val)}
                      className="w-full"
                      status={error.price ? "error" : ""}
                    />
                    {error.price && (
                      <div className="text-[#ff4d4f] text-sm">
                        {error.price}
                      </div>
                    )}
                    <TextArea
                      placeholder="Keterangan"
                      value={detail.keterangan}
                      onChange={(e) =>
                        handleChange(index, "keterangan", e.target.value)
                      }
                      rows={3}
                    />
                    <div className="flex justify-end">
                      {/* <p className="font-semibold text-lg">
                        {detail.type === "product" &&
                          countAmountProduct(detail)}
                      </p> */}
                      <Button danger onClick={() => handleRemove(detail.id)}>
                        Hapus
                      </Button>
                    </div>
                  </Space>
                </SortableItem>
              );
            })}

            {details.length === 0 ? (
              <Empty description="Belum ada item yang ditambahkan" />
            ) : null}
          </Space>
        </SortableContext>
      </DndContext>

      <Space className="flex justify-end w-full mt-[10px]">
        <Button
          type="text"
          className="!border !border-blue-500 !text-blue-500"
          onClick={handleSubmit}
        >
          Simpan
        </Button>
      </Space>
    </Card>
  );
};

export default FormDetailPO;
