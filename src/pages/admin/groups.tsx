import AdminLayout from "../../components/admin/AdminLayout";
import { Table, Button, Card, Modal, Form, Input } from "antd";
import React, { useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

type Group = { key: number; name: string; description: string };
const initialGroups: Group[] = [
  { key: 1, name: "Admin", description: "ผู้ดูแลระบบ" },
  { key: 2, name: "User", description: "ผู้ใช้งานทั่วไป" },
];

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const handleEdit = (record: Group) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };
  const handleDelete = (key: number) => {
    setGroups(groups.filter((group) => group.key !== key));
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editing) {
        setGroups(
          groups.map((group) =>
            group.key === editing.key ? { ...editing, ...values } : group
          )
        );
      } else {
        setGroups([...groups, { ...values, key: Date.now() }]);
      }
      setModalOpen(false);
    });
  };
  return (
    <AdminLayout>
      <Card
        title="Groups"
        extra={
          <Button type="primary" onClick={handleAdd}>
            Add Group
          </Button>
        }
        style={{ margin: "0 32px", paddingTop: 24 }}
      >
        {loading ? (
          <LoadingSpinner tip="กำลังโหลดข้อมูล..." size="large" />
        ) : (
          <>
            <Table
              dataSource={groups}
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
              size="small"
              pagination={{ pageSize: 5, showSizeChanger: true }}
            />
            <Modal
              title={editing ? "Edit Group" : "Add Group"}
              open={modalOpen}
              onOk={handleOk}
              onCancel={() => setModalOpen(false)}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true }]}
                >
                  {" "}
                  <Input />{" "}
                </Form.Item>
                <Form.Item name="description" label="Description">
                  {" "}
                  <Input />{" "}
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </Card>
    </AdminLayout>
  );
}
