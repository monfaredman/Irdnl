# AG Grid Quick Reference for IrDnl Admin Panel

## 📦 Installed Packages
- ✅ `react-hook-form` v7.71.1
- ✅ `ag-grid-react` v35.0.1
- ✅ `ag-grid-community` v35.0.1

## 🎯 Quick Start

### 1. Import Required Modules
```tsx
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
```

### 2. Basic Table (5 lines)
```tsx
<div className="ag-theme-alpine" style={{ height: 600 }}>
  <AgGridReact
    columnDefs={columnDefs}
    rowData={rowData}
    pagination={true}
  />
</div>
```

### 3. Column Definition
```tsx
const columnDefs: ColDef[] = [
  { field: "title", headerName: "عنوان", sortable: true, filter: true },
  { field: "year", headerName: "سال", filter: "agNumberColumnFilter" },
];
```

## 🔧 Common Features

### Pagination
```tsx
<AgGridReact
  pagination={true}
  paginationPageSize={20}
  paginationPageSizeSelector={[10, 20, 50]}
/>
```

### Row Selection
```tsx
<AgGridReact
  rowSelection="multiple"
  onSelectionChanged={(event) => {
    const selected = event.api.getSelectedRows();
  }}
/>
```

### RTL Support (for Persian)
```tsx
<AgGridReact enableRtl={true} />
```

### Custom Cell Renderer
```tsx
{
  field: "status",
  cellRenderer: (params) => (
    <Chip label={params.value} color="primary" />
  ),
}
```

### Editable Cells
```tsx
{
  field: "title",
  editable: true,
  cellEditor: "agTextCellEditor",
}
```

### Dropdown in Cell
```tsx
{
  field: "status",
  editable: true,
  cellEditor: "agSelectCellEditor",
  cellEditorParams: { values: ["draft", "published"] },
}
```

## 🎨 Pre-built Components

### 1. AGGridContentTable
**Location**: `/frontend/src/components/admin/AGGridContentTable.tsx`

**Features**:
- Read-only table with action buttons
- Status and type badges
- Row selection
- Custom renderers for flags (Kids, Coming Soon, Dubbed)

**Usage**:
```tsx
import { AGGridContentTable } from "@/components/admin/AGGridContentTable";

<AGGridContentTable
  initialData={contentList}
  onEdit={(row) => console.log("Edit:", row)}
  onDelete={(id) => console.log("Delete:", id)}
  onSelectionChange={(rows) => console.log("Selected:", rows)}
/>
```

### 2. AGGridEditableTable
**Location**: `/frontend/src/components/admin/AGGridEditableTable.tsx`

**Features**:
- Inline cell editing
- React Hook Form integration
- Add/remove rows
- Bulk save to API
- Unsaved changes indicator

**Usage**:
```tsx
import { AGGridEditableTable } from "@/components/admin/AGGridEditableTable";

<AGGridEditableTable />
```

### 3. Demo Page
**Location**: `/frontend/src/app/admin/ag-grid-demo/page.tsx`

**Access**: http://localhost:3000/admin/ag-grid-demo

Shows both components with sample data and instructions.

## 📋 Integration Examples

### Replace Existing Table
**Before** (current tables):
```tsx
<table>
  {content.map(item => <tr key={item.id}>...</tr>)}
</table>
```

**After** (AG Grid):
```tsx
import { AGGridContentTable } from "@/components/admin/AGGridContentTable";

<AGGridContentTable
  initialData={content}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### With API Fetching
```tsx
const [rowData, setRowData] = useState([]);

const onGridReady = async (params) => {
  const response = await fetch('/api/admin/content');
  const data = await response.json();
  setRowData(data.content);
};

<AgGridReact
  rowData={rowData}
  onGridReady={onGridReady}
/>
```

### With React Hook Form
```tsx
import { useForm, Controller } from "react-hook-form";

const { control, handleSubmit } = useForm({
  defaultValues: { rows: [] }
});

<Controller
  name="rows"
  control={control}
  render={({ field }) => (
    <AgGridReact rowData={field.value} />
  )}
/>
```

## 🎯 Recommended Pages to Upgrade

### Priority 1 (High impact)
1. **Content List** - `/frontend/src/app/admin/content/page.tsx`
   - Replace table with `AGGridContentTable`
   - Already has action buttons (edit, delete)
   - ~200+ items, needs pagination

2. **Users List** - `/frontend/src/app/admin/users/page.tsx`
   - Large dataset
   - Needs sorting and filtering

### Priority 2 (Medium impact)
3. **Sliders** - `/frontend/src/app/admin/sliders/page.tsx`
   - Use `AGGridEditableTable`
   - Inline editing for sortOrder
   - Drag to reorder could be added

4. **Categories** - `/frontend/src/app/admin/categories/page.tsx`
   - Inline editing
   - Small dataset but frequently edited

5. **Genres** - `/frontend/src/app/admin/genres/page.tsx`
   - Similar to categories

### Priority 3 (Nice to have)
6. **Jobs/Tasks** - `/frontend/src/app/admin/jobs/page.tsx`
   - Real-time updates
   - Status filtering

## 🚀 Performance Tips

1. **Use `useMemo` for column definitions**
   ```tsx
   const columnDefs = useMemo(() => [...], []);
   ```

2. **Implement server-side pagination for large datasets**
   ```tsx
   const datasource = {
     getRows: async (params) => {
       const response = await fetch(`/api?page=${params.startRow / 100}`);
       params.successCallback(response.data, response.totalCount);
     }
   };
   ```

3. **Enable virtual scrolling** (default in AG Grid)
   - Renders only visible rows
   - Handles 100k+ rows smoothly

4. **Cache row data with SWR**
   ```tsx
   const { data } = useSWR('/api/content', fetcher);
   ```

## 📚 Resources

- **Full Guide**: `/frontend/AG_GRID_INTEGRATION_GUIDE.md`
- **AG Grid Docs**: https://www.ag-grid.com/react-data-grid/
- **React Hook Form**: https://react-hook-form.com/
- **Demo Page**: http://localhost:3000/admin/ag-grid-demo

## 🐛 Common Issues

### Issue: Styles not loading
**Solution**: Import CSS files in component:
```tsx
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
```

### Issue: RTL not working
**Solution**: Add `enableRtl={true}` prop and ensure wrapper has RTL direction:
```tsx
<div dir="rtl">
  <AgGridReact enableRtl={true} />
</div>
```

### Issue: Column headers cut off
**Solution**: Set explicit height on wrapper:
```tsx
<div style={{ height: 600 }}>
  <AgGridReact />
</div>
```

## ✅ Next Steps

1. Try the demo: http://localhost:3000/admin/ag-grid-demo
2. Read full guide: `/frontend/AG_GRID_INTEGRATION_GUIDE.md`
3. Replace content table in `/frontend/src/app/admin/content/page.tsx`
4. Test with real data from API
5. Add more custom renderers as needed
