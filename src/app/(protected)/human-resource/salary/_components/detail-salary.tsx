import { useDisclosure } from "@/hooks/use-disclosure";
import { formatCurrency } from "@/lib/utils";
import PayrollService from "@/services/payroll/payroll.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Tooltip, Typography } from "antd";

export function DetailSalary({
  staffId,
  from,
  to,
}: {
  staffId: number;
  from: string;
  to: string;
}) {
  const modal = useDisclosure();

  const { data: salary, isLoading } = useQuery({
    queryKey: ["salary", staffId, from, to],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await PayrollService.getSalary({
        staff_id: staffId,
        from,
        to,
      });
      return response;
    },
  });

  console.log({ salary });

  return (
    <Tooltip title="Detail">
      <Button
        className="w-full px-3 !text-blue-500"
        type="text"
        onClick={() => modal.onOpen()}
      >
        Detail Salary
      </Button>

      <Modal
        loading={isLoading}
        title={
          <Typography.Title className="font-normal" level={3}>
            Detail Salary
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Hapus"
        okButtonProps={{
          className: "!bg-red-500 !hidden",
          loading: isLoading,
        }}
      >
        <div className="grid grid-cols-2 gap-y-3">
          <div>
            <p>Nama</p>
            <p className="font-medium">{salary?.data.data.staff.nama}</p>
          </div>
          <div>
            <p>NIP</p>
            <p className="font-medium">{salary?.data.data.staff.nip}</p>
          </div>
          <div>
            <p>Total Jam</p>
            <p className="font-medium">{salary?.data.data.total_hour} Jam</p>
          </div>
          <div>
            <p>Gaji Per Jam</p>
            <p className="font-medium">
              {formatCurrency(salary?.data.data.salary_per_hour as number)}
            </p>
          </div>
          <div>
            <p>Total Gaji</p>
            <p className="font-medium">
              {formatCurrency(salary?.data.data.total_salary as number)}
            </p>
          </div>
        </div>
      </Modal>
    </Tooltip>
  );
}
