import {
  Layout,
  Menu,
  Row,
  Col,
  Statistic,
  Badge,
  Avatar,
  Tag,
  Tooltip,
  Grid,
} from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  KeyOutlined,
  QrcodeOutlined,
  TeamOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  ControlOutlined,
  FileSearchOutlined,
  SyncOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  CloudTwoTone,
  InfoCircleOutlined,
  BellOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import React, { useState } from "react";

const { Sider, Header, Content, Footer } = Layout;

const menuItems = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/admin/dashboard">Dashboard</Link>,
  },
  {
    key: "user-management",
    icon: <UserOutlined />,
    label: "User Management",
    children: [
      {
        key: "main-user-management",
        icon: <TeamOutlined />,
        label: (
          <Link href="/admin/main-user-management">Main User Management</Link>
        ),
      },
      {
        key: "users",
        icon: <UserOutlined />,
        label: <Link href="/admin/users">Users</Link>,
      },
      {
        key: "cards",
        icon: <KeyOutlined />,
        label: <Link href="/admin/cards">Cards</Link>,
      },
      {
        key: "qrcodes",
        icon: <QrcodeOutlined />,
        label: <Link href="/admin/qrcodes">QR Codes</Link>,
      },
      {
        key: "groups",
        icon: <TeamOutlined />,
        label: <Link href="/admin/groups">Groups</Link>,
      },
      {
        key: "access-control",
        icon: <SettingOutlined />,
        label: "Access Control",
        children: [
          {
            key: "access-rules",
            icon: <SettingOutlined />,
            label: <Link href="/admin/access-rules">Access Rules</Link>,
          },
          {
            key: "time-",
            icon: <ClockCircleOutlined />,
            label: <Link href="/admin/time-zones">Time Zones</Link>,
          },
        ],
      },
    ],
  },
  {
    key: "device-management",
    icon: <ControlOutlined />,
    label: "Device Management",
    children: [
      {
        key: "main-device-management",
        icon: <ControlOutlined />,
        label: (
          <Link href="/admin/device-management">Main Device Management</Link>
        ),
      },
      {
        key: "remote-control",
        icon: <ControlOutlined />,
        label: <Link href="/admin/remote-control">Remote Control</Link>,
      },
      {
        key: "camera",
        icon: <VideoCameraOutlined />,
        label: <Link href="/admin/camera">Camera</Link>,
      },
      
    ],
  },
  {
    key: "logs",
    icon: <FileSearchOutlined />,
    label: <Link href="/admin/logs">Logs</Link>,
  },
  {
    key: "System Settings",
    icon: <SettingOutlined />,
    label: <Link href="/admin/setting">Setting</Link>,
  },

];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const screens = Grid.useBreakpoint();
  const FOOTER_HEIGHT = 56;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          height: "100vh",
          zIndex: 100,
        }}
      >
        <div
          style={{
            color: "#fff",
            padding: 16,
            fontWeight: "bold",
            fontSize: 18,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <img
            src="/HID_Global_logo.svg.png"
            alt="HID Global Logo"
            style={{
              maxWidth: "100%",
              maxHeight: 48,
              objectFit: "contain",
              margin: "0 auto",
              display: "block",
              filter: "brightness(0) invert(1)", // make logo white for dark sidebar
            }}
          />
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        <Header
          style={{
            background: "#fff",
            padding: 0,
            minHeight: 48,
            position: "fixed",
            top: 0,
            left: collapsed ? 80 : 200,
            right: 0,
            zIndex: 100,
            width: `calc(100% - ${collapsed ? 80 : 200}px)`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              height: 48,
              padding: "0 16px",
              gap: 8,
            }}
          >
            {/* Left: Last Sync */}
            <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
              <SyncOutlined
                spin
                style={{ color: "#52c41a", marginRight: 4, fontSize: 18 }}
              />
              <span style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                Last Sync: 09:45
              </span>
            </div>
            {/* Center: Stats */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                gap: screens.lg ? 32 : 16,
                minWidth: 0,
              }}
            >
              {screens.lg ? (
                <>
                  {/* User Active */}
                  <div
                    style={{
                      position: "relative",
                      minWidth: 60,
                      textAlign: "center",
                    }}
                  >
                    <Statistic
                      title={
                        <span style={{ fontSize: 12 }}>User Active Today</span>
                      }
                      value={12}
                      valueStyle={{ fontSize: 16 }}
                      prefix={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                      suffix={
                        <Tag color="success" style={{ marginLeft: 4 }}>
                          Active
                        </Tag>
                      }
                      style={{ textAlign: "center" }}
                    />
                  </div>
                  {/* User Inactive */}
                  <div
                    style={{
                      position: "relative",
                      minWidth: 60,
                      textAlign: "center",
                    }}
                  >
                    <Statistic
                      title={
                        <span style={{ fontSize: 12 }}>
                          User Inactive Today
                        </span>
                      }
                      value={3}
                      valueStyle={{ fontSize: 16 }}
                      prefix={<CloseCircleTwoTone twoToneColor="#faad14" />}
                      suffix={
                        <Tag color="default" style={{ marginLeft: 4 }}>
                          Inactive
                        </Tag>
                      }
                      style={{ textAlign: "center" }}
                    />
                  </div>
                  {/* Device Online */}
                  <div
                    style={{
                      position: "relative",
                      minWidth: 60,
                      textAlign: "center",
                    }}
                  >
                    <Statistic
                      title={
                        <span style={{ fontSize: 12 }}>Device Online</span>
                      }
                      value={5}
                      valueStyle={{ fontSize: 16 }}
                      prefix={<CloudTwoTone twoToneColor="#52c41a" />}
                      style={{ textAlign: "center" }}
                    />
                  </div>
                  {/* Device Offline */}
                  <div
                    style={{
                      position: "relative",
                      minWidth: 60,
                      textAlign: "center",
                    }}
                  >
                    <Statistic
                      title={
                        <span style={{ fontSize: 12 }}>Device Offline</span>
                      }
                      value={1}
                      valueStyle={{ fontSize: 16 }}
                      prefix={<CloudTwoTone twoToneColor="#f5222d" />}
                      style={{ textAlign: "center" }}
                    />
                  </div>
                </>
              ) : (
                <Tooltip
                  placement="bottom"
                  title={
                    <div style={{ minWidth: 180 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <CheckCircleTwoTone
                          twoToneColor="#52c41a"
                          style={{ marginRight: 6, color: "#52c41a" }}
                        />
                        <b style={{ color: "#52c41a" }}>{12}</b>
                        <span style={{ marginLeft: 6, color: "#52c41a" }}>
                          User Active{" "}
                          <Tag color="success" style={{ marginLeft: 4 }}>
                            Active
                          </Tag>
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <CloseCircleTwoTone
                          twoToneColor="#52c41a"
                          style={{ marginRight: 6, color: "#52c41a" }}
                        />
                        <b style={{ color: "#52c41a" }}>{3}</b>
                        <span style={{ marginLeft: 6, color: "#52c41a" }}>
                          User Inactive{" "}
                          <Tag color="success" style={{ marginLeft: 4 }}>
                            Inactive
                          </Tag>
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <CloudTwoTone
                          twoToneColor="#52c41a"
                          style={{ marginRight: 6, color: "#52c41a" }}
                        />
                        <b style={{ color: "#52c41a" }}>{5}</b>
                        <span style={{ marginLeft: 6, color: "#52c41a" }}>
                          Device Online
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CloudTwoTone
                          twoToneColor="#52c41a"
                          style={{ marginRight: 6, color: "#52c41a" }}
                        />
                        <b style={{ color: "#52c41a" }}>{1}</b>
                        <span style={{ marginLeft: 6, color: "#52c41a" }}>
                          Device Offline
                        </span>
                      </div>
                    </div>
                  }
                >
                  <InfoCircleOutlined
                    style={{
                      fontSize: 22,
                      color: "#52c41a",
                      cursor: "pointer",
                      verticalAlign: "middle",
                    }}
                  />
                </Tooltip>
              )}
            </div>
            {/* Right: Alarm/Error icons and Admin info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: 0,
                gap: 12,
              }}
            >
              {/* Alarm Log Icon */}
              <Tooltip title="Alarm Logs">
                <Badge count={2} size="small" offset={[0, 2]}>
                  <Link href="/admin/logs?type=alarm">
                    <BellOutlined
                      style={{
                        fontSize: 20,
                        color: "#faad14",
                        cursor: "pointer",
                      }}
                    />
                  </Link>
                </Badge>
              </Tooltip>
              {/* Error Log Icon */}
              <Tooltip title="Error Logs">
                <Badge count={1} size="small" offset={[0, 2]}>
                  <Link href="/admin/logs?type=error">
                    <WarningOutlined
                      style={{
                        fontSize: 20,
                        color: "#f5222d",
                        cursor: "pointer",
                      }}
                    />
                  </Link>
                </Badge>
              </Tooltip>
              <Avatar
                icon={<UserOutlined />}
                size="small"
                style={{ marginRight: 4 }}
              />
              <span
                style={{
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                admin (Super Admin)
              </span>
            </div>
          </div>
        </Header>
        <Content
          style={{
            flex: 1,
            width: "100%",
            marginTop: 48,
            // marginBottom: 28, // ลบออก
            overflowY: "auto",
            paddingBottom: 56, // เพิ่ม paddingBottom เท่ากับความสูง Footer
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#fff",
            color: "#888",
            fontSize: 14,
            minHeight: 28,
            lineHeight: "28px",
            position: "fixed",
            left: collapsed ? 80 : 200,
            right: 0,
            bottom: 0,
            zIndex: 100,
            width: `calc(100% - ${collapsed ? 80 : 200}px)`,
          }}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <img
              src="/HID_Global_logo.svg.png"
              alt="HID Global Logo"
              style={{
                maxHeight: 24,
                verticalAlign: "middle",
                display: "inline-block",
              }}
            />
            Powered By HID®
          </span>
        </Footer>
      </Layout>
      <style jsx global>{`
        @media (max-width: 768px) {
          .header-stat-col {
            display: none !important;
          }
          .ant-layout-header {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
        }
      `}</style>
    </Layout>
  );
}
