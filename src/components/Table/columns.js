// Columns for Participants Page

const allColumns = [
  { header: "Name", accessorKey: "name" },
  { header: "Postal Code", accessorKey: "postalCode" },
  { header: "Neighbourhood", accessorKey: "neighbourhood" },
  {
    header: "Age",
    accessorFn: (row) => 2023 - row.year,
  },
  { header: "Mobile", accessorKey: "mobile" },
  {
    header: "Sex",
    accessorFn: (row) => (row.isMale ? "M" : "F"),
    sortType: "basic",
  },
  {
    header: "First Timer",
    accessorFn: (row) => (row.isFirstTime ? "Yes" : "No"),
    sortType: "basic",
  },
  { header: "Nationality", accessorKey: "nationality" },
  { header: "Race", accessorKey: "race" },
  { header: "Marital Status", accessorKey: "maritalStatus" },
];

// Columns for Groupings Page

const groupingColumns = [
  {
    header: "Neighbourhood",
    accessorKey: "neighbourhood",
    cell: ({ row }) => {
      if (row.original.mobile) {
        return row.original.neighbourhood;
      } else {
        return <p></p>;
      }
    },
  },
  {
    header: "Age",
    accessorKey: "year",
    cell: ({ row }) => {
      if (row.original.mobile) {
        return 2023 - row.original.year;
      } else {
        return <p></p>;
      }
    },
  },
  {
    header: "Sex",
    accessorKey: "isMale",
    sortType: "basic",
    cell: ({ row }) => {
      if (row.original.mobile) {
        console.log(row);
        return row.original.isMale ? "M" : "F";
      } else {
        return <p></p>;
      }
    },
  },
  {
    header: "Race",
    accessorKey: "race",
    cell: ({ row }) => {
      if (row.original.mobile) {
        return row.original.race;
      } else {
        return <p></p>;
      }
    },
  },
];

const facilitatorColumns = [
  { header: "Facilitator Name", accessorKey: "name" },
];

export { allColumns, groupingColumns, facilitatorColumns };
