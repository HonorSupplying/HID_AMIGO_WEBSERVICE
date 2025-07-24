import AdminLayout from "../../components/admin/AdminLayout";
import {
  Card,
  Row,
  Col,
  Table,
  Statistic,
  Tag,
  Badge,
  Tooltip,
  Progress,
  Grid,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
  UserOutlined,
  ExclamationCircleTwoTone,
  CheckCircleTwoTone,
  VideoCameraOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import React from "react";
import { LineChart, BarChart } from "@mui/x-charts";
import { Tabs, DatePicker, Space } from "antd";
import dayjs from "dayjs";

const userStats = {
  total: 120,
  activeToday: 18,
  inactiveToday: 4,
};
const deviceStats = {
  total: 8,
  online: 7,
  offline: 1,
};
const accessStats = {
  today: 1500,
  trend: 5.2, // %
};
const alarmStats = {
  today: 3,
  critical: 1,
  warning: 2,
};
const accessTrendData = [1200, 1300, 1400, 1350, 1500, 1480, 1500]; // mock
const inOutStatusData = [
  { day: "Mon", in: 600, out: 580 },
  { day: "Tue", in: 650, out: 630 },
  { day: "Wed", in: 700, out: 690 },
  { day: "Thu", in: 670, out: 660 },
  { day: "Fri", in: 750, out: 740 },
  { day: "Sat", in: 740, out: 730 },
  { day: "Sun", in: 760, out: 750 },
];
const alarmTable = [
  {
    key: 1,
    type: "Critical",
    message: "Unauthorized access",
    device: "Main Door",
    time: "09:10",
    icon: <ExclamationCircleTwoTone twoToneColor="#f5222d" />,
  },
  {
    key: 2,
    type: "Warning",
    message: "Door forced open",
    device: "Back Door",
    time: "08:55",
    icon: <ExclamationCircleTwoTone twoToneColor="#faad14" />,
  },
  {
    key: 3,
    type: "Warning",
    message: "Device offline",
    device: "Server Room",
    time: "07:30",
    icon: <ExclamationCircleTwoTone twoToneColor="#faad14" />,
  },
];
const deviceTable = [
  {
    key: 1,
    name: "Main Door",
    status: "Online",
    ip: "192.168.1.101",
    icon: <VideoCameraOutlined style={{ color: "#52c41a" }} />,
  },
  {
    key: 2,
    name: "Back Door",
    status: "Online",
    ip: "192.168.1.102",
    icon: <VideoCameraOutlined style={{ color: "#52c41a" }} />,
  },
  {
    key: 3,
    name: "Server Room",
    status: "Offline",
    ip: "192.168.1.103",
    icon: <VideoCameraOutlined style={{ color: "#f5222d" }} />,
  },
];

export default function Dashboard() {
  const screens = Grid.useBreakpoint();
  return (
    <AdminLayout>
      <div
        style={{
          background: "#f5f7fa",
          minHeight: "100vh",
          padding: screens.xs ? "12px 8px" : "16px 32px",
          overflowY: "auto",
          paddingBottom: 48,
          paddingTop: 24,
        }}
      >
        {/* Summaries */}
        <h2 style={{ marginBottom: 16 }}>System Overview</h2>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Card
              bordered={false}
              style={{ minHeight: 120, textAlign: "center" }}
            >
              <Statistic
                title={screens.xs ? undefined : "Total Users"}
                value={userStats.total}
                prefix={<UserOutlined style={{ fontSize: 32 }} />}
              />
              {!screens.xs && (
                <div style={{ marginTop: 8 }}>
                  <Tag color="success">
                    Active Today: {userStats.activeToday}
                  </Tag>
                  <Tag color="default">
                    Inactive Today: {userStats.inactiveToday}
                  </Tag>
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Card
              bordered={false}
              style={{ minHeight: 120, textAlign: "center" }}
            >
              <Statistic
                title={screens.xs ? undefined : "Total Devices"}
                value={deviceStats.total}
                prefix={<VideoCameraOutlined style={{ fontSize: 32 }} />}
              />
              {!screens.xs && (
                <div style={{ marginTop: 8 }}>
                  <Tag color="success">Online: {deviceStats.online}</Tag>
                  <Tag color="error">Offline: {deviceStats.offline}</Tag>
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Card
              bordered={false}
              style={{ minHeight: 120, textAlign: "center" }}
            >
              <Statistic
                title={screens.xs ? undefined : "Access Logs Today"}
                value={accessStats.today}
                prefix={<KeyOutlined style={{ fontSize: 32 }} />}
              />
              {!screens.xs && (
                <div style={{ marginTop: 8 }}>
                  <Tag color={accessStats.trend >= 0 ? "green" : "red"}>
                    {accessStats.trend >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}{" "}
                    {Math.abs(accessStats.trend)}% Today
                  </Tag>
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Card
              bordered={false}
              style={{ minHeight: 120, textAlign: "center" }}
            >
              <Statistic
                title={screens.xs ? undefined : "Alarms Today"}
                value={alarmStats.today}
                prefix={
                  <ExclamationCircleTwoTone
                    twoToneColor="#faad14"
                    style={{ fontSize: 32 }}
                  />
                }
              />
              {!screens.xs && (
                <div style={{ marginTop: 8 }}>
                  <Tag color="error">Critical: {alarmStats.critical}</Tag>
                  <Tag color="warning">Warning: {alarmStats.warning}</Tag>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        {/* Charts (mock) */}
        <h3 style={{ margin: "32px 0 16px 0" }}>Trends</h3>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card
              bordered={false}
              style={{ minHeight: 320 }}
              title="Access Trend (7 days)"
            >
              <Space
                direction="vertical"
                style={{ width: "100%", marginBottom: 8 }}
              >
                <DatePicker.RangePicker
                  showTime
                  style={{ width: "100%" }}
                  onChange={(dates) => {
                    // TODO: filter accessTrendData by selected date range
                    console.log(
                      "Access Trend Range:",
                      dates?.map((d) => d && d.format("YYYY-MM-DD HH:mm:ss"))
                    );
                  }}
                  defaultValue={[
                    dayjs().subtract(6, "day").startOf("day"),
                    dayjs().endOf("day"),
                  ]}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Space>
              <Tabs
                defaultActiveKey="line"
                items={[
                  {
                    key: "line",
                    label: "Line",
                    children: (
                      <div
                        style={{
                          background: "#f8fbff",
                          borderRadius: 8,
                          padding: 8,
                        }}
                      >
                        <LineChart
                          height={160}
                          series={[
                            {
                              data: accessTrendData,
                              label: "Accesses",
                              color: "#1976d2",
                              showMark: true,
                              area: true,
                            },
                          ]}
                          xAxis={[
                            {
                              scaleType: "point",
                              data: [
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                                "Sun",
                              ],
                              label: "Day",
                              tickLabelStyle: {
                                fontWeight: 500,
                                fontSize: 13,
                                fill: "#1976d2",
                              },
                            },
                          ]}
                          yAxis={[
                            {
                              label: "Accesses",
                              tickLabelStyle: {
                                fontWeight: 500,
                                fontSize: 13,
                                fill: "#1976d2",
                              },
                            },
                          ]}
                          grid={{ vertical: true, horizontal: true }}
                          sx={{
                            ".MuiLineElement-root": { strokeWidth: 3 },
                            ".MuiMarkElement-root": {
                              stroke: "#1976d2",
                              fill: "#1976d2",
                            },
                          }}
                        />
                      </div>
                    ),
                  },
                  {
                    key: "bar",
                    label: "Bar",
                    children: (
                      <div
                        style={{
                          background: "#f8fbff",
                          borderRadius: 8,
                          padding: 8,
                        }}
                      >
                        <BarChart
                          height={160}
                          series={[
                            {
                              data: accessTrendData,
                              label: "Accesses",
                              color: "#1976d2",
                            },
                          ]}
                          xAxis={[
                            {
                              scaleType: "band",
                              data: [
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                                "Sun",
                              ],
                              label: "Day",
                              tickLabelStyle: {
                                fontWeight: 500,
                                fontSize: 13,
                                fill: "#1976d2",
                              },
                            },
                          ]}
                          yAxis={[
                            {
                              label: "Accesses",
                              tickLabelStyle: {
                                fontWeight: 500,
                                fontSize: 13,
                                fill: "#1976d2",
                              },
                            },
                          ]}
                          grid={{ vertical: true, horizontal: true }}
                          sx={{
                            ".MuiBarElement-root": { fill: "#1976d2", rx: 4 },
                          }}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              bordered={false}
              style={{ minHeight: 320 }}
              title="In-Out Status"
            >
              <Space
                direction="vertical"
                style={{ width: "100%", marginBottom: 8 }}
              >
                <DatePicker.RangePicker
                  showTime
                  style={{ width: "100%" }}
                  onChange={(dates) => {
                    // TODO: filter inOutStatusData by selected date range
                    console.log(
                      "In-Out Range:",
                      dates?.map((d) => d && d.format("YYYY-MM-DD HH:mm:ss"))
                    );
                  }}
                  defaultValue={[
                    dayjs().subtract(6, "day").startOf("day"),
                    dayjs().endOf("day"),
                  ]}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Space>
              <div
                style={{ background: "#f8fbff", borderRadius: 8, padding: 8 }}
              >
                <BarChart
                  height={160}
                  series={[
                    {
                      data: inOutStatusData.map((d) => d.in),
                      label: "In",
                      color: "#1976d2",
                    },
                    {
                      data: inOutStatusData.map((d) => d.out),
                      label: "Out",
                      color: "#43a047",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: inOutStatusData.map((d) => d.day),
                      label: "Day",
                      tickLabelStyle: {
                        fontWeight: 500,
                        fontSize: 13,
                        fill: "#1976d2",
                      },
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Count",
                      tickLabelStyle: {
                        fontWeight: 500,
                        fontSize: 13,
                        fill: "#1976d2",
                      },
                    },
                  ]}
                  grid={{ vertical: true, horizontal: true }}
                  sx={{
                    ".MuiBarElement-root": { rx: 4 },
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
        {/* Details */}
        <h3 style={{ margin: "32px 0 16px 0" }}>Details</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card
              bordered={false}
              title={
                <>
                  <Badge
                    count={alarmStats.today}
                    style={{ background: "#faad14" }}
                  />{" "}
                  Alarms
                </>
              }
            >
              <div style={{ overflowX: "auto" }}>
                <Table
                  dataSource={alarmTable}
                  columns={[
                    {
                      title: "Type",
                      dataIndex: "type",
                      render: (v) => (
                        <Tag color={v === "Critical" ? "error" : "warning"}>
                          {v}
                        </Tag>
                      ),
                    },
                    { title: " ", dataIndex: "icon" },
                    { title: "Message", dataIndex: "message" },
                    { title: "Device", dataIndex: "device" },
                    { title: "Time", dataIndex: "time" },
                  ]}
                  size="small"
                  pagination={false}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <a href="#">View All</a>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card bordered={false} title="Devices">
              <div style={{ overflowX: "auto" }}>
                <Table
                  dataSource={deviceTable}
                  columns={[
                    { title: " ", dataIndex: "icon" },
                    { title: "Name", dataIndex: "name" },
                    {
                      title: "Status",
                      dataIndex: "status",
                      render: (v) =>
                        v === "Online" ? (
                          <Tag color="success">Online</Tag>
                        ) : (
                          <Tag color="error">Offline</Tag>
                        ),
                    },
                    { title: "IP", dataIndex: "ip" },
                  ]}
                  size="small"
                  pagination={false}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <Card bordered={false} title="System Summary">
              <div style={{ color: "#888", marginBottom: 8 }}>
                ระบบ HID Amico รองรับการจัดการผู้ใช้, อุปกรณ์, การเข้าใช้งาน
                และแจ้งเตือนแบบเรียลไทม์
              </div>
              <div style={{ color: "#888" }}>
                สามารถดูสถิติ, สถานะอุปกรณ์,
                และประวัติการเข้าใช้งานได้จากหน้านี้
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card bordered={false} title="Notes">
              <div style={{ color: "#888", marginBottom: 8 }}>
                ข้อมูลนี้เป็นตัวอย่างการแสดงผล Dashboard สำหรับระบบ Access
                Control
              </div>
              <div style={{ color: "#888" }}>
                สามารถเชื่อมต่อข้อมูลจริงและเพิ่มกราฟ/ฟีเจอร์ได้ตามต้องการ
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}
