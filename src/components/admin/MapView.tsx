import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import L, {
  LatLngExpression,
  Icon,
  Map as LeafletMap,
  LeafletEvent,
} from "leaflet";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Table,
  Row,
  Col,
} from "antd";
import React, { useState, useRef, useEffect } from "react";

interface Device {
  key: number;
  name: string;
  ip: string;
  status: "Online" | "Offline";
  position: LatLngExpression;
  streamUrl: string;
  description?: string;
  type?: "Camera" | "Door" | "Sensor";
  locationLabel?: string;
}

const mockDevices: Device[] = [
  {
    key: 1,
    name: "Main Entrance",
    ip: "192.168.1.101",
    status: "Online",
    position: [13.7563, 100.5018],
    streamUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Main entrance camera",
    type: "Camera",
    locationLabel: "Lobby",
  },
  {
    key: 2,
    name: "Back Door",
    ip: "192.168.1.102",
    status: "Offline",
    position: [13.757, 100.5025],
    streamUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "Back door sensor",
    type: "Sensor",
    locationLabel: "Backyard",
  },
  {
    key: 3,
    name: "Server Room",
    ip: "192.168.1.103",
    status: "Online",
    position: [13.755, 100.5005],
    streamUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Server room door",
    type: "Door",
    locationLabel: "Server Room",
  },
];

// Custom icons by type
const cameraIcon: Icon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const doorIcon: Icon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const sensorIcon: Icon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-orange.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const offlineIcon: Icon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-grey.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function getMarkerIcon(device: Device): Icon {
  if (device.status === "Offline") return offlineIcon;
  if (device.type === "Camera") return cameraIcon;
  if (device.type === "Door") return doorIcon;
  if (device.type === "Sensor") return sensorIcon;
  return cameraIcon;
}

function AddPinHandler({
  onAdd,
}: {
  onAdd: (latlng: LatLngExpression) => void;
}) {
  useMapEvent("click", (e) => {
    onAdd([e.latlng.lat, e.latlng.lng]);
  });
  return null;
}

export default function MapView({
  devices: initialDevices = mockDevices,
  onlyMap = false,
  onlyTable = false,
  onSelectDevice,
  selectedDeviceKey,
  tableSize = "small",
}: {
  devices?: Device[];
  onlyMap?: boolean;
  onlyTable?: boolean;
  onSelectDevice?: (device: Device) => void;
  selectedDeviceKey?: number | null;
  tableSize?: "small" | "middle" | "large";
}) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLatLng, setAddLatLng] = useState<LatLngExpression | null>(null);
  const [form] = Form.useForm();
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [editForm] = Form.useForm();
  // Filtering/search state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined
  );
  const [filterLocation, setFilterLocation] = useState<string | undefined>(
    undefined
  );
  // Map ref for zooming to marker
  const mapRef = useRef<LeafletMap | null>(null);
  // Marker refs for opening popups
  const markerRefs = useRef<{ [key: number]: L.Marker | null }>({});
  // Selected row for highlight
  const [selectedRowKey, setSelectedRowKey] = useState<number | null>(null);

  // Action handlers (mock)
  const handleOpenDoor = (device: Device) => {
    alert(`Open Door: ${device.name}`);
  };
  const handleBuzzer = (device: Device) => {
    alert(`Buzzer: ${device.name}`);
  };

  // When map is clicked, open modal to add pin
  const handleMapAddPin = (latlng: LatLngExpression) => {
    setAddLatLng(latlng);
    setAddModalOpen(true);
    form.resetFields();
  };

  // On modal submit, add new device
  const handleAddDevice = () => {
    form.validateFields().then((values) => {
      const newDevice: Device = {
        key: Date.now(),
        name: values.name,
        ip: values.ip,
        status: values.status,
        position: addLatLng!,
        streamUrl: values.streamUrl,
        description: values.description,
        type: values.type,
        locationLabel: values.locationLabel,
      };
      setDevices([...devices, newDevice]);
      setAddModalOpen(false);
      setAddLatLng(null);
      form.resetFields();
      message.success("Pin added");
    });
  };

  // Edit pin
  const openEditModal = (device: Device) => {
    setEditDevice(device);
    setEditModalOpen(true);
    editForm.setFieldsValue({ ...device });
  };
  const handleEditDevice = () => {
    editForm.validateFields().then((values) => {
      setDevices(
        devices.map((d) =>
          d.key === editDevice!.key ? { ...d, ...values } : d
        )
      );
      setEditModalOpen(false);
      setEditDevice(null);
      message.success("Pin updated");
    });
  };

  // Delete pin
  const handleDeleteDevice = (key: number) => {
    setDevices(devices.filter((d) => d.key !== key));
    message.success("Pin deleted");
  };

  // Drag/move pin
  const handleMarkerDragEnd = (
    key: number,
    e: LeafletEvent & { target: L.Marker }
  ) => {
    const { lat, lng } = e.target.getLatLng();
    setDevices(
      devices.map((d) => (d.key === key ? { ...d, position: [lat, lng] } : d))
    );
    message.success("Pin moved");
  };

  // Filtering logic
  const filteredDevices = devices.filter((d) => {
    return (
      (!search || d.name.toLowerCase().includes(search.toLowerCase())) &&
      (!filterType || d.type === filterType) &&
      (!filterStatus || d.status === filterStatus) &&
      (!filterLocation ||
        (d.locationLabel &&
          d.locationLabel.toLowerCase().includes(filterLocation.toLowerCase())))
    );
  });

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Location", dataIndex: "locationLabel", key: "locationLabel" },
    { title: "IP", dataIndex: "ip", key: "ip" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Stream URL", dataIndex: "streamUrl", key: "streamUrl" },
    {
      title: "Lat",
      dataIndex: "position",
      key: "lat",
      render: (pos: LatLngExpression) =>
        Array.isArray(pos) ? pos[0].toFixed(5) : "",
    },
    {
      title: "Lng",
      dataIndex: "position",
      key: "lng",
      render: (pos: LatLngExpression) =>
        Array.isArray(pos) ? pos[1].toFixed(5) : "",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_: unknown, record: Device) => (
        <>
          <Button
            size="small"
            onClick={() => openEditModal(record)}
            style={{
              marginRight: 2,
              padding: "0 4px",
              height: 20,
              fontSize: 11,
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this pin?"
            onConfirm={() => handleDeleteDevice(record.key)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              size="small"
              danger
              style={{
                marginRight: 2,
                padding: "0 4px",
                height: 20,
                fontSize: 11,
              }}
            >
              Delete
            </Button>
          </Popconfirm>
          <Button
            size="small"
            onClick={() => zoomToPin(record)}
            style={{
              marginRight: 0,
              padding: "0 4px",
              height: 20,
              fontSize: 11,
            }}
          >
            Zoom
          </Button>
        </>
      ),
    },
  ];

  // Zoom to pin and open popup
  const zoomToPin = (device: Device) => {
    if (mapRef.current && device.position) {
      mapRef.current.setView(device.position, 17, { animate: true });
    }
    if (markerRefs.current[device.key]) {
      markerRefs.current[device.key]!.openPopup();
    }
    setSelectedRowKey(device.key);
  };

  // Sync selectedDeviceKey from parent
  useEffect(() => {
    if (selectedDeviceKey) {
      const device = devices.find((d) => d.key === selectedDeviceKey);
      if (device) zoomToPin(device);
    }
  }, [selectedDeviceKey]);

  // If onlyMap, render just the map
  if (onlyMap) {
    return (
      <MapContainer
        // @ts-expect-error react-leaflet prop type issue: center is valid
        center={[13.7563, 100.5018]}
        zoom={13}
        style={{ width: "100%", height: "400px" }}
        scrollWheelZoom={true}
      >
        {/* @ts-expect-error react-leaflet prop type issue: attribution is valid */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddPinHandler onAdd={handleMapAddPin} />
        {filteredDevices.map((device) => (
          <Marker
            key={device.key}
            position={device.position}
            // @ts-expect-error react-leaflet prop type issue: icon is valid
            icon={getMarkerIcon(device)}
            draggable={true}
            eventHandlers={{
              dragend: (e: L.LeafletEvent & { target: L.Marker }) =>
                handleMarkerDragEnd(
                  device.key,
                  e as L.LeafletEvent & { target: L.Marker }
                ),
            }}
            ref={(ref) => {
              markerRefs.current[device.key] = ref;
            }}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <b>{device.name}</b>
                <div>Type: {device.type}</div>
                <div>Location: {device.locationLabel}</div>
                <div>IP: {device.ip}</div>
                <div>
                  Status:{" "}
                  <span
                    style={{
                      color: device.status === "Online" ? "green" : "red",
                    }}
                  >
                    {device.status}
                  </span>
                </div>
                <div>Description: {device.description}</div>
                <div style={{ margin: "8px 0" }}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleOpenDoor(device)}
                    style={{ marginRight: 8 }}
                  >
                    Open Door
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleBuzzer(device)}
                    style={{ marginRight: 8 }}
                  >
                    Buzzer
                  </Button>
                  <Button
                    size="small"
                    onClick={() => openEditModal(device)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete this pin?"
                    onConfirm={() => handleDeleteDevice(device.key)}
                    okText="Delete"
                    cancelText="Cancel"
                  >
                    <Button size="small" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
                <div>
                  <video
                    style={{ width: "100%", height: "auto", maxWidth: 220 }}
                    controls
                    poster="https://dummyimage.com/220x120/07377E/fff&text=Camera+Stream"
                  >
                    <source src={device.streamUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }

  // If onlyTable, render just the table with filter bar
  if (onlyTable) {
    return (
      <>
        <Row gutter={8} style={{ marginBottom: 4, fontSize: 12 }}>
          <Col>
            <Input
              size="small"
              placeholder="Search name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{ minWidth: 110 }}
            />
          </Col>
          <Col>
            <Select
              size="small"
              placeholder="Type"
              value={filterType}
              onChange={setFilterType}
              allowClear
              style={{ width: 90 }}
            >
              <Select.Option value="Camera">Camera</Select.Option>
              <Select.Option value="Door">Door</Select.Option>
              <Select.Option value="Sensor">Sensor</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select
              size="small"
              placeholder="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
              style={{ width: 90 }}
            >
              <Select.Option value="Online">Online</Select.Option>
              <Select.Option value="Offline">Offline</Select.Option>
            </Select>
          </Col>
          <Col>
            <Input
              size="small"
              placeholder="Location"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              allowClear
              style={{ minWidth: 90 }}
            />
          </Col>
        </Row>
        <Table
          dataSource={filteredDevices}
          columns={columns}
          rowKey="key"
          size="small"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1200 }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRowKey(record.key);
              if (onSelectDevice) onSelectDevice(record as Device);
            },
          })}
          rowClassName={(record) =>
            record.key === selectedRowKey ? "ant-table-row-selected" : ""
          }
          style={{ fontSize: 12 }}
        />
      </>
    );
  }

  // Default: render both map and table as before
  return (
    <>
      {/* Filter/Search Bar */}
      <Row gutter={8} style={{ marginBottom: 4, fontSize: 12 }}>
        <Col>
          <Input
            size="small"
            placeholder="Search name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ minWidth: 110 }}
          />
        </Col>
        <Col>
          <Select
            size="small"
            placeholder="Type"
            value={filterType}
            onChange={setFilterType}
            allowClear
            style={{ width: 90 }}
          >
            <Select.Option value="Camera">Camera</Select.Option>
            <Select.Option value="Door">Door</Select.Option>
            <Select.Option value="Sensor">Sensor</Select.Option>
          </Select>
        </Col>
        <Col>
          <Select
            size="small"
            placeholder="Status"
            value={filterStatus}
            onChange={setFilterStatus}
            allowClear
            style={{ width: 90 }}
          >
            <Select.Option value="Online">Online</Select.Option>
            <Select.Option value="Offline">Offline</Select.Option>
          </Select>
        </Col>
        <Col>
          <Input
            size="small"
            placeholder="Location"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            allowClear
            style={{ minWidth: 90 }}
          />
        </Col>
      </Row>
      <MapContainer
        // @ts-expect-error react-leaflet prop type issue: center is valid
        center={[13.7563, 100.5018]}
        zoom={13}
        style={{ width: "100%", height: "400px" }}
        scrollWheelZoom={true}
      >
        {/* @ts-expect-error react-leaflet prop type issue: attribution is valid */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddPinHandler onAdd={handleMapAddPin} />
        {filteredDevices.map((device) => (
          <Marker
            key={device.key}
            position={device.position}
            // @ts-expect-error react-leaflet prop type issue: icon is valid
            icon={getMarkerIcon(device)}
            draggable={true}
            eventHandlers={{
              dragend: (e: L.LeafletEvent & { target: L.Marker }) =>
                handleMarkerDragEnd(
                  device.key,
                  e as L.LeafletEvent & { target: L.Marker }
                ),
            }}
            ref={(ref) => {
              markerRefs.current[device.key] = ref;
            }}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <b>{device.name}</b>
                <div>Type: {device.type}</div>
                <div>Location: {device.locationLabel}</div>
                <div>IP: {device.ip}</div>
                <div>
                  Status:{" "}
                  <span
                    style={{
                      color: device.status === "Online" ? "green" : "red",
                    }}
                  >
                    {device.status}
                  </span>
                </div>
                <div>Description: {device.description}</div>
                <div style={{ margin: "8px 0" }}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleOpenDoor(device)}
                    style={{ marginRight: 8 }}
                  >
                    Open Door
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleBuzzer(device)}
                    style={{ marginRight: 8 }}
                  >
                    Buzzer
                  </Button>
                  <Button
                    size="small"
                    onClick={() => openEditModal(device)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete this pin?"
                    onConfirm={() => handleDeleteDevice(device.key)}
                    okText="Delete"
                    cancelText="Cancel"
                  >
                    <Button size="small" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
                <div>
                  <video
                    style={{ width: "100%", height: "auto", maxWidth: 220 }}
                    controls
                    poster="https://dummyimage.com/220x120/07377E/fff&text=Camera+Stream"
                  >
                    <source src={device.streamUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* Add Pin Modal */}
      <Modal
        title="Add Device/Camera Pin"
        open={addModalOpen}
        onOk={handleAddDevice}
        onCancel={() => setAddModalOpen(false)}
        okText="Add"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="ip" label="IP Address" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Online">Online</Select.Option>
              <Select.Option value="Offline">Offline</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Camera">Camera</Select.Option>
              <Select.Option value="Door">Door</Select.Option>
              <Select.Option value="Sensor">Sensor</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="locationLabel"
            label="Location Label"
            rules={[{ required: true }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="description" label="Description">
            {" "}
            <Input.TextArea rows={2} />{" "}
          </Form.Item>
          <Form.Item
            name="streamUrl"
            label="Stream URL"
            rules={[{ required: true }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
        </Form>
        {addLatLng && (
          <div style={{ marginTop: 8, color: "#888" }}>
            Lat: {(addLatLng as [number, number])[0].toFixed(5)}, Lng:{" "}
            {(addLatLng as [number, number])[1].toFixed(5)}
          </div>
        )}
      </Modal>
      {/* Edit Pin Modal */}
      <Modal
        title="Edit Device/Camera Pin"
        open={editModalOpen}
        onOk={handleEditDevice}
        onCancel={() => setEditModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="ip" label="IP Address" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Online">Online</Select.Option>
              <Select.Option value="Offline">Offline</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Camera">Camera</Select.Option>
              <Select.Option value="Door">Door</Select.Option>
              <Select.Option value="Sensor">Sensor</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="locationLabel"
            label="Location Label"
            rules={[{ required: true }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="description" label="Description">
            {" "}
            <Input.TextArea rows={2} />{" "}
          </Form.Item>
          <Form.Item
            name="streamUrl"
            label="Stream URL"
            rules={[{ required: true }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
        </Form>
      </Modal>
      {/* Table below map */}
      <div style={{ marginTop: 24 }}>
        <Table
          dataSource={filteredDevices}
          columns={columns}
          rowKey="key"
          size="small"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1200 }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRowKey(record.key);
              zoomToPin(record as Device);
            },
          })}
          rowClassName={(record) =>
            record.key === selectedRowKey ? "ant-table-row-selected" : ""
          }
          style={{ fontSize: 12 }}
        />
      </div>
    </>
  );
}
