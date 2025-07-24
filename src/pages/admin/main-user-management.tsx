import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Card, Row, Col, Divider, Typography, Grid } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  FileSearchOutlined,
  KeyOutlined,
  QrcodeOutlined,
  GroupOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const MainUserManagement: React.FC = () => {
  const screens = useBreakpoint();
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
            <TeamOutlined
              style={{ color: "#1677ff", fontSize: screens.xs ? 20 : 28 }}
            />
            Main User Management
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
                  minHeight: 220,
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
                  <UserOutlined /> Users
                </Title>
                <div
                  style={{
                    color: "#888",
                    fontSize: 16,
                    padding: 32,
                    textAlign: "center",
                  }}
                >
                  Users table will be displayed here.
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12} style={{ minWidth: 0 }}>
              <Card
                bordered
                style={{
                  borderRadius: 10,
                  minHeight: 220,
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
                  <KeyOutlined /> Cards
                </Title>
                <div
                  style={{
                    color: "#888",
                    fontSize: 16,
                    padding: 32,
                    textAlign: "center",
                  }}
                >
                  Cards table will be displayed here.
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12} style={{ minWidth: 0 }}>
              <Card
                bordered
                style={{
                  borderRadius: 10,
                  minHeight: 220,
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
                  <QrcodeOutlined /> QR Codes
                </Title>
                <div
                  style={{
                    color: "#888",
                    fontSize: 16,
                    padding: 32,
                    textAlign: "center",
                  }}
                >
                  QR Codes table will be displayed here.
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12} style={{ minWidth: 0 }}>
              <Card
                bordered
                style={{
                  borderRadius: 10,
                  minHeight: 220,
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
                  <TeamOutlined /> Groups
                </Title>
                <div
                  style={{
                    color: "#888",
                    fontSize: 16,
                    padding: 32,
                    textAlign: "center",
                  }}
                >
                  Groups table will be displayed here.
                </div>
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
            <div style={{ color: "#888", fontSize: 16, padding: 32 }}>
              User logs will be displayed here.
            </div>
          </Card>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MainUserManagement;
