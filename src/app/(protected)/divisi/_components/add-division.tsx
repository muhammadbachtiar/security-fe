import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import DivisionService from "@/services/divisi/divisi.service";
import { RequestBodyDivision } from "@/services/divisi/divisi.type";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function cleanDivision(data: RequestBodyDivision): RequestBodyDivision {
  const cleanedDivision = data.division
    ?.map(cleanDivision)
    .filter(
      (d) =>
        d.division?.length || d.division === undefined || d.division === null
    );

  return {
    ...data,
    ...(cleanedDivision ? { division: cleanedDivision } : {}),
  };
}

function AddDivision() {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: RequestBodyDivision) => {
    try {
      setLoading(true);
      const payloadDivision = cleanDivision(val);

      await DivisionService.add(payloadDivision);
      queryClient.invalidateQueries({
        queryKey: ["DIVISIONS"],
      });
      toast.success("Divisi berhasil dibuat");
      form.resetFields();
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => modal.onOpen()} icon={<PlusIcon />} type="primary">
        <span className="!hidden md:!inline">Tambah Divisi</span>
      </Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Tambah Divisi</Typography.Title>}
      >
        <Form
          form={form}
          requiredMark
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <div className="space-y-3">
            <Form.Item
              label="Nama"
              name="name"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Nama harus diisi" }]}
            >
              <Input placeholder="Nama" />
            </Form.Item>
            <Form.List name="division">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="dashed"
                          onClick={() => remove(field.name)}
                          icon={<MinusIcon className="w-4 h-4" />}
                        />

                        <Form.Item
                          {...field}
                          name={[field.name, "name"]}
                          key={field.key}
                          className="!mb-0 w-full"
                          rules={[
                            {
                              required: true,
                              message: "nama sub divisi harus diisi!",
                            },
                          ]}
                        >
                          <Input placeholder="Sub Divisi" />
                        </Form.Item>
                      </div>
                      <Form.List name={[field.name, "division"]}>
                        {(
                          innerFields,
                          { add: addInner, remove: removeInner }
                        ) => (
                          <>
                            {innerFields.map((innerField) => (
                              <div
                                key={innerField.key}
                                className="space-y-2 pl-10"
                              >
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="dashed"
                                    onClick={() => removeInner(innerField.name)}
                                    icon={<MinusIcon className="w-4 h-4" />}
                                  />
                                  <Form.Item
                                    {...innerField}
                                    name={[innerField.name, "name"]}
                                    key={innerField.key}
                                    rules={[
                                      {
                                        required: true,
                                        message: "nama harus diisi!",
                                      },
                                    ]}
                                    className="w-full !mb-0"
                                  >
                                    <Input placeholder="Sub Divisi" />
                                  </Form.Item>
                                </div>

                                <Form.List name={[innerField.name, "division"]}>
                                  {(
                                    subFields,
                                    { add: addSub, remove: removeSub }
                                  ) => (
                                    <>
                                      {subFields.map((subField) => (
                                        <div
                                          key={subField.key}
                                          className="space-y-2 pl-10"
                                        >
                                          <div className="flex gap-2">
                                            <Button
                                              type="dashed"
                                              onClick={() =>
                                                removeSub(subField.name)
                                              }
                                              icon={
                                                <MinusIcon className="w-4 h-4" />
                                              }
                                            />
                                            <Form.Item
                                              {...subField}
                                              name={[subField.name, "name"]}
                                              key={subField.key}
                                              className="w-full !mb-0"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "nama harus diisi!",
                                                },
                                              ]}
                                            >
                                              <Input placeholder="Division Name" />
                                            </Form.Item>
                                          </div>
                                        </div>
                                      ))}
                                      <div className="pl-10">
                                        <Button
                                          type="dashed"
                                          onClick={() => addSub()}
                                          icon={
                                            <PlusIcon className="w-4 h-4" />
                                          }
                                          className="w-full"
                                        >
                                          Tambah Sub Divisi
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </Form.List>
                              </div>
                            ))}
                            <div className="pl-10">
                              <Button
                                type="dashed"
                                className="w-full"
                                onClick={() => addInner()}
                                icon={<PlusIcon className="w-4 h-4" />}
                              >
                                Tambah Sub Divisi
                              </Button>
                            </div>
                          </>
                        )}
                      </Form.List>
                    </div>
                  ))}
                  <Button
                    icon={<PlusIcon className="w-4 h-4" />}
                    type="dashed"
                    className="w-full"
                    onClick={() => add()}
                  >
                    Tambah Sub Divisi
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default AddDivision;
