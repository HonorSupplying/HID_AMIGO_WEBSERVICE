import AdminLayout from "../../components/admin/AdminLayout";
import { Table, Button, Card, Modal, Form, Input } from "antd";
import React, { useState } from "react";

type AccessRule = { key: number; name: string; description: string };
const initialAccessRules: AccessRule[] = [
  { key: 1, name: "Rule 1", description: "เข้าได้เฉพาะวันจันทร์-ศุกร์" },
  { key: 2, name: "Rule 2", description: "เข้าได้เฉพาะเวลากลางวัน" },
];

export default function AccessRules() {
  const [rules, setRules] = useState<AccessRule[]>(initialAccessRules);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AccessRule | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const handleEdit = (record: AccessRule) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };
  const handleDelete = (key: number) => {
    setRules(rules.filter((rule) => rule.key !== key));
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editing) {
        setRules(
          rules.map((rule) =>
            rule.key === editing.key ? { ...editing, ...values } : rule
          )
        );
      } else {
        setRules([...rules, { ...values, key: Date.now() }]);
      }
      setModalOpen(false);
    });
  };
  return (
    <AdminLayout>
      <Card
        title="Access Rules"
        extra={
          <Button type="primary" onClick={handleAdd}>
            Add Rule
          </Button>
        }
      >
        <Table
          dataSource={rules}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Description", dataIndex: "description" },
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
          title={editing ? "Edit Rule" : "Add Rule"}
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
              name="description"
              label="Description"
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
