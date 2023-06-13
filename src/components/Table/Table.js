//----------- React -----------//

import React, { useEffect, useState } from "react";

//---------- Table ----------//

import {
  flexRender,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Select from "react-select";

//---------- Statuses ----------//

import {
  statusOptions,
  attendanceOptions,
  groupOptions,
  facilOptions,
} from "./statuses";

//---------- Others ----------//

import "./Table.css";
import axios from "axios";

const Table = ({
  tableColumns,
  tableData,
  setTableData,
  eventId,
  options = "none",
  groupData,
  setGroupData,
  facilData,
  setEditsButton,
}) => {
  const [columnsState, setColumnsState] = useState([]);

  const handleChange = async (e, egpId, participantId, columnName) => {
    // Find out which value is being updated
    let updatedId;
    if (options === "status") {
      updatedId = "statusId";
    } else if (options === "attendance") {
      if (columnName === "Attended") {
        updatedId = "isAttended";
      } else if (columnName === "Group") {
        updatedId = "groupId";
      }
    }

    // If its status or attendance change, update immediately,
    // else hold group edits until you hit save.
    if (
      options === "status" ||
      (options === "attendance" && columnName === "Attended")
    ) {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/events/${eventId}/participants`,
        { participantId, [updatedId]: e.value }
      );
    } else {
      setEditsButton(true);
    }

    // Update state
    setTableData((prevData) => {
      const data = [...prevData];
      const editedIndex = data.findIndex(
        (participant) => participant.egpId === egpId
      );
      if (options === "status") {
        data[editedIndex].statusId = e.value;
      } else if (options === "attendance") {
        if (columnName === "Attended") {
          data[editedIndex].isAttended = e.value;
        } else if (columnName === "Group") {
          data[editedIndex].groupId = Number(e.value);
        }
      }
      return data;
    });
  };

  const handleFacilChange = async (e, content) => {
    const dataCopy = [...groupData];
    // Find group that's being targeted
    const targetIndex = dataCopy.findIndex(
      (data) => data.id === content.groupId
    );
    // Update facilitatorId of target group
    dataCopy[targetIndex].facilitatorId = e.value;
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/groups/${eventId}`,
      { groupArray: dataCopy }
    );
    // Update state
    setGroupData(response.data.data);
  };

  useEffect(() => {
    if (options === "none") {
      setColumnsState([...tableColumns]);
    } else if (options === "status") {
      setColumnsState([
        {
          header: "Status",
          accessorKey: "statusId",
          cell: ({ row }) => {
            return (
              <Select
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                menuPlacement="auto"
                className="select-status"
                id={row.original.egpId}
                options={statusOptions}
                onChange={(e) =>
                  handleChange(e, row.original.egpId, row.original.id)
                }
                value={statusOptions.find(
                  (item) => item.value === row.original.statusId
                )}
              />
            );
          },
        },
        ...tableColumns,
      ]);
    } else if (options === "attendance") {
      // Get group options based on no of groups
      const groups = groupOptions(groupData);
      const facils = facilOptions(facilData);
      setColumnsState([
        {
          header: "Group",
          accessorKey: "groupId",
          cell: ({ row, column }) => {
            const group = groups.find(
              (item) => item.value === row.original.groupId
            );
            if (row.original.mobile) {
              return (
                <Select
                  menuPortalTarget={document.body}
                  menuPosition={"fixed"}
                  menuPlacement="auto"
                  className="select-attendance"
                  id={row.id}
                  options={groups}
                  onChange={(e) =>
                    handleChange(
                      e,
                      row.original.egpId,
                      row.original.id,
                      column.id
                    )
                  }
                  value={group}
                />
              );
            } else {
              return <h5>Group {group.label}</h5>;
            }
          },
        },
        {
          header: "Attended",
          accessorKey: "isAttended",
          cell: ({ row, column }) => {
            if (row.original.mobile) {
              return (
                <Select
                  menuPortalTarget={document.body}
                  menuPosition={"fixed"}
                  menuPlacement="auto"
                  className="select-attendance"
                  id={row.id}
                  options={attendanceOptions}
                  onChange={(e) =>
                    handleChange(
                      e,
                      row.original.egpId,
                      row.original.id,
                      column.id
                    )
                  }
                  value={attendanceOptions.find(
                    (item) => item.value === row.original.isAttended
                  )}
                />
              );
            }
          },
        },
        {
          header: "Name",
          accessorKey: "name",
          cell: ({ row }) => {
            if (row.original.mobile) {
              return row.original.name;
            } else {
              return (
                <Select
                  menuPortalTarget={document.body}
                  menuPosition={"fixed"}
                  menuPlacement="auto"
                  className="select-attendance"
                  id={row.id}
                  options={facils}
                  onChange={(e) => handleFacilChange(e, row.original)}
                  value={facils.find((item) => {
                    return item.label === row.original.name;
                  })}
                />
              );
            }
          },
        },
        ...tableColumns,
      ]);
    }
    // eslint-disable-next-line
  }, [groupData]);

  // Definining & Initialising data to be used

  const data = React.useMemo(() => tableData, [tableData]);
  const columns = React.useMemo(() => [...columnsState], [columnsState]);
  const table = useReactTable({
    columns,
    data,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <h5>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </h5>
                      {{
                        asc: " ⬆",
                        desc: " ⬇",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const participant = cell.row.original;

                // Conditional Row Color Rendering
                let rowColor = "white";
                let textColor = "black";
                if (options === "status") {
                  if (participant.statusId === 5) {
                    rowColor = "#B3DFA1";
                  }
                } else if (options === "attendance") {
                  if (!participant.mobile) {
                    rowColor = "rgb(160,160,160)";
                    textColor = "white";
                  } else if (participant.groupId % 2) {
                    rowColor = "rgb(225,225,225)";
                  }
                }

                return (
                  <td
                    key={cell.id}
                    style={{
                      backgroundColor: rowColor,
                      color: textColor,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
