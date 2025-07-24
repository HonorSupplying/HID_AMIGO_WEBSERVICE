import AdminLayout from "../../components/admin/AdminLayout";
import { Card, Table, Tabs } from "antd";
import React from "react";

const accessLogs = [
  { key: 1, user: "สมชาย", time: "09:00", status: "เข้า" },
  { key: 2, user: "สมหญิง", time: "09:05", status: "เข้า" },
];
const alarmLogs = [
  { key: 1, type: "งัดแงะ", time: "09:10", status: "แจ้งเตือน" },
];

export function LogsSection() {
  return (
    <Card title="Logs">
      <Tabs
        defaultActiveKey="access"
        items={[
          {
            key: "access",
            label: "Access Logs",
            children: (
              <Table
                dataSource={accessLogs}
                columns={[
                  { title: "User", dataIndex: "user" },
                  { title: "Time", dataIndex: "time" },
                  { title: "Status", dataIndex: "status" },
                ]}
                size="small"
                pagination={false}
              />
            ),
          },
          {
            key: "alarm",
            label: "Alarm Logs",
            children: (
              <Table
                dataSource={alarmLogs}
                columns={[
                  { title: "Type", dataIndex: "type" },
                  { title: "Time", dataIndex: "time" },
                  { title: "Status", dataIndex: "status" },
                ]}
                size="small"
                pagination={false}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}

export default function LogsPage() {
  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <LogsSection />
      </div>
    </AdminLayout>
  );
}
