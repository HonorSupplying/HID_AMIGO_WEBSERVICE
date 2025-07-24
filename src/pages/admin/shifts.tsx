import AdminLayout from "../../components/admin/AdminLayout";
import { Table, Button, Card, Modal, Form, Input, TimePicker } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";

type Shift = { key: number; name: string; startTime: string; endTime: string };
const initialShifts: Shift[] = [
  { key: 1, name: "Morning Shift", startTime: "08:00", endTime: "16:00" },
  { key: 2, name: "Evening Shift", startTime: "16:00", endTime: "00:00" },
  { key: 3, name: "Night Shift", startTime: "00:00", endTime: "08:00" },
];

export default function Shifts() {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Shift | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const handleEdit = (record: Shift) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };
  const handleDelete = (key: number) => {
    setShifts(shifts.filter((shift) => shift.key !== key));
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      const formatted = {
        ...values,
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
      };
      if (editing) {
        setShifts(
          shifts.map((shift) =>
            shift.key === editing.key ? { ...editing, ...formatted } : shift
          )
        );
      } else {
        setShifts([...shifts, { ...formatted, key: Date.now() }]);
      }
      setModalOpen(false);
    });
  };
  return (
    <AdminLayout>
      <Card
        title="Shifts"
        extra={
          <Button type="primary" onClick={handleAdd}>
            Add Shift
          </Button>
        }
      >
        <Table
          dataSource={shifts}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Start Time", dataIndex: "startTime" },
            { title: "End Time", dataIndex: "endTime" },
            {
              title: "Action",
              render: (_, record) => (
                <>
                  <Button
                    size="small"
                    onClick={() => handleEdit(record)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => handleDelete(record.key)}
                  >
                    Delete
                  </Button>
                </>
              ),
            },
          ]}
        />
        <Modal
          title={editing ? "Edit Shift" : "Add Shift"}
          open={modalOpen}
          onOk={handleOk}
          onCancel={() => setModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              {" "}
              <Input />{" "}
            </Form.Item>
            <Form.Item
              name="startTime"
              label="Start Time"
              rules={[{ required: true }]}
            >
              {" "}
              <TimePicker format="HH:mm" />{" "}
            </Form.Item>
            <Form.Item
              name="endTime"
              label="End Time"
              rules={[{ required: true }]}
            >
              {" "}
              <TimePicker format="HH:mm" />{" "}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </AdminLayout>
  );
}
