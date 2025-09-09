"use client"
import { useState } from "react"
import { AxiosError } from "axios"
import {
  Button,
  Card,
  Badge,
  Modal,
  Input,
  Select,
  Form,
  Row,
  Col,
  Spin,
  message,
  Typography,
  Space,
  Divider,
} from "antd"
import { Shield, Plus, Clock, CheckCircle, XCircle, Loader2, Focus } from "lucide-react"
import useListSecurity from "../_hooks/useListSecurity"
import errorResponse from "@/lib/error"
import { toast } from "sonner"
import SecurityService from "@/services/security/security.service"
import { TSecurityScan } from "@/services/security/security.type"
import { usePathname } from "next/navigation"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

export default function SecurityScannerDashboard() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()
  const defaultTenant = pathname?.split("/")[1] || ""
  const [tenant, setTenant] = useState(defaultTenant)
  const [form] = Form.useForm()
  const {data: scans, isLoading} = useListSecurity(tenant, { limit: 10 });

  const dataScan: TSecurityScan[] = scans?.data || [];

  const handleSubmit = async (values: TSecurityScan) => {
    setLoading(true)

    try {
      const payload = {
        tool: values.tool,
        mode: values.mode,
        target: values.target,
        source: values.source,
        ...(values.branch && { branch: values.branch }),
        ...(values.commit_sha && { commit_sha: values.commit_sha }),
        ...(values.metadata && { metadata: typeof values.metadata === "string" ? JSON.parse(values.metadata) : values.metadata }),
      }

      await SecurityService.create(tenant, payload);
      toast.success("Berhasil memproses scanning!");
      form.resetFields();

      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error("Gagal membuat scan baru")
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge
            color="green"
            text={
              <Space size={4}>
                <CheckCircle className="w-3 h-3" />
                Berhasil
              </Space>
            }
          />
        )
      case "failed":
        return (
          <Badge
            color="red"
            text={
              <Space size={4}>
                <XCircle className="w-3 h-3" />
                Gagal
              </Space>
            }
          />
        )
      case "running":
        return (
          <Badge
            color="orange"
            text={
              <Space size={4}>
                <Loader2 className="w-3 h-3 animate-spin" />
                Sedang Scan
              </Space>
            }
          />
        )
      case "error":
        return (
          <Badge
            color="red"
            text={
              <Space size={4}>
                <XCircle className="w-3 h-3" />
                Error
              </Space>
            }
          />
        )
      default:
        return (
          <Badge
            color="default"
            text={
              <Space size={4}>
                <Clock className="w-3 h-3" />
                Tidak Diketahui
              </Space>
            }
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <Title level={2} className="!mb-0 text-lg sm:text-2xl">
                Security Scanner
              </Title>
              <Text type="secondary" className="text-sm sm:text-base">Dashboard Keamanan Website</Text>
            </div>
          </div>

          <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
            Scan Baru
          </Button>
        </div>

        {/* Tenant Filter */}
        <div className="mb-6">
          <Text strong>Tenant</Text>
          <br />
          <Input
            value={tenant}
            onChange={e => {
              const value = e.target.value
              if (!/\s/.test(value)) {
          setTenant(value)
              } else {
          message.warning("Tenant tidak boleh mengandung spasi")
              }
            }}
            style={{ width: 300 }}
            className="mt-1"
            placeholder="Masukkan tenant"
            defaultValue="kominfo-muaraenim"
          />
        </div>

        {/* Scan Results */}
        <Card title="Hasil Scan Keamanan">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spin size="large" />
              <Text className="ml-2">Memuat data...</Text>
            </div>
          ) : !Array.isArray(dataScan) || dataScan.length === 0 ? (
            <div className="text-center py-8">
              <Text type="secondary">Belum ada data scan</Text>
            </div>
          ) : (
            <div className="space-y-4">
              {
                dataScan.map((scan) => (
                  <Card key={scan.id}  size="small" className="border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                          <Title level={5} className="!mb-0 text-base sm:text-lg">
                            {scan.target}
                          </Title>
                          {getStatusBadge(scan.status)}
                          </div>
                          <Row gutter={[16, 8]}>
                          <Col xs={24} sm={12} md={6}>
                            <Text type="secondary" className="text-sm sm:text-base">
                            <Text strong>Tool:</Text> {scan.tool?.toUpperCase()}
                            </Text>
                          </Col>
                          <Col xs={24} sm={12} md={6}>
                            <Text type="secondary" className="text-sm sm:text-base">
                            <Text strong>Mode:</Text> {scan.mode}
                            </Text>
                          </Col>
                          <Col xs={24} sm={12} md={6}>
                            <Text type="secondary" className="text-sm sm:text-base">
                            <Text strong>Source:</Text> {scan.source}
                            </Text>
                          </Col>
                          <Col xs={24} sm={12} md={6}>
                            <Text type="secondary" className="text-sm sm:text-base">
                            <Text strong>Triggered:</Text> {scan.triggered_at ? formatDate(scan.triggered_at) : "-"}
                            </Text>
                          </Col>
                          <Col xs={24} sm={12} md={6}>
                            <Text type="secondary" className="text-sm sm:text-base">
                            <Text strong>Durasi:</Text>{" "}
                            {scan.duration_ms
                              ? `${Math.floor(scan.duration_ms / 60000)}m ${Math.round((scan.duration_ms % 60000) / 1000)}s`
                              : "-"}
                            </Text>
                          </Col>
                          {scan.branch && (
                            <Col xs={24} sm={12} md={6}>
                            <Text type="secondary" className="text-sm sm:text-base">
                              <Text strong>Branch:</Text> {scan.branch}
                            </Text>
                            </Col>
                          )}
                          {scan.commit_sha && (
                            <Col xs={24} sm={12} md={6}>
                            <Text type="secondary" className="text-sm sm:text-base">
                              <Text strong>Commit:</Text> {scan.commit_sha}
                            </Text>
                            </Col>
                          )}
                            <Col xs={24} md={12}>
                            <Text type="secondary" className="text-sm sm:text-base">
                              <Text strong>Counts:</Text>{" "}
                              <span className="ml-1 flex flex-wrap gap-2">
                                <Badge color="red" count={scan.counts?.critical || 0} showZero />
                                <Text className="ml-1">Critical</Text>
                                <Badge color="volcano" count={scan.counts?.high || 0} showZero />
                                <Text className="ml-1">High</Text>
                                <Badge color="orange" count={scan.counts?.medium || 0} showZero />
                                <Text className="ml-1">Medium</Text>
                                <Badge color="gold" count={scan.counts?.low || 0} showZero />
                                <Text className="ml-1">Low</Text>
                                <Badge color="blue" count={scan.counts?.total || 0} showZero style={{ backgroundColor: "#1677ff" }} />
                                <Text className="ml-1">Total</Text>
                              </span>
                            </Text>
                            </Col>
                            {scan.artifact_url && (
                            <Col xs={24} md={12}>
                              <Text type="secondary" className="text-sm sm:text-base">
                              <Text strong>Report:</Text>{" "}
                              <Button
                                type="link"
                                href={scan.artifact_url}
                                target="_blank"
                                download
                                icon={<Shield className="w-4 h-4" />}
                                className="p-0"
                              >
                                Download
                              </Button>
                              </Text>
                            </Col>
                            )}
                            <Col xs={24}>
                            <Button
                              type="default"
                              href={`/${tenant}/${scan.id}`}
                              icon={<Focus className="w-4 h-4" />}
                              className="w-full sm:w-auto"
                            >
                              Detail
                            </Button>
                            </Col>
                          </Row>
                        </div>
                      </div>
                  </Card>
                ))
              }
            </div>
          )}
        </Card>
        <Modal
          title="Buat Scan Keamanan Baru"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width="100%"
          style={{ maxWidth: "100%", padding: "0 10px" }}
          bodyStyle={{ padding: "16px 12px" }}
          className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              tool: "zap",
              mode: "url",
              source: "manual",
            }}
            className="space-y-4"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Form.Item label="Tool" name="tool" rules={[{ required: true, message: "Tool harus dipilih" }]}>
                  <Select>
                    <Option value="zap">ZAP</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Form.Item label="Mode" name="mode" rules={[{ required: true, message: "Mode harus dipilih" }]}>
                  <Select>
                    <Option value="url">URL</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

             <Form.Item label="Tenant" name="tenant" rules={[{ required: true, message: "Tenant harus diisi" }]}>
              <Input placeholder="kominfo" onChange={(e) => setTenant(e.target.value)} />
            </Form.Item>

            <Form.Item label="Target" name="target" rules={[{ required: true, message: "Target harus diisi" }]}>
              <Input placeholder="http://example.com" />
            </Form.Item>

            <Form.Item label="Source" name="source" rules={[{ required: true, message: "Source harus diisi" }]}>
              <Input placeholder="manual" />
            </Form.Item>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Form.Item label="Branch (Opsional)" name="branch">
                  <Input placeholder="main" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Form.Item label="Commit SHA (Opsional)" name="commit_sha">
                  <Input placeholder="scan-20250826" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Metadata JSON (Opsional)" name="metadata">
              <TextArea placeholder='{"key": "value"}' rows={3} />
            </Form.Item>

            <Divider />

            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="primary" htmlType="submit" loading={loading} className="flex-1 min-w-[120px]">
                Mulai Scan
              </Button>
              <Button onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto min-w-[120px]">
                Batal
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  )
}
