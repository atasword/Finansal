import { useState } from 'react';
import { Pencil, Trash2, Repeat, Package } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import type { Transaction } from '@/types';

const paymentLabels: Record<string, string> = {
  cash: 'Nakit',
  card: 'Kart',
  transfer: 'Transfer',
};

interface Props {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: Props) {
  const [editing, setEditing] = useState(false);
  const { categories, deleteTransaction } = useStore();
  const category = categories.find((c) => c.id === transaction.categoryId);
  const isIncome = transaction.type === 'income';
  const color = category?.color ?? '#5F8575';

  return (
    <>
      <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50/80 dark:hover:bg-sage-800/40 rounded-xl transition-all duration-150 group cursor-default">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{
              backgroundColor: color + '18',
              boxShadow: `0 0 0 1px ${color}22`,
            }}
          >
            {category?.icon
              ? <span className="text-base leading-none">{category.icon}</span>
              : <Package size={16} className="text-sage-400" />
            }
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-900 dark:text-sage-100 truncate">
                {category?.name ?? 'Bilinmiyor'}
              </span>
              {transaction.isRecurring && (
                <Repeat size={11} className="text-sage-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500 dark:text-sage-500">{formatDate(transaction.date)}</span>
              {transaction.description && (
                <span className="text-xs text-gray-400 dark:text-sage-600 truncate max-w-32">· {transaction.description}</span>
              )}
              {transaction.paymentMethod && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-sage-800 text-gray-500 dark:text-sage-400">
                  {paymentLabels[transaction.paymentMethod] ?? transaction.paymentMethod}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <span
            className={`text-sm font-bold tabular-nums mr-1 ${
              isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
            }`}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
          <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              aria-label="Düzenle"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-sage-600 dark:hover:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => deleteTransaction(transaction.id)}
              aria-label="Sil"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
      <TransactionForm open={editing} onClose={() => setEditing(false)} transaction={transaction} />
    </>
  );
}
