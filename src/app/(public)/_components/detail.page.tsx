"use client";
import {
  Card,
  Descriptions,
  Tag,
  Spin,
  Alert,
  Button,
  Statistic,
  Row,
  Col,
  Form,
  Input,
  message,
  Collapse,
  Typography,
  
} from "antd";
const { Panel } = Collapse
const { Paragraph, Text } = Typography
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  BugOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import useOneSecurity from "../_hooks/useOneSecurity";
import { useState } from "react";
import { toast } from "sonner";
import errorResponse from "@/lib/error";
import { AxiosError } from "axios";
import SecurityService from "@/services/security/security.service";
import { TAnalyzeResult } from "@/services/security/security.type";

export default function ScanDetailPage({
  params,
}: {
  params: { tenant: string; id: string };
}) {
  const { tenant, id } = params;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const { data: result, isLoading, error } = useOneSecurity(tenant, id, {"with": "analyze"});
  
  const scanDetail = result?.scan;
  const analayze = result?.analysis;
  let analysisResult: TAnalyzeResult | undefined = undefined;
  if (analayze?.result) {
    try {
      analysisResult = JSON.parse(analayze.result)
      console.log("[v0] Parsed analysis result:", analysisResult)
    } catch (e) {
      console.error("[v0] Failed to parse analysis result:", e)
    }
  }
  const handleSubmit = async (values: { scan_id: string }) => {
    setLoading(true);

    try {
      const payload = {
        scan_id: values.scan_id,
      };

      await SecurityService.analayze(tenant, payload);
      toast.success("Berhasil memproses scanning!");
      form.resetFields();

      form.resetFields();
    } catch (error) {
      message.error("Gagal membuat analyze scan baru");
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

    const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <ExclamationCircleOutlined />
      case "high":
        return <WarningOutlined />
      case "medium":
        return <InfoCircleOutlined />
      case "low":
        return <CheckCircleOutlined />
      default:
        return <BugOutlined />
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "running":
        return "processing";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleOutlined />;
      case "running":
        return <ClockCircleOutlined />;
      case "failed":
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ff4d4f";
      case "high":
        return "#ff7a45";
      case "medium":
        return "#ffa940";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (ms: number) => {
    if (ms === 0) return "Belum selesai";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}j ${minutes % 60}m ${seconds % 60}d`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}d`;
    } else {
      return `${seconds}d`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !scanDetail) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            icon={<ArrowLeftOutlined />}
             onClick={() => router.push(`/${tenant}`)}
            className="mb-6"
          >
            Kembali
          </Button>
          <Alert
            message="Data Scan Tidak Ditemukan"
            description="Scan dengan ID tersebut tidak ditemukan atau telah dihapus."
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => router.push(`/${tenant}`)}>
                Kembali ke Dashboard
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="mb-4"
          >
            Kembali
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Detail Scan Keamanan
              </h1>
              <p className="text-gray-600">ID: {scanDetail.id}</p>
            </div>
            <Tag
              color={getStatusColor(scanDetail.status)}
              icon={getStatusIcon(scanDetail.status)}
              className="text-sm px-3 py-1"
            >
              {scanDetail.status === "running"
                ? "Sedang Berjalan"
                : scanDetail.status === "success"
                ? "Selesai"
                : "Gagal"}
            </Tag>
          </div>
        </div>

        {/* Vulnerability Statistics */}
        <Card title="Statistik Kerentanan" className="mb-6">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Critical"
                value={scanDetail?.counts?.critical || 0}
                valueStyle={{ color: getSeverityColor("critical") }}
                prefix={<BugOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="High"
                value={scanDetail?.counts?.high || 0}
                valueStyle={{ color: getSeverityColor("high") }}
                prefix={<BugOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Medium"
                value={scanDetail?.counts?.medium || 0}
                valueStyle={{ color: getSeverityColor("medium") }}
                prefix={<BugOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Low"
                value={scanDetail?.counts?.low || 0}
                valueStyle={{ color: getSeverityColor("low") }}
                prefix={<BugOutlined />}
              />
            </Col>
          </Row>
          <div className="mt-4 pt-4 border-t">
            <Statistic
              title="Total Kerentanan"
              value={scanDetail?.counts?.total || 0}
              valueStyle={{ color: "#1890ff", fontSize: "24px" }}
              prefix={<BugOutlined />}
            />
          </div>
        </Card>

        {/* Scan Information */}
        <Card title="Informasi Scan" className="mb-6">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Target" span={2}>
              <a
                href={scanDetail.target}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {scanDetail.target}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Tool">
              <Tag color="blue">{scanDetail?.tool?.toUpperCase() || '-'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tenant">
              <Tag color="green">{scanDetail.tenant_id}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Sumber">
              <Tag color="purple">{scanDetail.source}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Durasi">
              {formatDuration(scanDetail.duration_ms)}
            </Descriptions.Item>
            <Descriptions.Item label="Dimulai" span={2}>
              {formatDate(scanDetail.triggered_at)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

          {analysisResult && (
          <>
            {/* Security Analysis Overview */}
            <Card title="Ringkasan Analisis Keamanan" className="mb-6">
              <Alert
                message="Rekomendasi Keamanan"
                description={analysisResult.advice}
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                className="mb-4"
              />
            </Card>

            {/* Security Findings */}
            <Card title="Temuan Keamanan" className="mb-6">
              {analysisResult.findings && analysisResult.findings.length > 0 ? (
                <Collapse accordion>
                  {analysisResult.findings.map((finding, index) => (
                    <Panel
                      header={
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Tag color={getSeverityColor(finding.severity)} icon={getSeverityIcon(finding.severity)}>
                              {finding.severity.toUpperCase()}
                            </Tag>
                            <Text strong>{finding.title}</Text>
                          </div>
                        </div>
                      }
                      key={index}
                    >
                      <div className="space-y-4">
                        <div>
                          <Text strong className="text-gray-700">
                            Deskripsi:
                          </Text>
                          <Paragraph className="mt-2 text-gray-600">{finding.summary}</Paragraph>
                        </div>

                        <div>
                          <Text strong className="text-gray-700">
                            Rekomendasi:
                          </Text>
                          <Paragraph className="mt-2 text-gray-600">{finding.recommendation}</Paragraph>
                        </div>
                      </div>
                    </Panel>
                  ))}
                </Collapse>
              ) : (
                <Alert
                  message="Tidak Ada Temuan"
                  description="Tidak ada temuan keamanan yang ditemukan dalam analisis ini."
                  type="success"
                  showIcon
                />
              )}
            </Card>
          </>
        )}

        {/* Additional Actions */}
        <Card title="Aksi" className="mb-6">
          <div className="flex gap-4">
            <Button
              type="primary"
              target="_blank"
              href={scanDetail.artifact_url}
            >
              Unduh Laporan
            </Button>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="flex items-center gap-4"
            >
              <Form.Item
                name="scan_id"
                initialValue={scanDetail.id}
                style={{ marginBottom: 0 }}
              >
                <Input type="hidden" />
              </Form.Item>
              <Button htmlType="submit" loading={loading}>
                Analyze
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
