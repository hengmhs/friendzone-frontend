const statusOptions = [
  { value: "1", label: "Not Contacted" },
  { value: "2", label: "Contacted" },
  { value: "3", label: "To Reject" },
  { value: "4", label: "Rejected" },
  { value: "5", label: "Confirmed" },
  { value: "6", label: "Not Coming" },
  { value: "7", label: "Prompted" },
  { value: "8", label: "Ghosted" },
];
const attendanceOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const groupOptions = (groupData) => {
  const options = [];
  for (let i = 0; i < groupData.length; i++) {
    options.push({ value: groupData[i].id, label: groupData[i].name });
  }
  return options;
};

const facilOptions = (facilData) => {
  const options = [];
  facilData.forEach((facil) =>
    options.push({ value: facil.id, label: facil.name })
  );
  return options;
};

export { statusOptions, attendanceOptions, groupOptions, facilOptions };
