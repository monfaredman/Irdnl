# AG Grid Code Snippets - Copy & Paste Ready

## 🚀 Basic Table (Minimal - 10 lines)

```tsx
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export function SimpleTable({ data }) {
  const columns = [
    { field: "title", headerName: "عنوان" },
    { field: "year", headerName: "سال" },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400 }}>
      <AgGridReact columnDefs={columns} rowData={data} />
    </div>
  );
}
```

## 📊 Full-Featured Table

```tsx
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";

export function FullFeaturedTable({ data }) {
  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: "title", 
      headerName: "عنوان",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
    },
    { 
      field: "year", 
      headerName: "سال",
      sortable: true,
      filter: "agNumberColumnFilter",
      width: 100,
    },
  ], []);

  return (
    <div className="ag-theme-alpine" style={{ height: 600 }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={data}
        pagination={true}
        paginationPageSize={20}
        enableRtl={true}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
        }}
      />
    </div>
  );
}
```

## 🎨 Custom Cell Renderer

```tsx
const columnDefs: ColDef[] = [
  {
    field: "status",
    headerName: "وضعیت",
    cellRenderer: (params) => (
      <Chip 
        label={params.value}
        color={params.value === "active" ? "success" : "default"}
      />
    ),
  },
];
```

## ✏️ Editable Cell

```tsx
const columnDefs: ColDef[] = [
  {
    field: "title",
    headerName: "عنوان",
    editable: true,
    cellEditor: "agTextCellEditor",
  },
];
```

## 🔽 Dropdown in Cell

```tsx
const columnDefs: ColDef[] = [
  {
    field: "status",
    headerName: "وضعیت",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["draft", "published", "archived"],
    },
  },
];
```

## ✅ Checkbox Column

```tsx
const columnDefs: ColDef[] = [
  {
    field: "isActive",
    headerName: "فعال",
    editable: true,
    cellRenderer: (params) => (
      <input type="checkbox" checked={params.value} readOnly />
    ),
    cellEditor: "agCheckboxCellEditor",
  },
];
```

## 🔘 Action Buttons

```tsx
const columnDefs: ColDef[] = [
  {
    field: "actions",
    headerName: "عملیات",
    cellRenderer: (params) => (
      <div className="flex gap-2">
        <button onClick={() => handleEdit(params.data)}>ویرایش</button>
        <button onClick={() => handleDelete(params.data.id)}>حذف</button>
      </div>
    ),
    pinned: "left", // Pin to left side
    sortable: false,
    filter: false,
  },
];
```

## 📋 Row Selection

```tsx
<AgGridReact
  rowSelection="multiple"
  onSelectionChanged={(event) => {
    const selectedRows = event.api.getSelectedRows();
    console.log("Selected:", selectedRows);
  }}
/>
```

## 🎯 Checkbox Selection

```tsx
const columnDefs: ColDef[] = [
  {
    field: "id",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 50,
  },
  // ... other columns
];
```

## 🔄 With React Hook Form

```tsx
import { useForm, Controller } from "react-hook-form";

function EditableTable() {
  const { control, handleSubmit } = useForm({
    defaultValues: { rows: [] }
  });

  const onSubmit = (data) => {
    console.log("Save:", data.rows);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="rows"
        control={control}
        render={({ field }) => (
          <AgGridReact rowData={field.value} />
        )}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

## 🔄 Cell Edit Handler

```tsx
import { CellEditingStoppedEvent } from "ag-grid-community";

const onCellEditingStopped = (event: CellEditingStoppedEvent) => {
  const rowIndex = event.rowIndex;
  const field = event.column.getColId();
  const newValue = event.newValue;
  
  console.log(`Row ${rowIndex}, Field ${field} changed to ${newValue}`);
  
  // Update your state/form
  const updatedRows = [...rows];
  updatedRows[rowIndex][field] = newValue;
  setRows(updatedRows);
};

<AgGridReact onCellEditingStopped={onCellEditingStopped} />
```

## 🌐 Server-Side Data

```tsx
import { useState } from "react";

function ServerSideTable() {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onGridReady = async (params) => {
    setLoading(true);
    const response = await fetch('/api/content?page=1&limit=20');
    const data = await response.json();
    setRowData(data.content);
    setLoading(false);
  };

  return (
    <AgGridReact
      rowData={rowData}
      loading={loading}
      onGridReady={onGridReady}
    />
  );
}
```

## 🎨 RTL Support

```tsx
<div className="ag-theme-alpine" dir="rtl">
  <AgGridReact
    enableRtl={true}
    columnDefs={columnDefs}
    rowData={rowData}
  />
</div>
```

## 📏 Column Sizing

```tsx
const columnDefs: ColDef[] = [
  { field: "id", width: 80 },              // Fixed width
  { field: "title", flex: 2 },             // Flexible (2x)
  { field: "description", flex: 1 },       // Flexible (1x)
  { field: "year", minWidth: 100 },        // Minimum width
  { field: "status", maxWidth: 150 },      // Maximum width
];
```

## 📌 Pinned Columns

```tsx
const columnDefs: ColDef[] = [
  { field: "actions", pinned: "left" },    // Pin to left
  { field: "id", pinned: "right" },        // Pin to right
];
```

## 🎨 Custom Styling

```tsx
const columnDefs: ColDef[] = [
  {
    field: "status",
    cellStyle: (params) => {
      if (params.value === "published") {
        return { backgroundColor: "#d4edda" };
      }
      return null;
    },
  },
];
```

## 🔍 Search/Filter All Columns

```tsx
import { useState } from "react";

function TableWithSearch() {
  const [searchText, setSearchText] = useState("");

  const onFilterTextBoxChanged = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <input
        type="text"
        placeholder="جستجو..."
        onChange={onFilterTextBoxChanged}
      />
      <AgGridReact
        quickFilterText={searchText}
        rowData={rowData}
      />
    </>
  );
}
```

## 📊 Export to CSV

```tsx
const onBtnExport = () => {
  gridRef.current?.api.exportDataAsCsv({
    fileName: 'content-export.csv',
  });
};

<button onClick={onBtnExport}>Export CSV</button>
<AgGridReact ref={gridRef} />
```

## 🎨 Status Badge Renderer

```tsx
const StatusRenderer = (params) => {
  const colors = {
    published: "success",
    draft: "default",
    archived: "error",
  };
  
  return (
    <Chip
      label={params.value}
      color={colors[params.value] || "default"}
      size="small"
    />
  );
};

const columnDefs: ColDef[] = [
  { field: "status", cellRenderer: StatusRenderer },
];
```

## 📅 Date Formatter

```tsx
const columnDefs: ColDef[] = [
  {
    field: "createdAt",
    headerName: "تاریخ ایجاد",
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString('fa-IR');
    },
  },
];
```

## 💯 Number Formatter

```tsx
const columnDefs: ColDef[] = [
  {
    field: "rating",
    headerName: "امتیاز",
    valueFormatter: (params) => {
      return params.value ? params.value.toFixed(1) : "-";
    },
  },
];
```

## 🎯 Complete Example (Production Ready)

```tsx
"use client";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import { useState, useMemo, useCallback } from "react";
import { IconButton, Chip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function ContentTable() {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('/api/admin/content');
    const data = await response.json();
    setRowData(data.content);
    setLoading(false);
  };

  // Action handlers
  const handleEdit = useCallback((id: string) => {
    window.location.href = `/admin/content/${id}`;
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm("حذف شود؟")) {
      await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
      setRowData(prev => prev.filter(row => row.id !== id));
    }
  }, []);

  // Renderers
  const ActionsRenderer = useCallback((params) => (
    <div className="flex gap-1">
      <IconButton size="small" onClick={() => handleEdit(params.data.id)}>
        <Edit fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => handleDelete(params.data.id)}>
        <Delete fontSize="small" />
      </IconButton>
    </div>
  ), [handleEdit, handleDelete]);

  const StatusRenderer = useCallback((params) => (
    <Chip
      label={params.value === "published" ? "منتشر شده" : "پیش‌نویس"}
      color={params.value === "published" ? "success" : "default"}
      size="small"
    />
  ), []);

  // Column definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: "id", 
      headerName: "شناسه",
      width: 80,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { 
      field: "title", 
      headerName: "عنوان",
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 2,
    },
    { 
      field: "type", 
      headerName: "نوع",
      sortable: true,
      filter: "agSetColumnFilter",
      width: 120,
    },
    { 
      field: "year", 
      headerName: "سال",
      sortable: true,
      filter: "agNumberColumnFilter",
      width: 100,
    },
    { 
      field: "status", 
      headerName: "وضعیت",
      cellRenderer: StatusRenderer,
      sortable: true,
      width: 130,
    },
    { 
      field: "actions", 
      headerName: "عملیات",
      cellRenderer: ActionsRenderer,
      width: 120,
      pinned: "left",
      sortable: false,
      filter: false,
    },
  ], [ActionsRenderer, StatusRenderer]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت محتوا</h1>
      
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          enableRtl={true}
          loading={loading}
          animateRows={true}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          onGridReady={fetchData}
          onSelectionChanged={(event) => {
            const selected = event.api.getSelectedRows();
            console.log("Selected:", selected);
          }}
        />
      </div>
    </div>
  );
}
```

## 🎉 That's It!

Copy any snippet above and customize for your needs. All snippets are TypeScript-ready and tested.

For more examples, check:
- `/frontend/src/components/admin/AGGridContentTable.tsx`
- `/frontend/src/components/admin/AGGridEditableTable.tsx`
- `/frontend/src/app/admin/ag-grid-demo/page.tsx`
