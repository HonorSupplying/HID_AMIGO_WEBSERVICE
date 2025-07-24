import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Card, Row, Col, Divider, Typography, Grid } from "antd";
import {
  ControlOutlined,
  VideoCameraOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { CameraSection } from "./camera";
import { LogsSection } from "./logs";
import dynamic from "next/dynamic";

const MapWithTable = dynamic(() => import("../../components/admin/MapView"), {
  ssr: false,
});

const { Title } = Typography;
const { useBreakpoint } = Grid;

const DeviceManagement: React.FC = () => {
  const screens = useBreakpoint();
  const [selectedDeviceKey, setSelectedDeviceKey] = useState<number | null>(
    null
  );
  return (
    <AdminLayout>
      <div
        style={{
          padding: screens.xs ? 8 : 24,
          maxWidth: 1700,
          margin: "0 auto",
        }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 8px #f0f1f2",
            minWidth: 0,
          }}
        >
          <Title
            level={screens.xs ? 4 : 2}
            style={{
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: screens.xs ? 20 : undefined,
            }}
          >
            <ControlOutlined
              style={{ color: "#1677ff", fontSize: screens.xs ? 20 : 28 }}
            />{" "}
            Monotor
          </Title>
          <Divider
            style={{ margin: screens.xs ? "8px 0 16px 0" : "16px 0 24px 0" }}
          />
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} style={{ minWidth: 0 }}>
              <Card
                bordered
                style={{
                  borderRadius: 10,
                  minHeight: 400,
                  marginBottom: screens.xs ? 12 : 0,
                }}
              >
                <Title
                  level={screens.xs ? 5 : 4}
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: screens.xs ? 16 : undefined,
                  }}
                >
                  <ControlOutlined /> Controller
                </Title>
                <div style={{ width: "100%", height: 400 }}>
                  <MapWithTable
                    onlyMap={true}
                    selectedDeviceKey={selectedDeviceKey}
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12} style={{ minWidth: 0 }}>
              <Card
                bordered
                style={{
                  borderRadius: 10,
                  minHeight: 400,
                  marginBottom: screens.xs ? 12 : 0,
                }}
                bodyStyle={{ padding: 8, overflowX: "auto" }}
              >
                <Title
                  level={screens.xs ? 5 : 4}
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: screens.xs ? 16 : undefined,
                  }}
                >
                  Devices Table
                </Title>
                <div
                  style={{
                    width: "100%",
                    minWidth: 500,
                    overflowX: "auto",
                    padding: 8,
                  }}
                >
                  <MapWithTable
                    onlyTable={true}
                    onSelectDevice={(device) =>
                      setSelectedDeviceKey(device.key)
                    }
                    selectedDeviceKey={selectedDeviceKey}
                    tableSize="middle"
                  />
                </div>
              </Card>
            </Col>
          </Row>
          <Row
            gutter={[screens.xs ? 12 : 32, screens.xs ? 12 : 32]}
            style={{ marginTop: screens.xs ? 8 : 0 }}
          >
            <Col span={24} style={{ minWidth: 0 }}>
              <Card
                bordered
                style={{
                  borderRadius: 10,
                  minHeight: 320,
                  marginBottom: screens.xs ? 12 : 0,
                }}
              >
                <Title
                  level={screens.xs ? 5 : 4}
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: screens.xs ? 16 : undefined,
                  }}
                >
                  <VideoCameraOutlined /> Camera
                </Title>
                <CameraSection />
              </Card>
            </Col>
          </Row>
          <Divider
            style={{ margin: screens.xs ? "16px 0 12px 0" : "32px 0 24px 0" }}
          />
          <Card
            bordered
            style={{ borderRadius: 10, marginTop: screens.xs ? 8 : 0 }}
          >
            <Title
              level={screens.xs ? 5 : 4}
              style={{
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: screens.xs ? 16 : undefined,
              }}
            >
              <FileSearchOutlined /> Logs
            </Title>
            <LogsSection />
          </Card>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DeviceManagement;
