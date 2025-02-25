import {
  Button,
  Form,
  FormInstance,
  FormListFieldData,
  Input,
  InputNumber,
  Switch,
} from "antd";
import { TrashIcon } from "lucide-react";

function FormItem({
  remove,
  field,
  index,
  setFormItem,
  form,
}: {
  remove: (index: number | number[]) => void;
  field: FormListFieldData;
  index: number;
  setFormItem: (value: boolean, index: number) => void;
  form: FormInstance<any>;
}) {
  const isPercent = Form.useWatch(["details", index, "isPercent"], form);
  return (
    <Form.Item
      className="!mb-2"
      label={index === 0 ? "Detail" : ""}
      required={true}
      key={field.key}
    >
      <div className="flex gap-2 p-4 items-end border rounded">
        <div className="w-full space-y-3">
          <Form.Item
            {...field}
            label="Key"
            name={[field.name, "key"]}
            validateTrigger={["onChange", "onBlur"]}
            className="!mb-0"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "",
              },
            ]}
          >
            <Input placeholder={`Key`} className="w-full" />
          </Form.Item>
          <div className="mb-2 space-y-2">
            <p>Pakai Persentase</p>
            <Switch
              size="small"
              onChange={(v) => {
                setFormItem(v, index);
              }}
            />
          </div>
          <Form.Item
            {...field}
            label="Nilai"
            name={[field.name, "value"]}
            validateTrigger={["onChange", "onBlur"]}
            className="!mb-0"
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <InputNumber
              className="!w-full"
              suffix={isPercent ? "%" : ""}
              max={isPercent ? 100 : undefined}
              placeholder={isPercent ? "0%" : "10000"}
            />
          </Form.Item>
        </div>
        <Button onClick={() => remove(field.name)} className="!border-red-500">
          <TrashIcon className="w-5 h-5 text-red-500 " />
        </Button>
      </div>
    </Form.Item>
  );
}

export default FormItem;
