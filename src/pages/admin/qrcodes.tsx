import AdminLayout from "../../components/admin/AdminLayout";
import { Table, Button, Card, Modal, Form, Input } from "antd";
import React, { useState } from "react";

type QRCode = { key: number; code: string; owner: string; status: string };
const initialQRCodes: QRCode[] = [
  { key: 1, code: "QR123456", owner: "สมชาย", status: "Active" },
  { key: 2, code: "QR654321", owner: "สมหญิง", status: "Inactive" },
];

export default function QRCodes() {
  const [qrcodes, setQRCodes] = useState<QRCode[]>(initialQRCodes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<QRCode | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const handleEdit = (record: QRCode) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };
  const handleDelete = (key: number) => {
    setQRCodes(qrcodes.filter((qr) => qr.key !== key));
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editing) {
        setQRCodes(
          qrcodes.map((qr) =>
            qr.key === editing.key ? { ...editing, ...values } : qr
          )
        );
      } else {
        setQRCodes([...qrcodes, { ...values, key: Date.now() }]);
      }
      setModalOpen(false);
    });
  };
  return (
    <AdminLayout>
      <Card
        title="QR Codes"
        extra={
          <Button type="primary" onClick={handleAdd}>
            Add QR Code
          </Button>
        }
        style={{ margin: "0 32px", paddingTop: 24 }}
      >
        <Table
          dataSource={qrcodes}
          columns={[
            { title: "QR Code", dataIndex: "code" },
            { title: "Owner", dataIndex: "owner" },
            { title: "Status", dataIndex: "status" },
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
          title={editing ? "Edit QR Code" : "Add QR Code"}
          open={modalOpen}
          onOk={handleOk}
          onCancel={() => setModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="code" label="QR Code" rules={[{ required: true }]}>
              {" "}
              <Input />{" "}
            </Form.Item>
            <Form.Item name="owner" label="Owner" rules={[{ required: true }]}>
              {" "}
              <Input />{" "}
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              {" "}
              <Input />{" "}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </AdminLayout>
  );
}
