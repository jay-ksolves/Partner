# Frontend Development Guide

This guide covers the frontend architecture, patterns, and best practices for the Partner Platform.

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Redux Toolkit + TanStack Query
- **Styling**: TailwindCSS with custom theme
- **Routing**: React Router with code splitting
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table with enterprise features
- **Charts**: Recharts for data visualization
- **Animation**: Framer Motion for smooth transitions

### Project Structure

```
frontend/src/
├── app/                 # App-level configuration and providers
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, Topbar, etc.)
│   └── ui/             # Base UI components (Button, Input, etc.)
├── features/           # Feature-specific components and logic
│   ├── auth/          # Authentication related components
│   ├── kyc/           # KYC verification components
│   ├── partners/      # Partner management components
│   └── transactions/  # Transaction components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API clients and queries
├── store/              # Redux store and slices
├── styles/             # Global styles and themes
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── validation/         # Zod schemas for form validation
```

## 🎨 Design System & Theming

### Color Palette
The platform uses a custom Purple theme with these primary colors:

```typescript
// tailwind.config.ts
colors: {
  primary: {
    500: '#A05AFF',
    600: '#9333EA',
    // ... full scale
  },
  secondary: {
    500: '#1BCFB4', // Teal
    // ... full scale
  },
  accent: {
    teal: '#1BCFB4',
    sky: '#4BCBEB',
    rose: '#FE9496',
    violet: '#9E58FF',
  }
}
```

### Component Design Principles
1. **Consistency**: All components follow the same design patterns
2. **Accessibility**: ARIA labels, keyboard navigation, focus management
3. **Responsiveness**: Mobile-first design with Tailwind breakpoints
4. **Performance**: Lazy loading and code splitting where appropriate

### Using the Design System

```tsx
// KPI Card with gradient background
<KpiCard
  title="Total Revenue"
  value="₹1,25,000"
  icon={DollarSign}
  gradient="primary"
  trend={{ value: 12.5, isPositive: true }}
/>

// Button variants
<Button variant="primary" size="md">Primary Action</Button>
<Button variant="secondary" size="sm">Secondary Action</Button>
```

## 🔄 State Management

### Redux Toolkit Slices
We use Redux Toolkit for UI state and user authentication:

```typescript
// store/slices/authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // ... other reducers
  },
});
```

### TanStack Query for Server State
All server communication uses TanStack Query for optimal caching and synchronization:

```typescript
// services/queries/partnersQueries.ts
export const usePartnersQuery = (params: PartnersListParams) =>
  useQuery({
    queryKey: ['partners', 'list', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/partners', { params });
      return data;
    },
    keepPreviousData: true,
  });

// Mutations with optimistic updates
export const useUpdatePartnerMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.put(`/partners/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partners', 'list']);
      // Show success toast
    },
  });
};
```

## 📊 Advanced Table Implementation

### TanStack Table Features
Our DataTable component supports:
- Server-side pagination, sorting, filtering
- Column visibility, reordering, resizing
- Row selection and bulk actions
- Virtualization for large datasets
- Export functionality (CSV/XLSX)
- Persistent state in URL params

```tsx
// Usage example
const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'reference',
    header: 'Reference',
    cell: ({ row }) => (
      <div className="font-mono">{row.getValue('reference')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return <div className="font-semibold">₹{amount.toLocaleString()}</div>;
    },
  },
];

<DataTable
  data={transactions}
  columns={columns}
  searchable
  filterable
  selectable
  exportable
  onExport={(selectedRows) => exportTransactions(selectedRows)}
/>
```

### Table State Persistence
Table state is automatically persisted in URL parameters and localStorage:

```typescript
// Custom hook for table state
const useTableState = (tableId: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const updateTableState = useCallback((state) => {
    // Update URL params
    setSearchParams(prev => ({
      ...prev,
      [`${tableId}_page`]: state.pagination.pageIndex,
      [`${tableId}_sort`]: state.sorting[0]?.id,
    }));
    
    // Save to localStorage
    localStorage.setItem(`table_${tableId}`, JSON.stringify(state));
  }, [tableId]);
  
  return { updateTableState };
};
```

## 📝 Form Handling

### React Hook Form + Zod Integration
All forms use React Hook Form with Zod validation for type safety:

```typescript
// validation/partnerSchema.ts
export const partnerProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
});

// components/forms/PartnerProfileForm.tsx
const PartnerProfileForm = () => {
  const form = useForm<PartnerProfileInput>({
    resolver: zodResolver(partnerProfileSchema),
    defaultValues: initialData,
  });
  
  const updateMutation = useUpdatePartnerMutation();
  
  const onSubmit = (data: PartnerProfileInput) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="companyName"
        render={({ field, fieldState }) => (
          <div>
            <Label>Company Name</Label>
            <Input {...field} error={fieldState.error?.message} />
          </div>
        )}
      />
      {/* More fields */}
    </form>
  );
};
```

### File Upload with S3 Presigned URLs
File uploads use presigned URLs for direct S3 upload:

```typescript
const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  
  const uploadFile = async (file: File, category: string) => {
    setUploading(true);
    
    try {
      // Get presigned URL
      const { data } = await apiClient.post('/files/presign', {
        fileName: file.name,
        fileType: file.type,
        category,
      });
      
      // Upload directly to S3
      await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      
      return data.fileUrl;
    } finally {
      setUploading(false);
    }
  };
  
  return { uploadFile, uploading };
};
```

## 🎭 Animation & Transitions

### Framer Motion Integration
Smooth animations enhance user experience:

```tsx
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>

// Staggered list animations
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={item.id} variants={itemVariants}>
      <ItemComponent item={item} />
    </motion.div>
  ))}
</motion.div>
```

## ♿ Accessibility

### Implementation Checklist
- [x] Semantic HTML structure
- [x] ARIA labels and roles
- [x] Keyboard navigation
- [x] Focus management
- [x] Screen reader compatibility
- [x] Color contrast compliance
- [x] Reduced motion preferences

```tsx
// Accessible modal example
<Dialog
  open={isOpen}
  onClose={onClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <div className="focus:outline-none" tabIndex={-1}>
    <h2 id="modal-title">Modal Title</h2>
    <p id="modal-description">Modal content description</p>
    
    <button
      onClick={onClose}
      aria-label="Close modal"
      className="focus:ring-2 focus:ring-primary-500"
    >
      <X size={20} />
    </button>
  </div>
</Dialog>
```

## 🚀 Performance Optimization

### Code Splitting
Routes are automatically code-split:

```tsx
// app/Router.tsx
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Transactions = lazy(() => import('@/pages/Transactions'));

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<PageSkeleton />}>
          <Dashboard />
        </Suspense>
      } />
    </Routes>
  </BrowserRouter>
);
```

### Query Optimization
- Prefetch critical queries on route hover
- Background refetch for stale data
- Optimistic updates for mutations
- Query invalidation strategies

```tsx
// Prefetch on hover
const prefetchPartners = useQueryClient().prefetchQuery;

<Link
  to="/partners"
  onMouseEnter={() => prefetchPartners(['partners', 'list'])}
>
  Partners
</Link>
```

## 🧪 Testing Strategy

### Component Testing
```tsx
// __tests__/components/KpiCard.test.tsx
describe('KpiCard', () => {
  it('displays value and trend correctly', () => {
    render(
      <KpiCard
        title="Revenue"
        value="₹1,000"
        icon={DollarSign}
        trend={{ value: 10, isPositive: true }}
      />
    );
    
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('₹1,000')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
  });
});
```

### Integration Testing
```tsx
// __tests__/features/auth/Login.test.tsx
describe('Login Flow', () => {
  it('logs in user successfully', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

## 🛠️ Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch

# Lint and format
npm run lint:fix
npm run format
```

### Building for Production
```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

## 🔧 Troubleshooting

### Common Issues

1. **TanStack Query Stale Closures**
   ```tsx
   // ❌ Wrong - closure over stale queryClient
   const invalidateQueries = () => {
     queryClient.invalidateQueries(['partners']);
   };
   
   // ✅ Correct - fresh reference
   const queryClient = useQueryClient();
   const invalidateQueries = useCallback(() => {
     queryClient.invalidateQueries(['partners']);
   }, [queryClient]);
   ```

2. **Form State Reset Issues**
   ```tsx
   // ✅ Reset form when data changes
   useEffect(() => {
     if (partner) {
       form.reset(partner);
     }
   }, [partner, form]);
   ```

3. **Memory Leaks with AbortController**
   ```tsx
   // ✅ Cleanup on unmount
   useEffect(() => {
     const controller = new AbortController();
     
     fetchData({ signal: controller.signal });
     
     return () => controller.abort();
   }, []);
   ```

This guide provides the foundation for effective frontend development on the Partner Platform. For specific implementation questions, refer to the existing codebase examples or reach out to the development team.