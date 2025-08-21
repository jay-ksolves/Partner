import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import { useTransactionsQuery, Transaction } from '@/services/queries/transactionsQueries';
import { format } from 'date-fns';

const Transactions: React.FC = () => {
  const [params, setParams] = React.useState({
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc' as const,
  });

  const { data, isLoading } = useTransactionsQuery(params);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'reference',
      header: 'Reference',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue('reference')}</div>
      ),
    },
    {
      accessorKey: 'partnerName',
      header: 'Partner',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return (
          <Badge variant={type === 'credit' ? 'success' : 'warning'}>
            {type.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number;
        const type = row.original.type;
        return (
          <div className={`font-semibold ${
            type === 'credit' ? 'text-green-600' : 'text-red-600'
          }`}>
            {type === 'credit' ? '+' : '-'}₹{amount.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variant = {
          pending: 'warning',
          completed: 'success',
          failed: 'destructive',
        }[status] as 'warning' | 'success' | 'destructive';
        
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return format(date, 'MMM dd, yyyy HH:mm');
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor all financial transactions and payments
          </p>
        </div>
      </div>

      <DataTable
        data={data?.items || []}
        columns={columns}
        loading={isLoading}
        searchable
        filterable
        selectable
        exportable
        onExport={(selectedRows) => {
          console.log('Exporting:', selectedRows);
        }}
      />
    </div>
  );
};

export default Transactions;