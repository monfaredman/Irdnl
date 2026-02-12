# AG Grid + React Hook Form Integration Guide

## Overview
This guide shows how to use AG Grid with React Hook Form in the IrDnl admin panel for better table management.

## Installed Packages
- `react-hook-form` v7.71.1 - Form state management
- `ag-grid-react` v35.0.1 - Enterprise-grade data grid
- `ag-grid-community` v35.0.1 - Core AG Grid functionality

## Basic AG Grid Table Example

### Simple Read-Only Table
```tsx
"use client";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";

export function ContentTableExample() {
  const columnDefs: ColDef[] = [
    { field: "title", headerName: "عنوان", sortable: true, filter: true },
    { field: "type", headerName: "نوع", sortable: true, filter: true },
    { field: "status", headerName: "وضعیت", sortable: true, filter: true },
    { field: "year", headerName: "سال", sortable: true, filter: "agNumberColumnFilter" },
  ];

  const rowData = [
    { title: "فیلم 1", type: "movie", status: "published", year: 2024 },
    { title: "سریال 1", type: "series", status: "draft", year: 2023 },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={true}
        paginationPageSize={20}
        domLayout="normal"
      />
    </div>
  );
}
```

## AG Grid with React Hook Form for Editable Tables

### Editable Table with Form Integration
```tsx
"use client";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, CellEditingStoppedEvent } from "ag-grid-community";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Button } from "@mui/material";

interface RowData {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
}

interface FormData {
  rows: RowData[];
}

export function EditableTableWithForm() {
  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      rows: [
        { id: "1", title: "Item 1", sortOrder: 1, isActive: true },
        { id: "2", title: "Item 2", sortOrder: 2, isActive: false },
      ],
    },
  });

  const rows = watch("rows");

  const columnDefs: ColDef[] = [
    {
      field: "title",
      headerName: "عنوان",
      editable: true,
      sortable: true,
      filter: true,
    },
    {
      field: "sortOrder",
      headerName: "ترتیب",
      editable: true,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      field: "isActive",
      headerName: "فعال",
      editable: true,
      cellRenderer: (params: any) => (
        <input type="checkbox" checked={params.value} readOnly />
      ),
    },
  ];

  const onCellEditingStopped = (event: CellEditingStoppedEvent) => {
    const updatedRows = [...rows];
    const rowIndex = event.rowIndex;
    if (rowIndex !== null && rowIndex !== undefined) {
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [event.column.getColId()]: event.newValue,
      };
      setValue("rows", updatedRows);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Submitting:", data);
    // Call your API here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <Controller
          name="rows"
          control={control}
          render={({ field }) => (
            <AgGridReact
              columnDefs={columnDefs}
              rowData={field.value}
              onCellEditingStopped={onCellEditingStopped}
              pagination={true}
              paginationPageSize={10}
            />
          )}
        />
      </div>
      <Button type="submit" variant="contained" className="mt-4">
        ذخیره تغییرات
      </Button>
    </form>
  );
}
```

## Advanced Features

### Custom Cell Renderers
```tsx
const columnDefs: ColDef[] = [
  {
    field: "actions",
    headerName: "عملیات",
    cellRenderer: (params: any) => (
      <div className="flex gap-2">
        <button onClick={() => handleEdit(params.data)}>ویرایش</button>
        <button onClick={() => handleDelete(params.data.id)}>حذف</button>
      </div>
    ),
  },
];
```

### Row Selection
```tsx
<AgGridReact
  columnDefs={columnDefs}
  rowData={rowData}
  rowSelection="multiple"
  onSelectionChanged={(event) => {
    const selectedRows = event.api.getSelectedRows();
    console.log("Selected:", selectedRows);
  }}
/>
```

### Server-Side Pagination & Filtering
```tsx
const [rowData, setRowData] = useState([]);
const [loading, setLoading] = useState(false);

const onGridReady = (params: GridReadyEvent) => {
  setLoading(true);
  fetch('/api/admin/content?page=1&limit=20')
    .then(res => res.json())
    .then(data => {
      setRowData(data.content);
      setLoading(false);
    });
};

<AgGridReact
  columnDefs={columnDefs}
  rowData={rowData}
  loading={loading}
  onGridReady={onGridReady}
  pagination={true}
  paginationPageSize={20}
/>
```

## Styling with RTL Support

### Custom Theme for Persian UI
```css
/* In your globals.css or component CSS */
.ag-theme-alpine-rtl {
  direction: rtl;
}

.ag-theme-alpine-rtl .ag-header-cell-text {
  text-align: right;
}

.ag-theme-alpine-rtl .ag-cell {
  text-align: right;
}
```

```tsx
<div className="ag-theme-alpine ag-theme-alpine-rtl" style={{ height: 600 }}>
  <AgGridReact {...props} enableRtl={true} />
</div>
```

## Integration with Existing Admin Pages

### Example: Enhanced Content List Page
Replace the current table in `/frontend/src/app/admin/content/page.tsx`:

```tsx
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const columnDefs: ColDef[] = [
  { field: "title", headerName: "عنوان", filter: true, sortable: true },
  { field: "originalTitle", headerName: "عنوان اصلی", filter: true },
  { field: "type", headerName: "نوع", filter: true },
  { field: "year", headerName: "سال", filter: "agNumberColumnFilter" },
  { field: "status", headerName: "وضعیت", filter: true },
  {
    field: "actions",
    headerName: "عملیات",
    cellRenderer: ActionsButtonRenderer,
    pinned: "right",
  },
];

<div className="ag-theme-alpine" style={{ height: 600 }}>
  <AgGridReact
    columnDefs={columnDefs}
    rowData={contentList}
    pagination={true}
    paginationPageSize={20}
    enableRtl={true}
  />
</div>
```

## Best Practices

1. **Use ColDef types** for type safety
2. **Enable RTL** for Persian UI: `enableRtl={true}`
3. **Implement server-side pagination** for large datasets
4. **Use Controller** from react-hook-form for editable grids
5. **Cache row data** with useMemo for performance
6. **Handle loading states** with the `loading` prop

## Common Features

- ✅ Sorting (multi-column with shift-click)
- ✅ Filtering (text, number, date filters)
- ✅ Pagination (client or server-side)
- ✅ Row selection (single or multiple)
- ✅ Editable cells (inline editing)
- ✅ Custom cell renderers (actions, badges, etc.)
- ✅ Column resizing and reordering
- ✅ Export to CSV/Excel (with additional packages)
- ✅ RTL support for Persian

## Resources

- [AG Grid React Docs](https://www.ag-grid.com/react-data-grid/)
- [React Hook Form Docs](https://react-hook-form.com/)
- [AG Grid Examples](https://www.ag-grid.com/react-data-grid/examples/)
