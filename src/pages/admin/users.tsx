import AdminLayout from "../../components/admin/AdminLayout";
import {
  Table,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Select,
  message,
  Switch,
  Row,
  Col,
  Statistic,
  DatePicker,
  Dropdown,
  Menu,
  Typography,
  Tooltip,
} from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Tag } from "antd";
import {
  PlusOutlined,
  UserAddOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  MoreOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { initialUsers } from "../../mockdata/users";
import { initialGroups } from "../../mockdata/groups";
import { initialZones } from "../../mockdata/zones";
import { accessRules } from "../../mockdata/accessRules";
import { shifts } from "../../mockdata/shifts";

const { Option } = Select;

// Define types for Group and Zone
type Group = {
  key: number;
  name: string;
  description: string;
  type: string;
  company: string;
  dateRange?: string[];
  locked?: boolean;
};
type Zone = {
  key: number;
  name: string;
  description: string;
  assignedGroups: number[];
  assignedUsers: number[];
  locked?: boolean;
};

// เพิ่ม glassCardStyle แบบ Apple iOS
const glassCardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.25)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.18)",
  minWidth: 280,
  minHeight: 220,
  marginBottom: 16,
  transition: "box-shadow 0.2s, background 0.2s",
};

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  // Separate zone groups and other groups
  const zoneGroupNames = ["Low Zone", "High Zone"];
  const zoneGroups = initialZones.filter((z) =>
    zoneGroupNames.includes(z.name)
  );
  const otherGroups = initialGroups.filter(
    (g) => !zoneGroupNames.includes(g.name)
  );

  const [groups, setGroups] = useState<Group[]>(
    otherGroups.map((g) => ({ ...g, locked: false }))
  );
  const [zoneGroupsState, setZoneGroupsState] = useState<Zone[]>(
    initialZones.map((z) => ({
      key: z.key,
      name: z.name,
      description: z.description,
      assignedGroups: [],
      assignedUsers: [],
      locked: false,
    }))
  );
  const [groupUsers, setGroupUsers] = useState<{ [group: string]: User[] }>(
    () => {
      const map: { [group: string]: User[] } = {};
      initialGroups.forEach((g) => (map[g.name] = []));
      initialUsers.forEach((u) => {
        u.groups.forEach((g) => {
          if (!map[g]) map[g] = [];
          map[g].push(u);
        });
      });
      return map;
    }
  );

  // Add state for group modal
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupType, setNewGroupType] = useState("Full Time");
  const [newGroupDateRange, setNewGroupDateRange] = useState<
    [Dayjs | null, Dayjs | null]
  >([null, null]);
  const [groupSearch, setGroupSearch] = useState<{ [group: string]: string }>(
    {}
  );
  const [groupSort, setGroupSort] = useState<{ [group: string]: string }>({});

  // Add state for zone modal
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneDesc, setNewZoneDesc] = useState("");
  const [newZoneAssignedGroups, setNewZoneAssignedGroups] = useState<number[]>(
    []
  );
  const [newZoneAssignedUsers, setNewZoneAssignedUsers] = useState<number[]>(
    []
  );

  // Add state for user management modal
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [manageTarget, setManageTarget] = useState<{
    type: "group" | "zone";
    name: string;
  } | null>(null);
  const [manageSelectedKeys, setManageSelectedKeys] = useState<React.Key[]>([]);

  // Add state for group assignment modal in zones
  const [manageGroupModalOpen, setManageGroupModalOpen] = useState(false);
  const [manageGroupTarget, setManageGroupTarget] = useState<string | null>(
    null
  );
  const [manageGroupSelectedKeys, setManageGroupSelectedKeys] = useState<
    React.Key[]
  >([]);

  // Add state for move/remove actions
  const [moveUserModal, setMoveUserModal] = useState<{
    user: User;
    from: string;
    type: "group" | "zone";
  } | null>(null);
  const [removeUserModal, setRemoveUserModal] = useState<{
    user: User;
    from: string;
    type: "group" | "zone";
  } | null>(null);

  // Add state for View All modal
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);
  const [viewAllTarget, setViewAllTarget] = useState<{
    type: "group" | "zone";
    name: string;
  } | null>(null);

  // Define User type
  interface User {
    key: number;
    name: string;
    email: string;
    groups: string[];
    status: string;
    avatar: string;
    company?: string;
    position?: string;
    joined: string;
    zones?: string[]; // Added zones field
  }

  const companyOptions: string[] = [
    "ACME Facility",
    "BetaCorp",
    "Gamma Industries",
  ];

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const handleEdit = (record: User) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };
  const handleDelete = (key: number) => {
    setUsers(users.filter((user) => user.key !== key));
    message.success("User deleted");
  };
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editing) {
        setUsers(
          users.map((user) =>
            user.key === editing.key
              ? { ...editing, ...values, zones: values.zones || [] }
              : user
          )
        );
        message.success("User updated");
      } else {
        setUsers([
          ...users,
          {
            ...values,
            key: Date.now(),
            joined: new Date().toISOString().slice(0, 10),
            zones: values.zones || [],
          },
        ]);
        message.success("User added");
      }
      setModalOpen(false);
    });
  };

  // Add handler for creating group
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newKey = Date.now();
    const company = form.getFieldValue("company");
    setGroups([
      ...groups,
      {
        key: newKey,
        name: newGroupName,
        description: newGroupDesc,
        type: newGroupType,
        company,
        dateRange:
          newGroupType !== "Full Time" &&
          newGroupDateRange[0] &&
          newGroupDateRange[1]
            ? [
                newGroupDateRange[0].toISOString(),
                newGroupDateRange[1].toISOString(),
              ]
            : undefined,
      },
    ]);
    setGroupUsers((prev) => ({ ...prev, [newGroupName]: [] }));
    setNewGroupName("");
    setNewGroupDesc("");
    setNewGroupType("Full Time");
    setNewGroupDateRange([null, null]);
    setGroupModalOpen(false);
  };

  // Add handler for creating zone
  const handleCreateZone = () => {
    if (!newZoneName.trim()) return;
    const newKey = Date.now();
    setZoneGroupsState([
      ...zoneGroupsState,
      {
        key: newKey,
        name: newZoneName,
        description: newZoneDesc,
        assignedGroups: newZoneAssignedGroups,
        assignedUsers: newZoneAssignedUsers,
      },
    ]);
    setGroupUsers((prev) => ({ ...prev, [newZoneName]: [] }));
    setNewZoneName("");
    setNewZoneDesc("");
    setNewZoneAssignedGroups([]);
    setNewZoneAssignedUsers([]);
    setZoneModalOpen(false);
  };

  // Handler to open modal
  const openManageModal = (type: "group" | "zone", name: string) => {
    setManageTarget({ type, name });
    setManageModalOpen(true);
    setManageSelectedKeys([]);
  };
  // Handler to confirm selection
  const handleManageConfirm = () => {
    if (!manageTarget) return;
    if (manageTarget.type === "group") {
      setGroupUsers((prev) => ({
        ...prev,
        [manageTarget.name]: [
          ...prev[manageTarget.name],
          ...users.filter((u) => manageSelectedKeys.includes(u.key)),
        ],
      }));
    } else if (manageTarget.type === "zone") {
      setZoneGroupsState((prev) =>
        prev.map((z) =>
          z.name === manageTarget.name
            ? {
                ...z,
                assignedUsers: Array.from(
                  new Set([
                    ...(z.assignedUsers || []),
                    ...(manageSelectedKeys as number[]),
                  ])
                ),
              }
            : z
        )
      );
    }
    setManageModalOpen(false);
    setManageTarget(null);
    setManageSelectedKeys([]);
  };

  // Handler to open group assignment modal for a zone
  const openManageGroupModal = (zoneName: string) => {
    setManageGroupTarget(zoneName);
    setManageGroupModalOpen(true);
    setManageGroupSelectedKeys([]);
  };
  // Handler to confirm group assignment to zone
  const handleManageGroupConfirm = () => {
    if (!manageGroupTarget) return;
    setZoneGroupsState((prev) =>
      prev.map((z) =>
        z.name === manageGroupTarget
          ? {
              ...z,
              assignedGroups: Array.from(
                new Set([
                  ...(z.assignedGroups || []),
                  ...(manageGroupSelectedKeys as number[]),
                ])
              ),
            }
          : z
      )
    );
    setManageGroupModalOpen(false);
    setManageGroupTarget(null);
    setManageGroupSelectedKeys([]);
  };

  // Handler for move user
  const handleMoveUser = (
    user: User,
    from: string,
    type: "group" | "zone",
    to: string
  ) => {
    if (type === "group") {
      setUsers((prev) =>
        prev.map((u) =>
          u.key === user.key
            ? { ...u, groups: [...u.groups.filter((g) => g !== from), to] }
            : u
        )
      );
      message.success(`Moved ${user.name} to group ${to}`);
    } else {
      setUsers((prev) =>
        prev.map((u) =>
          u.key === user.key
            ? {
                ...u,
                zones: [...(u.zones || []).filter((z) => z !== from), to],
              }
            : u
        )
      );
      message.success(`Moved ${user.name} to zone ${to}`);
    }
    setMoveUserModal(null);
  };
  // Handler for remove user
  const handleRemoveUser = () => {
    if (!removeUserModal) return;
    const { user, from, type } = removeUserModal;
    if (type === "group") {
      setUsers((prev) =>
        prev.map((u) =>
          u.key === user.key
            ? { ...u, groups: u.groups.filter((g) => g !== from) }
            : u
        )
      );
      message.success(`Removed ${user.name} from group ${from}`);
    } else {
      setUsers((prev) =>
        prev.map((u) =>
          u.key === user.key
            ? { ...u, zones: (u.zones || []).filter((z) => z !== from) }
            : u
        )
      );
      message.success(`Removed ${user.name} from zone ${from}`);
    }
    setRemoveUserModal(null);
  };

  // Search & filter
  let filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(search.toLowerCase())) ||
      (u.position && u.position.toLowerCase().includes(search.toLowerCase()))
  );
  if (activeFilter !== undefined) {
    filteredUsers = filteredUsers.filter((u) =>
      activeFilter === "Active" ? u.status === "Active" : u.status !== "Active"
    );
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) =>
      setSelectedRowKeys(newSelectedRowKeys),
  };

  // Stats
  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const inactive = users.filter((u) => u.status !== "Active").length;
  const today = new Date().toISOString().slice(0, 10);
  const joinedToday = users.filter((u) => u.joined === today).length;

  // Drag and drop handler
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const userKey = Number(draggableId);
    const user = users.find((u) => u.key === userKey);
    if (!user) return;
    const sourceGroup = source.droppableId;
    const destGroup = destination.droppableId;
    if (sourceGroup === destGroup) return;

    // If both source and dest are groups (in groupUsers)
    if (groupUsers[sourceGroup] && groupUsers[destGroup]) {
      const newSourceUsers = groupUsers[sourceGroup].filter(
        (u: User) => u.key !== userKey
      );
      const newDestUsers = groupUsers[destGroup].some(
        (u: User) => u.key === userKey
      )
        ? groupUsers[destGroup]
        : [...groupUsers[destGroup], user];
      setGroupUsers({
        ...groupUsers,
        [sourceGroup]: newSourceUsers,
        [destGroup]: newDestUsers,
      });
      setUsers((prev) =>
        prev.map((u: User) =>
          u.key === userKey
            ? {
                ...u,
                groups: Array.from(
                  new Set([
                    ...u.groups.filter((g: string) => g !== sourceGroup),
                    destGroup,
                  ])
                ),
              }
            : u
        )
      );
      return;
    }

    // If both source and dest are zones (not in groupUsers)
    const isSourceZone = !groupUsers[sourceGroup];
    const isDestZone = !groupUsers[destGroup];
    if (isSourceZone && isDestZone) {
      setUsers((prev) =>
        prev.map((u: User) =>
          u.key === userKey
            ? {
                ...u,
                zones: Array.from(
                  new Set([
                    ...(u.zones || []).filter((z: string) => z !== sourceGroup),
                    destGroup,
                  ])
                ),
              }
            : u
        )
      );
      return;
    }

    // If moving from group to zone
    if (groupUsers[sourceGroup] && isDestZone) {
      const newSourceUsers = groupUsers[sourceGroup].filter(
        (u: User) => u.key !== userKey
      );
      setGroupUsers({
        ...groupUsers,
        [sourceGroup]: newSourceUsers,
      });
      setUsers((prev) =>
        prev.map((u: User) =>
          u.key === userKey
            ? {
                ...u,
                groups: u.groups.filter((g: string) => g !== sourceGroup),
                zones: Array.from(new Set([...(u.zones || []), destGroup])),
              }
            : u
        )
      );
      return;
    }

    // If moving from zone to group
    if (isSourceZone && groupUsers[destGroup]) {
      setUsers((prev) =>
        prev.map((u: User) =>
          u.key === userKey
            ? {
                ...u,
                zones: (u.zones || []).filter((z: string) => z !== sourceGroup),
                groups: Array.from(new Set([...u.groups, destGroup])),
              }
            : u
        )
      );
      const newDestUsers = groupUsers[destGroup].some(
        (u: User) => u.key === userKey
      )
        ? groupUsers[destGroup]
        : [...groupUsers[destGroup], user];
      setGroupUsers({
        ...groupUsers,
        [destGroup]: newDestUsers,
      });
      return;
    }
  };

  // เพิ่ม handler สำหรับ lock/unlock group
  const toggleGroupLock = (groupKey: number) => {
    setGroups((prev) =>
      prev.map((g) => (g.key === groupKey ? { ...g, locked: !g.locked } : g))
    );
  };
  // เพิ่ม handler สำหรับ lock/unlock zone
  const toggleZoneLock = (zoneKey: number) => {
    setZoneGroupsState((prev) =>
      prev.map((z) => (z.key === zoneKey ? { ...z, locked: !z.locked } : z))
    );
  };

  const [showGroupManagement, setShowGroupManagement] = useState(true);
  const [showZoneManagement, setShowZoneManagement] = useState(true);

  return (
    <AdminLayout>
      <div style={{ padding: "0 32px", paddingTop: 48, paddingBottom: 48 }}>
        <Card
          title="Users"
          extra={
            <>
              <Button
                icon={<ReloadOutlined />}
                size="small"
                style={{ marginRight: 8 }}
              >
                Sync
              </Button>
              <Button type="primary" onClick={handleAdd}>
                Add User
              </Button>
            </>
          }
        >
          {loading ? (
            <LoadingSpinner tip="กำลังโหลดข้อมูล..." size="large" />
          ) : (
            <>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={4}>
                  <Card>
                    <Statistic title="Total Users" value={total} />
                  </Card>
                </Col>
                <Col span={4}>
                  <Card>
                    <Statistic title="Active" value={active} />
                  </Card>
                </Col>
                <Col span={4}>
                  <Card>
                    <Statistic title="Inactive" value={inactive} />
                  </Card>
                </Col>
                <Col span={4}>
                  <Card>
                    <Statistic title="Joined Today" value={joinedToday} />
                  </Card>
                </Col>
                <Col span={4}>
                  <Card>
                    <Statistic
                      title={
                        <span>
                          Group Total{" "}
                          <Tooltip
                            title={
                              <div style={{ minWidth: 120 }}>
                                {groups.map((g) => (
                                  <div key={g.name}>
                                    {g.name}{" "}
                                    {
                                      users.filter((u) =>
                                        u.groups.includes(g.name)
                                      ).length
                                    }
                                  </div>
                                ))}
                              </div>
                            }
                          >
                            <InfoCircleOutlined
                              style={{ marginLeft: 4, color: "#1890ff" }}
                            />
                          </Tooltip>
                        </span>
                      }
                      value={groups.length}
                    />
                  </Card>
                </Col>
                <Col span={4}>
                  <Card>
                    <Statistic
                      title={
                        <span>
                          Zone Total{" "}
                          <Tooltip
                            title={
                              <div style={{ minWidth: 120 }}>
                                {zoneGroupsState.map((z) => (
                                  <div key={z.name}>
                                    {z.name}{" "}
                                    {
                                      users.filter((u) =>
                                        (u.zones || []).includes(z.name)
                                      ).length
                                    }
                                  </div>
                                ))}
                              </div>
                            }
                          >
                            <InfoCircleOutlined
                              style={{ marginLeft: 4, color: "#1890ff" }}
                            />
                          </Tooltip>
                        </span>
                      }
                      value={zoneGroupsState.length}
                    />
                  </Card>
                </Col>
              </Row>
              <Input.Search
                placeholder="Search name, email, company, position"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: 320, marginBottom: 16 }}
                allowClear
              />
              <Select
                allowClear
                placeholder="Status"
                value={activeFilter}
                onChange={setActiveFilter}
                style={{ width: 120, marginLeft: 8, marginBottom: 16 }}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
              <div style={{ marginBottom: 8 }}>
                {selectedRowKeys.length > 0 && (
                  <span>Selected {selectedRowKeys.length} user(s)</span>
                )}
              </div>
              <Table
                rowSelection={rowSelection}
                dataSource={filteredUsers}
                columns={[
                  {
                    title: "Name",
                    dataIndex: "name",
                    sorter: (a, b) => a.name.localeCompare(b.name),
                  },
                  {
                    title: "Email",
                    dataIndex: "email",
                    sorter: (a, b) => a.email.localeCompare(b.email),
                  },
                  {
                    title: "Groups",
                    dataIndex: "groups",
                    render: (groups: string[]) =>
                      groups && groups.length > 0 ? groups.join(", ") : "-",
                    sorter: (a, b) =>
                      (a.groups?.[0] || "").localeCompare(b.groups?.[0] || ""),
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    render: (status: string) => (
                      <Tag
                        color={
                          status === "Active"
                            ? "green"
                            : status === "Pending"
                            ? "orange"
                            : "red"
                        }
                      >
                        {status}
                      </Tag>
                    ),
                    sorter: (a, b) => a.status.localeCompare(b.status),
                  },
                  {
                    title: "Avatar",
                    dataIndex: "avatar",
                    render: (avatar: string) => (
                      <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                        {avatar}
                      </span>
                    ),
                  },
                  {
                    title: "Company",
                    dataIndex: "company",
                    sorter: (a, b) =>
                      (a.company || "").localeCompare(b.company || ""),
                  },
                  {
                    title: "Position",
                    dataIndex: "position",
                    sorter: (a, b) =>
                      (a.position || "").localeCompare(b.position || ""),
                  },
                  {
                    title: "Zones",
                    dataIndex: "zones",
                    render: (zones: string[]) =>
                      zones && zones.length > 0 ? zones.join(", ") : "-",
                    sorter: (a, b) =>
                      (a.zones?.[0] || "").localeCompare(b.zones?.[0] || ""),
                  },
                  {
                    title: "Access Rules",
                    dataIndex: "accessRules",
                    render: (_: unknown, user: User) => {
                      const rules = accessRules.filter((r) =>
                        r.userKeys.includes(user.key)
                      );
                      return rules.length > 0
                        ? rules.map((r) => r.name).join(", ")
                        : "-";
                    },
                  },
                  {
                    title: "Shift",
                    dataIndex: "shift",
                    render: (_: unknown, user: User) => {
                      const shift = shifts.find((s) =>
                        s.userKeys.includes(user.key)
                      );
                      return shift
                        ? `${shift.name} (${shift.startTime}-${shift.endTime})`
                        : "-";
                    },
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
                scroll={{ x: "max-content" }}
                pagination={{ pageSize: 5, showSizeChanger: true }}
              />
            </>
          )}
        </Card>
        {/* Group Management Section */}
        <Typography.Title
          level={4}
          style={{
            marginTop: 32,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          Group Management
          <span
            style={{ marginLeft: 8, cursor: "pointer" }}
            onClick={() => setShowGroupManagement((v) => !v)}
          >
            {showGroupManagement ? <UpOutlined /> : <DownOutlined />}
          </span>
        </Typography.Title>
        {showGroupManagement && (
          <Card
            bordered
            hoverable
            style={{
              marginTop: 0,
              background: "#fafcff",
              border: "1.5px solid #e6f7ff",
              boxShadow: "0 2px 8px #e6f7ff55",
              borderRadius: 12,
            }}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {groups.map((group) => {
                  // Search and sort logic for users in this group
                  let usersInGroup = groupUsers[group.name] || [];
                  const searchVal = groupSearch[group.name] || "";
                  if (searchVal) {
                    usersInGroup = usersInGroup.filter(
                      (u) =>
                        u.name
                          .toLowerCase()
                          .includes(searchVal.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchVal.toLowerCase())
                    );
                  }
                  const sortVal = groupSort[group.name] || "name";
                  usersInGroup = [...usersInGroup].sort((a, b) => {
                    if (sortVal === "name") return a.name.localeCompare(b.name);
                    if (sortVal === "status")
                      return a.status.localeCompare(b.status);
                    return 0;
                  });
                  const userCount = usersInGroup.length;

                  // ในแต่ละ group card:
                  let usersToShow = usersInGroup;
                  let showListView = false;
                  if (usersInGroup.length > 10) {
                    usersToShow = usersInGroup.slice(0, 10);
                    showListView = true;
                  }
                  return (
                    <Droppable droppableId={group.name} key={group.key}>
                      {(
                        provided: DroppableProvided,
                        snapshot: DroppableStateSnapshot
                      ) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            ...glassCardStyle,
                            background: snapshot.isDraggingOver
                              ? "rgba(255,255,255,0.35)"
                              : glassCardStyle.background,
                            boxShadow: snapshot.isDraggingOver
                              ? "0 12px 32px 0 rgba(31,38,135,0.18)"
                              : glassCardStyle.boxShadow,
                            border: glassCardStyle.border,
                            borderRadius: glassCardStyle.borderRadius,
                            minWidth: glassCardStyle.minWidth,
                            minHeight: glassCardStyle.minHeight,
                            marginBottom: glassCardStyle.marginBottom,
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            padding: 20,
                            transition: glassCardStyle.transition,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 8,
                            }}
                          >
                            <h4 style={{ margin: 0, flex: 1 }}>{group.name}</h4>
                            <span
                              style={{
                                background: "#f0f0f0",
                                borderRadius: 12,
                                padding: "2px 10px",
                                fontSize: 13,
                                fontWeight: 500,
                                marginLeft: 8,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {userCount}
                              {usersInGroup.length > 10 && (
                                <Tooltip title="View All">
                                  <Button
                                    size="small"
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={() => {
                                      setViewAllTarget({
                                        type: "group",
                                        name: group.name,
                                      });
                                      setViewAllModalOpen(true);
                                    }}
                                    style={{ marginLeft: 4 }}
                                  />
                                </Tooltip>
                              )}
                            </span>
                            <Tooltip title={group.locked ? "Unlock" : "Lock"}>
                              <Button
                                size="small"
                                type="text"
                                icon={
                                  group.locked ? (
                                    <LockOutlined />
                                  ) : (
                                    <UnlockOutlined />
                                  )
                                }
                                onClick={() => toggleGroupLock(group.key)}
                                style={{ marginLeft: 8 }}
                              />
                            </Tooltip>
                            <Tooltip title="Add Users">
                              <Button
                                size="small"
                                type="text"
                                icon={
                                  <UserAddOutlined
                                    style={{ color: "#1890ff", fontSize: 18 }}
                                  />
                                }
                                onClick={() =>
                                  openManageModal("group", group.name)
                                }
                                style={{ marginLeft: 8 }}
                                disabled={group.locked}
                              />
                            </Tooltip>
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#888",
                              marginBottom: 4,
                            }}
                          >
                            Type: {group.type}
                            {group.type !== "Full Time" && group.dateRange && (
                              <>
                                <br />
                                Period:{" "}
                                {dayjs(group.dateRange[0]).format(
                                  "YYYY-MM-DD HH:mm"
                                )}{" "}
                                -{" "}
                                {dayjs(group.dateRange[1]).format(
                                  "YYYY-MM-DD HH:mm"
                                )}
                              </>
                            )}
                          </div>
                          <div
                            style={{ display: "flex", gap: 8, marginBottom: 8 }}
                          >
                            <Input
                              size="small"
                              placeholder="Search user"
                              value={groupSearch[group.name] || ""}
                              onChange={(e) =>
                                setGroupSearch((s) => ({
                                  ...s,
                                  [group.name]: e.target.value,
                                }))
                              }
                              style={{ flex: 1 }}
                            />
                            <Select
                              size="small"
                              value={groupSort[group.name] || "name"}
                              onChange={(val) =>
                                setGroupSort((s) => ({
                                  ...s,
                                  [group.name]: val,
                                }))
                              }
                              style={{ width: 90 }}
                            >
                              <Option value="name">Name</Option>
                              <Option value="status">Status</Option>
                            </Select>
                          </div>
                          <div style={{ minHeight: 40, flex: 1 }}>
                            {showListView ? (
                              <div
                                style={{
                                  maxHeight: 320,
                                  overflowY: "auto",
                                  borderRadius: 8,
                                  border: "1px solid #f0f0f0",
                                  background: "#fff",
                                  marginBottom: 8,
                                }}
                              >
                                {usersToShow.map((user, idx) => (
                                  <Draggable
                                    draggableId={user.key.toString()}
                                    index={idx}
                                    key={user.key}
                                    isDragDisabled={!!group.locked}
                                  >
                                    {(
                                      provided: DraggableProvided,
                                      snapshot: DraggableStateSnapshot
                                    ) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: "none",
                                          margin: "0 0 8px 0",
                                          padding: 8,
                                          background: snapshot.isDragging
                                            ? "#bae7ff"
                                            : "#fff",
                                          border: "1px solid #d9d9d9",
                                          borderRadius: 4,
                                          display: "flex",
                                          alignItems: "center",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            background: "#1890ff22",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 600,
                                            marginRight: 8,
                                          }}
                                        >
                                          {user.avatar}
                                        </span>
                                        <span>{user.name}</span>
                                        <Tag
                                          color={
                                            user.status === "Active"
                                              ? "green"
                                              : user.status === "Pending"
                                              ? "orange"
                                              : "red"
                                          }
                                          style={{ marginLeft: "auto" }}
                                        >
                                          {user.status}
                                        </Tag>
                                        <Dropdown
                                          overlay={
                                            <Menu>
                                              <Menu.Item
                                                key="move"
                                                onClick={() =>
                                                  setMoveUserModal({
                                                    user,
                                                    from: group.name,
                                                    type: "group",
                                                  })
                                                }
                                              >
                                                Move to...
                                              </Menu.Item>
                                              <Menu.Item
                                                key="remove"
                                                onClick={() =>
                                                  setRemoveUserModal({
                                                    user,
                                                    from: group.name,
                                                    type: "group",
                                                  })
                                                }
                                              >
                                                Remove from this group
                                              </Menu.Item>
                                            </Menu>
                                          }
                                          trigger={["click"]}
                                        >
                                          <Button
                                            type="text"
                                            icon={<MoreOutlined />}
                                            style={{ marginLeft: 8 }}
                                          />
                                        </Dropdown>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </div>
                            ) : (
                              usersToShow.map((user, idx) => (
                                <Draggable
                                  draggableId={user.key.toString()}
                                  index={idx}
                                  key={user.key}
                                  isDragDisabled={!!group.locked}
                                >
                                  {(
                                    provided: DraggableProvided,
                                    snapshot: DraggableStateSnapshot
                                  ) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        margin: "0 0 8px 0",
                                        padding: 8,
                                        background: snapshot.isDragging
                                          ? "#bae7ff"
                                          : "#fff",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: 4,
                                        display: "flex",
                                        alignItems: "center",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: 32,
                                          height: 32,
                                          borderRadius: "50%",
                                          background: "#1890ff22",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontWeight: 600,
                                          marginRight: 8,
                                        }}
                                      >
                                        {user.avatar}
                                      </span>
                                      <span>{user.name}</span>
                                      <Tag
                                        color={
                                          user.status === "Active"
                                            ? "green"
                                            : user.status === "Pending"
                                            ? "orange"
                                            : "red"
                                        }
                                        style={{ marginLeft: "auto" }}
                                      >
                                        {user.status}
                                      </Tag>
                                      <Dropdown
                                        overlay={
                                          <Menu>
                                            <Menu.Item
                                              key="move"
                                              onClick={() =>
                                                setMoveUserModal({
                                                  user,
                                                  from: group.name,
                                                  type: "group",
                                                })
                                              }
                                            >
                                              Move to...
                                            </Menu.Item>
                                            <Menu.Item
                                              key="remove"
                                              onClick={() =>
                                                setRemoveUserModal({
                                                  user,
                                                  from: group.name,
                                                  type: "group",
                                                })
                                              }
                                            >
                                              Remove from this group
                                            </Menu.Item>
                                          </Menu>
                                        }
                                        trigger={["click"]}
                                      >
                                        <Button
                                          type="text"
                                          icon={<MoreOutlined />}
                                          style={{ marginLeft: 8 }}
                                        />
                                      </Dropdown>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            )}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
                {/* Create Group Card */}
                <div
                  onClick={() => setGroupModalOpen(true)}
                  style={{
                    minWidth: 240,
                    minHeight: 220,
                    border: "2px dashed #d9d9d9",
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#999",
                  }}
                >
                  <PlusOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                  <div style={{ fontWeight: 500 }}>Create Group</div>
                </div>
              </div>
            </DragDropContext>
            <Modal
              title="Create Group"
              open={groupModalOpen}
              onOk={handleCreateGroup}
              onCancel={() => setGroupModalOpen(false)}
              okText="Create"
            >
              <Form layout="vertical">
                <Form.Item label="Group Name" required>
                  <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Description">
                  <Input
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Company"
                  name="company"
                  rules={[
                    { required: true, message: "Please select a company" },
                  ]}
                >
                  <Select placeholder="Select company">
                    {companyOptions.map((c: string) => (
                      <Option key={c} value={c}>
                        {c}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Type" required>
                  <Select value={newGroupType} onChange={setNewGroupType}>
                    <Option value="Full Time">Full Time</Option>
                    <Option value="Part Time">Part Time</Option>
                    <Option value="Visitor">Visitor</Option>
                    <Option value="Contractor">Contractor</Option>
                  </Select>
                </Form.Item>
                {newGroupType !== "Full Time" && (
                  <Form.Item label="Assign Date/Time Range" required>
                    <DatePicker.RangePicker
                      showTime
                      value={newGroupDateRange}
                      onChange={(val) =>
                        setNewGroupDateRange(val as [Dayjs, Dayjs])
                      }
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                )}
              </Form>
            </Modal>
          </Card>
        )}
        {/* Zone Management Section */}
        <Typography.Title
          level={4}
          style={{
            marginTop: 32,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          Zone Management
          <span
            style={{ marginLeft: 8, cursor: "pointer" }}
            onClick={() => setShowZoneManagement((v) => !v)}
          >
            {showZoneManagement ? <UpOutlined /> : <DownOutlined />}
          </span>
        </Typography.Title>
        {showZoneManagement && (
          <Card
            bordered
            hoverable
            style={{
              marginTop: 0,
              background: "#fafcff",
              border: "1.5px solid #e6f7ff",
              boxShadow: "0 2px 8px #e6f7ff55",
              borderRadius: 12,
            }}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {zoneGroupsState.map((zone) => {
                  // Get all users who have this zone in their zones array
                  const usersByZoneField = users
                    .filter((u) => u.zones && u.zones.includes(zone.name))
                    .map((u) => u.key);
                  // Get users from assignedGroups and assignedUsers as before
                  const groupUserKeys = zone.assignedGroups
                    ? zone.assignedGroups.flatMap((gk) =>
                        users
                          .filter(
                            (u) =>
                              u.groups &&
                              u.groups.some(
                                (gName) =>
                                  groups.find((g) => g.key === gk)?.name ===
                                  gName
                              )
                          )
                          .map((u) => u.key)
                      )
                    : [];
                  const assignedUserKeys = zone.assignedUsers || [];
                  // Combine all sources and deduplicate
                  let allUserKeys = Array.from(
                    new Set([
                      ...usersByZoneField,
                      ...assignedUserKeys,
                      ...groupUserKeys,
                    ])
                  );
                  // Apply search
                  const searchVal = groupSearch[zone.name] || "";
                  if (searchVal) {
                    allUserKeys = allUserKeys.filter((uk) => {
                      const u = users.find((u) => u.key === uk);
                      return (
                        u &&
                        (u.name
                          .toLowerCase()
                          .includes(searchVal.toLowerCase()) ||
                          u.email
                            .toLowerCase()
                            .includes(searchVal.toLowerCase()))
                      );
                    });
                  }
                  // Apply sort
                  const sortVal = groupSort[zone.name] || "name";
                  allUserKeys = [...allUserKeys].sort((a, b) => {
                    const ua = users.find((u) => u.key === a);
                    const ub = users.find((u) => u.key === b);
                    if (!ua || !ub) return 0;
                    if (sortVal === "name")
                      return ua.name.localeCompare(ub.name);
                    if (sortVal === "status")
                      return ua.status.localeCompare(ub.status);
                    return 0;
                  });
                  const userCount = allUserKeys.length;

                  // เช่นเดียวกันใน zone card:
                  let usersToShowZone = allUserKeys;
                  let showListViewZone = false;
                  if (allUserKeys.length > 10) {
                    usersToShowZone = allUserKeys.slice(0, 10);
                    showListViewZone = true;
                  }
                  return (
                    <Droppable droppableId={zone.name} key={zone.key}>
                      {(
                        provided: DroppableProvided,
                        snapshot: DroppableStateSnapshot
                      ) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            ...glassCardStyle,
                            background: snapshot.isDraggingOver
                              ? "rgba(255,255,255,0.35)"
                              : glassCardStyle.background,
                            boxShadow: snapshot.isDraggingOver
                              ? "0 12px 32px 0 rgba(31,38,135,0.18)"
                              : glassCardStyle.boxShadow,
                            border: glassCardStyle.border,
                            borderRadius: glassCardStyle.borderRadius,
                            minWidth: glassCardStyle.minWidth,
                            minHeight: glassCardStyle.minHeight,
                            marginBottom: glassCardStyle.marginBottom,
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            padding: 20,
                            transition: glassCardStyle.transition,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 8,
                            }}
                          >
                            <h4 style={{ margin: 0, flex: 1 }}>{zone.name}</h4>
                            <span
                              style={{
                                background: "#f0f0f0",
                                borderRadius: 12,
                                padding: "2px 10px",
                                fontSize: 13,
                                fontWeight: 500,
                                marginLeft: 8,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {userCount}
                              {allUserKeys.length > 10 && (
                                <Tooltip title="View All">
                                  <Button
                                    size="small"
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={() => {
                                      setViewAllTarget({
                                        type: "zone",
                                        name: zone.name,
                                      });
                                      setViewAllModalOpen(true);
                                    }}
                                    style={{ marginLeft: 4 }}
                                  />
                                </Tooltip>
                              )}
                            </span>
                            <Tooltip title={zone.locked ? "Unlock" : "Lock"}>
                              <Button
                                size="small"
                                type="text"
                                icon={
                                  zone.locked ? (
                                    <LockOutlined />
                                  ) : (
                                    <UnlockOutlined />
                                  )
                                }
                                onClick={() => toggleZoneLock(zone.key)}
                                style={{ marginLeft: 8 }}
                              />
                            </Tooltip>
                            <Tooltip title="Add Users">
                              <Button
                                size="small"
                                type="text"
                                icon={
                                  <UserAddOutlined
                                    style={{ color: "#1890ff", fontSize: 18 }}
                                  />
                                }
                                onClick={() =>
                                  openManageModal("zone", zone.name)
                                }
                                style={{ marginLeft: 8 }}
                                disabled={zone.locked}
                              />
                            </Tooltip>
                            <Tooltip title="Add Groups">
                              <Button
                                size="small"
                                type="text"
                                icon={
                                  <TeamOutlined
                                    style={{ color: "#52c41a", fontSize: 18 }}
                                  />
                                }
                                onClick={() => openManageGroupModal(zone.name)}
                                style={{ marginLeft: 8 }}
                                disabled={zone.locked}
                              />
                            </Tooltip>
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#888",
                              marginBottom: 4,
                            }}
                          >
                            {zone.assignedGroups &&
                              zone.assignedGroups.length > 0 && (
                                <>
                                  Groups:{" "}
                                  {zone.assignedGroups
                                    .map(
                                      (gk) =>
                                        groups.find((g) => g.key === gk)?.name
                                    )
                                    .filter(Boolean)
                                    .join(", ")}
                                  <br />
                                </>
                              )}
                          </div>
                          <div
                            style={{ display: "flex", gap: 8, marginBottom: 8 }}
                          >
                            <Input
                              size="small"
                              placeholder="Search user"
                              value={groupSearch[zone.name] || ""}
                              onChange={(e) =>
                                setGroupSearch((s) => ({
                                  ...s,
                                  [zone.name]: e.target.value,
                                }))
                              }
                              style={{ flex: 1 }}
                            />
                            <Select
                              size="small"
                              value={groupSort[zone.name] || "name"}
                              onChange={(val) =>
                                setGroupSort((s) => ({
                                  ...s,
                                  [zone.name]: val,
                                }))
                              }
                              style={{ width: 90 }}
                            >
                              <Option value="name">Name</Option>
                              <Option value="status">Status</Option>
                            </Select>
                          </div>
                          <div style={{ minHeight: 40, flex: 1 }}>
                            {showListViewZone ? (
                              <div
                                style={{
                                  maxHeight: 320,
                                  overflowY: "auto",
                                  borderRadius: 8,
                                  border: "1px solid #f0f0f0",
                                  background: "#fff",
                                  marginBottom: 8,
                                }}
                              >
                                {usersToShowZone.map((uk, idx) => {
                                  const user = users.find((u) => u.key === uk);
                                  if (!user) return null;
                                  // Determine access period and validity
                                  let accessPeriod = null;
                                  let isValid = true;
                                  if (
                                    user.groups &&
                                    user.groups.some((g) => {
                                      const group = groups.find(
                                        (gr) => gr.name === g
                                      );
                                      return (
                                        group &&
                                        group.type !== "Full Time" &&
                                        group.dateRange
                                      );
                                    })
                                  ) {
                                    const group = groups.find(
                                      (gr) =>
                                        user.groups.includes(gr.name) &&
                                        gr.type !== "Full Time" &&
                                        gr.dateRange
                                    );
                                    if (group && group.dateRange) {
                                      accessPeriod = group.dateRange;
                                      const now = new Date();
                                      const start = new Date(
                                        group.dateRange[0]
                                      );
                                      const end = new Date(group.dateRange[1]);
                                      isValid = now >= start && now <= end;
                                    }
                                  }
                                  return (
                                    <Draggable
                                      draggableId={user.key.toString()}
                                      index={idx}
                                      key={user.key}
                                      isDragDisabled={!!zone.locked}
                                    >
                                      {(
                                        provided: DraggableProvided,
                                        snapshot: DraggableStateSnapshot
                                      ) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            userSelect: "none",
                                            margin: "0 0 8px 0",
                                            padding: 8,
                                            background: snapshot.isDragging
                                              ? "#bae7ff"
                                              : isValid
                                              ? "#fff"
                                              : "#fff1f0",
                                            border: isValid
                                              ? "1px solid #d9d9d9"
                                              : "1.5px solid #ff4d4f",
                                            borderRadius: 4,
                                            display: "flex",
                                            alignItems: "center",
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: 32,
                                              height: 32,
                                              borderRadius: "50%",
                                              background: "#1890ff22",
                                              display: "inline-flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              fontWeight: 600,
                                              marginRight: 8,
                                            }}
                                          >
                                            {user.avatar}
                                          </span>
                                          <span>{user.name}</span>
                                          <Tag
                                            color={
                                              user.status === "Active"
                                                ? "green"
                                                : user.status === "Pending"
                                                ? "orange"
                                                : "red"
                                            }
                                            style={{ marginLeft: "auto" }}
                                          >
                                            {user.status}
                                          </Tag>
                                          {accessPeriod && (
                                            <Tooltip
                                              title={`Access: ${new Date(
                                                accessPeriod[0]
                                              ).toLocaleString()} - ${new Date(
                                                accessPeriod[1]
                                              ).toLocaleString()}`}
                                            >
                                              <Tag
                                                color={
                                                  isValid ? "green" : "red"
                                                }
                                                style={{ marginLeft: 8 }}
                                              >
                                                {isValid ? "Valid" : "Expired"}
                                              </Tag>
                                            </Tooltip>
                                          )}
                                          <Dropdown
                                            overlay={
                                              <Menu>
                                                <Menu.Item
                                                  key="move"
                                                  onClick={() =>
                                                    setMoveUserModal({
                                                      user,
                                                      from: zone.name,
                                                      type: "zone",
                                                    })
                                                  }
                                                >
                                                  Move to...
                                                </Menu.Item>
                                                <Menu.Item
                                                  key="remove"
                                                  onClick={() =>
                                                    setRemoveUserModal({
                                                      user,
                                                      from: zone.name,
                                                      type: "zone",
                                                    })
                                                  }
                                                >
                                                  Remove from this zone
                                                </Menu.Item>
                                              </Menu>
                                            }
                                            trigger={["click"]}
                                          >
                                            <Button
                                              type="text"
                                              icon={<MoreOutlined />}
                                              style={{ marginLeft: 8 }}
                                            />
                                          </Dropdown>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                              </div>
                            ) : (
                              usersToShowZone.map((uk, idx) => {
                                const user = users.find((u) => u.key === uk);
                                if (!user) return null;
                                // Determine access period and validity
                                let accessPeriod = null;
                                let isValid = true;
                                if (
                                  user.groups &&
                                  user.groups.some((g) => {
                                    const group = groups.find(
                                      (gr) => gr.name === g
                                    );
                                    return (
                                      group &&
                                      group.type !== "Full Time" &&
                                      group.dateRange
                                    );
                                  })
                                ) {
                                  const group = groups.find(
                                    (gr) =>
                                      user.groups.includes(gr.name) &&
                                      gr.type !== "Full Time" &&
                                      gr.dateRange
                                  );
                                  if (group && group.dateRange) {
                                    accessPeriod = group.dateRange;
                                    const now = new Date();
                                    const start = new Date(group.dateRange[0]);
                                    const end = new Date(group.dateRange[1]);
                                    isValid = now >= start && now <= end;
                                  }
                                }
                                return (
                                  <Draggable
                                    draggableId={user.key.toString()}
                                    index={idx}
                                    key={user.key}
                                    isDragDisabled={!!zone.locked}
                                  >
                                    {(
                                      provided: DraggableProvided,
                                      snapshot: DraggableStateSnapshot
                                    ) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: "none",
                                          margin: "0 0 8px 0",
                                          padding: 8,
                                          background: snapshot.isDragging
                                            ? "#bae7ff"
                                            : isValid
                                            ? "#fff"
                                            : "#fff1f0",
                                          border: isValid
                                            ? "1px solid #d9d9d9"
                                            : "1.5px solid #ff4d4f",
                                          borderRadius: 4,
                                          display: "flex",
                                          alignItems: "center",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            background: "#1890ff22",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 600,
                                            marginRight: 8,
                                          }}
                                        >
                                          {user.avatar}
                                        </span>
                                        <span>{user.name}</span>
                                        <Tag
                                          color={
                                            user.status === "Active"
                                              ? "green"
                                              : user.status === "Pending"
                                              ? "orange"
                                              : "red"
                                          }
                                          style={{ marginLeft: "auto" }}
                                        >
                                          {user.status}
                                        </Tag>
                                        {accessPeriod && (
                                          <Tooltip
                                            title={`Access: ${new Date(
                                              accessPeriod[0]
                                            ).toLocaleString()} - ${new Date(
                                              accessPeriod[1]
                                            ).toLocaleString()}`}
                                          >
                                            <Tag
                                              color={isValid ? "green" : "red"}
                                              style={{ marginLeft: 8 }}
                                            >
                                              {isValid ? "Valid" : "Expired"}
                                            </Tag>
                                          </Tooltip>
                                        )}
                                        <Dropdown
                                          overlay={
                                            <Menu>
                                              <Menu.Item
                                                key="move"
                                                onClick={() =>
                                                  setMoveUserModal({
                                                    user,
                                                    from: zone.name,
                                                    type: "zone",
                                                  })
                                                }
                                              >
                                                Move to...
                                              </Menu.Item>
                                              <Menu.Item
                                                key="remove"
                                                onClick={() =>
                                                  setRemoveUserModal({
                                                    user,
                                                    from: zone.name,
                                                    type: "zone",
                                                  })
                                                }
                                              >
                                                Remove from this zone
                                              </Menu.Item>
                                            </Menu>
                                          }
                                          trigger={["click"]}
                                        >
                                          <Button
                                            type="text"
                                            icon={<MoreOutlined />}
                                            style={{ marginLeft: 8 }}
                                          />
                                        </Dropdown>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })
                            )}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
                {/* Create Zone Card */}
                <div
                  onClick={() => setZoneModalOpen(true)}
                  style={{
                    minWidth: 240,
                    minHeight: 220,
                    border: "2px dashed #d9d9d9",
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#999",
                  }}
                >
                  <PlusOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                  <div style={{ fontWeight: 500 }}>Create Zone</div>
                </div>
              </div>
            </DragDropContext>
            <Modal
              title="Create Zone"
              open={zoneModalOpen}
              onOk={handleCreateZone}
              onCancel={() => setZoneModalOpen(false)}
              okText="Create"
            >
              <Form layout="vertical">
                <Form.Item label="Zone Name" required>
                  <Input
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Description">
                  <Input
                    value={newZoneDesc}
                    onChange={(e) => setNewZoneDesc(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Assign Groups">
                  <Select
                    mode="multiple"
                    value={newZoneAssignedGroups}
                    onChange={setNewZoneAssignedGroups}
                    style={{ width: "100%" }}
                    placeholder="Select groups"
                  >
                    {groups.map((g) => (
                      <Option key={g.key} value={g.key}>
                        {g.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Assign Users">
                  <Select
                    mode="multiple"
                    value={newZoneAssignedUsers}
                    onChange={setNewZoneAssignedUsers}
                    style={{ width: "100%" }}
                    placeholder="Select users"
                    optionLabelProp="label"
                  >
                    {users.map((u) => (
                      <Option key={u.key} value={u.key} label={u.name}>
                        {u.name} ({u.email})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          </Card>
        )}
        <Modal
          title={editing ? "Edit User" : "Add User"}
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
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              {" "}
              <Input />{" "}
            </Form.Item>
            <Form.Item
              name="groups"
              label="Groups"
              rules={[{ required: true }]}
            >
              <Select mode="multiple">
                <Option value="Admin">Admin</Option>
                <Option value="User">User</Option>
                <Option value="Editor">Editor</Option>
                <Option value="Viewer">Viewer</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
                <Option value="Pending">Pending</Option>
              </Select>
            </Form.Item>
            <Form.Item name="avatar" label="Avatar">
              {" "}
              <Input />{" "}
            </Form.Item>
            <Form.Item name="company" label="Company">
              {" "}
              <Input />{" "}
            </Form.Item>
            <Form.Item name="position" label="Position">
              {" "}
              <Input />{" "}
            </Form.Item>
            <Form.Item name="zones" label="Zones">
              <Select mode="multiple" allowClear>
                {initialZones.map((z) => (
                  <Option key={z.name} value={z.name}>
                    {z.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {editing && (
              <div style={{ marginBottom: 16, fontSize: 13, color: "#888" }}>
                <div>
                  <b>Current Groups:</b>{" "}
                  {editing.groups && editing.groups.length > 0
                    ? editing.groups.join(", ")
                    : "-"}
                </div>
                <div>
                  <b>Current Zones:</b>{" "}
                  {editing.zones && editing.zones.length > 0
                    ? editing.zones.join(", ")
                    : "-"}
                </div>
                <div>
                  <b>Access Rules:</b>{" "}
                  {accessRules
                    .filter((r) => r.userKeys.includes(editing.key))
                    .map((r) => r.name)
                    .join(", ") || "-"}
                </div>
                <div>
                  <b>Shift:</b>{" "}
                  {(() => {
                    const shift = shifts.find((s) =>
                      s.userKeys.includes(editing.key)
                    );
                    return shift
                      ? `${shift.name} (${shift.startTime}-${shift.endTime})`
                      : "-";
                  })()}
                </div>
                {/* Show access period and validity if user is Visitor/Contractor */}
                {(() => {
                  const visitorGroup =
                    editing.groups &&
                    editing.groups
                      .map((g) =>
                        groups.find(
                          (gr) =>
                            gr.name === g &&
                            gr.type !== "Full Time" &&
                            gr.dateRange
                        )
                      )
                      .find(Boolean);
                  if (visitorGroup && visitorGroup.dateRange) {
                    const now = new Date();
                    const start = new Date(visitorGroup.dateRange[0]);
                    const end = new Date(visitorGroup.dateRange[1]);
                    const isValid = now >= start && now <= end;
                    return (
                      <div>
                        <b>Access Period:</b> {start.toLocaleString()} -{" "}
                        {end.toLocaleString()}{" "}
                        <Tag color={isValid ? "green" : "red"}>
                          {isValid ? "Valid" : "Expired"}
                        </Tag>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </Form>
        </Modal>
        {/* User Management Modal */}
        <Modal
          title={manageTarget ? `Manage Users for ${manageTarget.name}` : ""}
          open={manageModalOpen}
          onOk={handleManageConfirm}
          onCancel={() => setManageModalOpen(false)}
          okText="Add Selected"
        >
          <Table
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: manageSelectedKeys,
              onChange: setManageSelectedKeys,
            }}
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Email", dataIndex: "email" },
              { title: "Company", dataIndex: "company" },
              { title: "Position", dataIndex: "position" },
            ]}
            dataSource={(() => {
              if (!manageTarget) return [];
              let alreadyIn: number[] = [];
              if (manageTarget.type === "group") {
                alreadyIn = (groupUsers[manageTarget.name] || []).map(
                  (u) => u.key
                );
              } else if (manageTarget.type === "zone") {
                const zone = zoneGroupsState.find(
                  (z) => z.name === manageTarget.name
                );
                if (zone) {
                  // Users already in zone (direct or via group)
                  const groupUserKeys = zone.assignedGroups
                    ? zone.assignedGroups.flatMap((gk) =>
                        users
                          .filter((u) =>
                            u.groups.some(
                              (gName) =>
                                groups.find((g) => g.key === gk)?.name === gName
                            )
                          )
                          .map((u) => u.key)
                      )
                    : [];
                  alreadyIn = Array.from(
                    new Set([...(zone.assignedUsers || []), ...groupUserKeys])
                  );
                }
              }
              // Only users not already in and with no status
              return users
                .filter((u) => !alreadyIn.includes(u.key) && !u.status)
                .map((u) => ({ ...u, key: u.key }));
            })()}
            pagination={false}
            size="small"
          />
        </Modal>
        {/* Add Group Management modal for assigning groups to zones */}
        <Modal
          title={manageGroupTarget ? `Add Groups to ${manageGroupTarget}` : ""}
          open={manageGroupModalOpen}
          onOk={handleManageGroupConfirm}
          onCancel={() => setManageGroupModalOpen(false)}
          okText="Add Selected"
        >
          <Table
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: manageGroupSelectedKeys,
              onChange: setManageGroupSelectedKeys,
            }}
            columns={[
              { title: "Group", dataIndex: "name" },
              { title: "Company", dataIndex: "company" },
              { title: "Type", dataIndex: "type" },
            ]}
            dataSource={(() => {
              if (!manageGroupTarget) return [];
              const zone = zoneGroupsState.find(
                (z) => z.name === manageGroupTarget
              );
              const alreadyIn = zone ? zone.assignedGroups || [] : [];
              return groups
                .filter((g) => !alreadyIn.includes(g.key))
                .map((g) => ({ ...g, key: g.key }));
            })()}
            pagination={false}
            size="small"
          />
        </Modal>
        {/* Move User Modal */}
        <Modal
          title={`Move ${moveUserModal?.user.name} to another ${
            moveUserModal?.type === "group" ? "group" : "zone"
          }`}
          open={!!moveUserModal}
          onCancel={() => setMoveUserModal(null)}
          footer={null}
        >
          <div style={{ marginBottom: 16 }}>Select destination:</div>
          <Select
            style={{ width: "100%" }}
            onChange={(to) => {
              if (moveUserModal) {
                handleMoveUser(
                  moveUserModal.user,
                  moveUserModal.from,
                  moveUserModal.type,
                  to
                );
              }
            }}
            placeholder={`Select ${
              moveUserModal?.type === "group" ? "group" : "zone"
            }`}
          >
            {(moveUserModal?.type === "group" ? groups : zoneGroupsState)
              .filter((gz) => gz.name !== moveUserModal?.from)
              .map((gz) => (
                <Option key={gz.name} value={gz.name}>
                  {gz.name}
                </Option>
              ))}
          </Select>
        </Modal>
        {/* Remove User Modal */}
        <Modal
          title={`Remove ${removeUserModal?.user.name} from this ${
            removeUserModal?.type === "group" ? "group" : "zone"
          }?`}
          open={!!removeUserModal}
          onOk={handleRemoveUser}
          onCancel={() => setRemoveUserModal(null)}
          okText="Remove"
          okButtonProps={{ danger: true }}
        >
          <div>
            Are you sure you want to remove {removeUserModal?.user.name} from{" "}
            {removeUserModal?.from}?
          </div>
        </Modal>
        {/* View All Users Modal */}
        <Modal
          title={viewAllTarget ? `All Users in ${viewAllTarget.name}` : ""}
          open={viewAllModalOpen}
          onCancel={() => setViewAllModalOpen(false)}
          footer={null}
          width={700}
        >
          <Table
            rowKey="key"
            columns={[
              {
                title: "Avatar",
                dataIndex: "avatar",
                render: (avatar: string) => (
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#1890ff22",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                    }}
                  >
                    {avatar}
                  </span>
                ),
                width: 60,
              },
              {
                title: "Name",
                dataIndex: "name",
                sorter: (a, b) => a.name.localeCompare(b.name),
              },
              {
                title: "Email",
                dataIndex: "email",
                sorter: (a, b) => a.email.localeCompare(b.email),
              },
              {
                title: "Status",
                dataIndex: "status",
                render: (status: string) => (
                  <Tag
                    color={
                      status === "Active"
                        ? "green"
                        : status === "Pending"
                        ? "orange"
                        : "red"
                    }
                  >
                    {status}
                  </Tag>
                ),
                sorter: (a, b) => a.status.localeCompare(b.status),
              },
              {
                title: "Action",
                render: (_: unknown, user: User) => (
                  <>
                    <Button
                      size="small"
                      onClick={() => handleEdit(user)}
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={() => handleDelete(user.key)}
                      style={{ marginRight: 8 }}
                    >
                      Delete
                    </Button>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item
                            key="move"
                            onClick={() =>
                              setMoveUserModal({
                                user,
                                from: viewAllTarget?.name || "",
                                type:
                                  viewAllTarget?.type === "group"
                                    ? "group"
                                    : "zone",
                              })
                            }
                          >
                            Move to...
                          </Menu.Item>
                          <Menu.Item
                            key="remove"
                            onClick={() =>
                              setRemoveUserModal({
                                user,
                                from: viewAllTarget?.name || "",
                                type:
                                  viewAllTarget?.type === "group"
                                    ? "group"
                                    : "zone",
                              })
                            }
                          >
                            Remove from this {viewAllTarget?.type}
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={["click"]}
                    >
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                  </>
                ),
                width: 180,
              },
            ]}
            dataSource={(() => {
              if (!viewAllTarget) return [];
              if (viewAllTarget.type === "group") {
                return groupUsers[viewAllTarget.name] || [];
              } else if (viewAllTarget.type === "zone") {
                const zone = zoneGroupsState.find(
                  (z) => z.name === viewAllTarget.name
                );
                if (!zone) return [];
                // รวม user ทั้งหมดใน zone (เหมือน allUserKeys)
                const usersByZoneField = users
                  .filter((u) => u.zones && u.zones.includes(zone.name))
                  .map((u) => u.key);
                const groupUserKeys = zone.assignedGroups
                  ? zone.assignedGroups.flatMap((gk) =>
                      users
                        .filter(
                          (u) =>
                            u.groups &&
                            u.groups.some(
                              (gName) =>
                                groups.find((g) => g.key === gk)?.name === gName
                            )
                        )
                        .map((u) => u.key)
                    )
                  : [];
                const assignedUserKeys = zone.assignedUsers || [];
                const allUserKeys = Array.from(
                  new Set([
                    ...usersByZoneField,
                    ...assignedUserKeys,
                    ...groupUserKeys,
                  ])
                );
                return allUserKeys
                  .map((uk) => users.find((u) => u.key === uk))
                  .filter((u): u is User => Boolean(u));
              }
              return [];
            })()}
            pagination={{ pageSize: 10 }}
            scroll={{ y: 400 }}
            size="small"
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
