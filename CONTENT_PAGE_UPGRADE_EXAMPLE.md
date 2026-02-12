# Example: Upgrading Content List Page to AG Grid

## Current Implementation
**File**: `/frontend/src/app/admin/content/page.tsx`

The page currently uses a basic HTML table with MUI components. Here's how to upgrade it to AG Grid.

## Step-by-Step Upgrade

### Step 1: Add Imports
```tsx
// Add these imports at the top
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import { useMemo, useCallback } from "react";
```

### Step 2: Define Column Definitions
Replace the table headers with column definitions:

```tsx
const columnDefs = useMemo<ColDef[]>(() => [
  {
    field: "id",
    headerName: "شناسه",
    width: 80,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: "right",
  },
  {
    field: "title",
    headerName: "عنوان",
    sortable: true,
    filter: "agTextColumnFilter",
    flex: 2,
    minWidth: 200,
  },
  {
    field: "originalTitle",
    headerName: "عنوان اصلی",
    sortable: true,
    filter: "agTextColumnFilter",
    flex: 1,
  },
  {
    field: "type",
    headerName: "نوع",
    sortable: true,
    filter: "agSetColumnFilter",
    width: 120,
    cellRenderer: (params: any) => (
      <Chip
        label={params.value === "movie" ? "فیلم" : "سریال"}
        color={params.value === "movie" ? "primary" : "secondary"}
        size="small"
        variant="outlined"
      />
    ),
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
    sortable: true,
    filter: "agSetColumnFilter",
    width: 130,
    cellRenderer: (params: any) => (
      <Chip
        label={params.value === "published" ? "منتشر شده" : "پیش‌نویس"}
        color={params.value === "published" ? "success" : "default"}
        size="small"
      />
    ),
  },
  {
    field: "rating",
    headerName: "امتیاز",
    sortable: true,
    filter: "agNumberColumnFilter",
    width: 100,
    valueFormatter: (params) => params.value ? params.value.toFixed(1) : "-",
  },
  {
    field: "actions",
    headerName: "عملیات",
    width: 180,
    pinned: "left",
    cellRenderer: ActionsButtonRenderer, // Keep your existing component
    sortable: false,
    filter: false,
  },
], []);
```

### Step 3: Replace the Table JSX
Replace the existing `<table>` element with:

```tsx
<div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
  <AgGridReact
    columnDefs={columnDefs}
    rowData={contentList}
    pagination={true}
    paginationPageSize={20}
    paginationPageSizeSelector={[10, 20, 50, 100]}
    rowSelection="multiple"
    suppressRowClickSelection={true}
    enableRtl={true}
    loading={isLoading}
    animateRows={true}
    defaultColDef={{
      resizable: true,
      sortable: true,
      filter: true,
    }}
    onSelectionChanged={(event) => {
      const selectedRows = event.api.getSelectedRows();
      console.log("Selected content:", selectedRows);
    }}
  />
</div>
```

### Step 4: Keep Existing Features
Your existing action buttons component can be used as-is:

```tsx
// This is your current ActionsButtonRenderer component
// No changes needed - it will work as a cellRenderer
const ActionsButtonRenderer = (params: any) => {
  const content = params.data;
  
  return (
    <div className="flex gap-1">
      <IconButton size="small" onClick={() => handleEdit(content.id)}>
        <Edit fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => handleDelete(content.id)}>
        <Delete fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={(e) => handleMenuOpen(e, content)}>
        <MoreVert fontSize="small" />
      </IconButton>
    </div>
  );
};
```

### Step 5: Update Loading State
AG Grid has built-in loading overlay:

```tsx
// In your data fetching
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  setIsLoading(true);
  fetchContent().then((data) => {
    setContentList(data);
    setIsLoading(false);
  });
}, []);
```

## Complete Example

Here's a minimal complete example showing the key changes:

```tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import { IconButton, Chip } from "@mui/material";
import { Edit, Delete, MoreVert } from "@mui/icons-material";
import { contentApi } from "@/lib/api/admin";

export default function ContentListPage() {
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    setIsLoading(true);
    contentApi.list({ page: 1, limit: 100 })
      .then((response) => {
        setContentList(response.content);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching content:", error);
        setIsLoading(false);
      });
  }, []);

  // Action handlers (keep existing logic)
  const handleEdit = (id: string) => {
    window.location.href = `/admin/content/${id}`;
  };

  const handleDelete = async (id: string) => {
    if (confirm("آیا مطمئن هستید؟")) {
      await contentApi.delete(id);
      setContentList(contentList.filter((item: any) => item.id !== id));
    }
  };

  // Actions renderer
  const ActionsRenderer = (params: any) => (
    <div className="flex gap-1">
      <IconButton size="small" onClick={() => handleEdit(params.data.id)}>
        <Edit fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => handleDelete(params.data.id)}>
        <Delete fontSize="small" />
      </IconButton>
      <IconButton size="small">
        <MoreVert fontSize="small" />
      </IconButton>
    </div>
  );

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
      filter: true,
      flex: 2,
    },
    { 
      field: "type", 
      headerName: "نوع", 
      sortable: true,
      cellRenderer: (params: any) => (
        <Chip 
          label={params.value === "movie" ? "فیلم" : "سریال"}
          size="small"
        />
      ),
    },
    { 
      field: "year", 
      headerName: "سال", 
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    { 
      field: "status", 
      headerName: "وضعیت", 
      cellRenderer: (params: any) => (
        <Chip 
          label={params.value === "published" ? "منتشر شده" : "پیش‌نویس"}
          color={params.value === "published" ? "success" : "default"}
          size="small"
        />
      ),
    },
    { 
      field: "actions", 
      headerName: "عملیات",
      cellRenderer: ActionsRenderer,
      pinned: "left",
      sortable: false,
      filter: false,
    },
  ], []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت محتوا</h1>
      
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={contentList}
          pagination={true}
          paginationPageSize={20}
          rowSelection="multiple"
          enableRtl={true}
          loading={isLoading}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
        />
      </div>
    </div>
  );
}
```

## Benefits After Upgrade

### Before (Basic Table)
❌ Manual pagination logic  
❌ Manual sorting implementation  
❌ No filtering  
❌ Performance issues with 100+ items  
❌ Manual selection tracking  

### After (AG Grid)
✅ Built-in pagination (client & server-side)  
✅ Multi-column sorting (Shift+Click)  
✅ Advanced filtering (text, number, set filters)  
✅ Virtual scrolling (handles 100k+ rows)  
✅ Built-in row selection  
✅ Resizable columns  
✅ Export to CSV (with plugins)  
✅ Professional look and feel  

## Testing

1. **Start dev server**:
   ```bash
   cd /Users/upera/Documents/Repos/IrDnl/frontend
   npm run dev
   ```

2. **Navigate to**: http://localhost:3000/admin/content

3. **Test features**:
   - Click column headers to sort
   - Click filter icon to filter
   - Select multiple rows with checkboxes
   - Resize columns by dragging borders
   - Test pagination controls

## Rollback Plan

If you need to rollback:

1. Keep the old table code commented out
2. Use a feature flag:
   ```tsx
   const USE_AG_GRID = true; // Set to false to rollback
   
   {USE_AG_GRID ? (
     <div className="ag-theme-alpine">
       <AgGridReact {...props} />
     </div>
   ) : (
     <table>...</table> // Old implementation
   )}
   ```

## Next Steps

After upgrading content list:

1. **Users page** - Similar structure
2. **Sliders page** - Use editable version
3. **Categories/Genres** - Use editable version
4. **Jobs page** - Add real-time updates
5. **Analytics** - Add charts with recharts

## Support

- Demo page: http://localhost:3000/admin/ag-grid-demo
- Full guide: `/frontend/AG_GRID_INTEGRATION_GUIDE.md`
- Quick ref: `/AG_GRID_QUICK_REFERENCE.md`
