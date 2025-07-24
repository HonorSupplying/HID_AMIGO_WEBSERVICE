import AdminLayout from "../../components/admin/AdminLayout";
import {
  Table,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Statistic,
  message,
  Badge,
  Tooltip,
  Dropdown,
  Menu,
  Popconfirm,
  Select,
  Empty,
  Spin,
} from "antd";
import {
  ReloadOutlined,
  DownloadOutlined,
  PlusOutlined,
  MoreOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const { Option } = Select;

const initialCards = [
  {
    key: 1,
    cardNumber: "1234567890",
    owner: "สมชาย",
    status: "Active",
    issued: "2024-07-23",
  },
  {
    key: 2,
    cardNumber: "0987654321",
    owner: "สมหญิง",
    status: "Inactive",
    issued: "2024-07-20",
  },
  {
    key: 3,
    cardNumber: "5555555555",
    owner: "John Doe",
    status: "Active",
    issued: "2024-07-23",
  },
];

export default function Cards() {
  const [cards, setCards] = useState(initialCards);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [quickAdd, setQuickAdd] = useState("");

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const handleEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };
  const handleDelete = (key: number) => {
    setCards(cards.filter((card) => card.key !== key));
    message.success("Card deleted");
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editing) {
        setCards(
          cards.map((card) =>
            card.key === editing.key ? { ...editing, ...values } : card
          )
        );
        message.success("Card updated");
      } else {
        setCards([
          ...cards,
          {
            ...values,
            key: Date.now(),
            issued: new Date().toISOString().slice(0, 10),
          },
        ]);
        message.success("Card added");
      }
      setModalOpen(false);
    });
  };
  const handleRefresh = () => {
    message.success("Synced!");
  };

  // Search, filter, sort
  let filteredCards = cards.filter(
    (c) =>
      c.cardNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.owner.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  );
  if (statusFilter)
    filteredCards = filteredCards.filter((c) => c.status === statusFilter);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) =>
      setSelectedRowKeys(newSelectedRowKeys),
  };

  // Stats
  const total = cards.length;
  const active = cards.filter((c) => c.status === "Active").length;
  const inactive = cards.filter((c) => c.status !== "Active").length;
  const today = new Date().toISOString().slice(0, 10);
  const issuedToday = cards.filter((c) => c.issued === today).length;

  return (
    <AdminLayout>
      <Card
        title="Cards"
        extra={
          <>
            <Button
              icon={<ReloadOutlined />}
              size="small"
              onClick={handleRefresh}
              style={{ marginRight: 8 }}
            >
              Sync
            </Button>
            <Button type="primary" onClick={handleAdd}>
              Add Card
            </Button>
          </>
        }
        style={{ margin: "0 32px", paddingTop: 24 }}
      >
        {loading ? (
          <LoadingSpinner tip="กำลังโหลดข้อมูล..." size="large" />
        ) : (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card>
                  <Statistic title="Total Cards" value={total} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Active" value={active} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Inactive" value={inactive} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Issued Today" value={issuedToday} />
                </Card>
              </Col>
            </Row>
            <Row gutter={8} style={{ marginBottom: 8 }} align="middle">
              <Col>
                <Input.Search
                  placeholder="Search card number, owner, status"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: 220 }}
                  allowClear
                />
              </Col>
              <Col>
                <Select
                  allowClear
                  placeholder={
                    <>
                      <FilterOutlined /> Status
                    </>
                  }
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 120 }}
                >
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Col>
            </Row>
            <div style={{ marginBottom: 8 }}>
              {selectedRowKeys.length > 0 && (
                <span>Selected {selectedRowKeys.length} card(s)</span>
              )}
            </div>
            <Table
              rowSelection={rowSelection}
              dataSource={filteredCards}
              columns={[
                {
                  title: "Card Number",
                  dataIndex: "cardNumber",
                  sorter: (a, b) => a.cardNumber.localeCompare(b.cardNumber),
                },
                {
                  title: "Owner",
                  dataIndex: "owner",
                  sorter: (a, b) => a.owner.localeCompare(b.owner),
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  sorter: (a, b) => a.status.localeCompare(b.status),
                },
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
              pagination={{ pageSize: 5, showSizeChanger: true }}
            />
          </>
        )}
        <Modal
          title={editing ? "Edit Card" : "Add Card"}
          open={modalOpen}
          onOk={handleOk}
          onCancel={() => setModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="cardNumber"
              label="Card Number"
              rules={[{ required: true }]}
            >
              <Input />
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
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>{" "}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </AdminLayout>
  );
}
