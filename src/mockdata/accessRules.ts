export const accessRules = [
  {
    key: 1,
    name: "Main Entrance",
    description: "08:00-18:00",
    userKeys: [1, 2, 3],
  },
  { key: 2, name: "Server Room", description: "10:00-16:00", userKeys: [3] },
  { key: 3, name: "Control Room", description: "24/7", userKeys: [3, 4] },
  { key: 4, name: "Visitor Gate", description: "09:00-17:00", userKeys: [4] },
];
