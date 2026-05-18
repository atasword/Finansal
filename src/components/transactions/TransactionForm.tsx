import { useEffect } from 'react';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, TrendingDown, Banknote, CreditCard, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { useStore } from '@/store/useStore';
import type { Transaction } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Tutar pozitif olmalı'),
  categoryId: z.string().min(1, 'Kategori seçin'),
  date: z.string().min(1, 'Tarih girin'),
  description: z.string().optional(),
  paymentMethod: z.enum(['cash', 'card', 'transfer']).optional(),
  isRecurring: z.boolean().optional(),
  recurringPeriod: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

const PAYMENT_METHODS = [
  { value: 'cash' as const, label: 'Nakit', icon: Banknote },
  { value: 'card' as const, label: 'Kart', icon: CreditCard },
  { value: 'transfer' as const, label: 'Transfer', icon: ArrowLeftRight },
];

export function TransactionForm({ open, onClose, transaction }: Props) {
  const { categories, addTransaction, updateTransaction } = useStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const type = watch('type');
  const isRecurring = watch('isRecurring');
  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        date: transaction.date.slice(0, 10),
        description: transaction.description,
        paymentMethod: transaction.paymentMethod,
        isRecurring: transaction.isRecurring,
        recurringPeriod: transaction.recurringPeriod,
      });
    } else {
      reset({ type: 'expense', date: format(new Date(), 'yyyy-MM-dd') });
    }
  }, [transaction, reset, open]);

  const onSubmit = (data: FormValues) => {
    const payload = { ...data, date: new Date(data.date).toISOString() };
    if (transaction) {
      updateTransaction(transaction.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
    reset();
  };

  return (
    <Modal open={open} onClose={onClose} title={transaction ? 'İşlemi Düzenle' : 'Yeni İşlem'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Sliding type toggle */}
        <div className="relative flex p-1 bg-gray-100 dark:bg-sage-800 rounded-xl">
          <div
            className={cn(
              'absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg shadow-md transition-all duration-300 ease-out',
              type === 'expense'
                ? 'left-1 bg-red-500'
                : 'left-[50%] bg-emerald-500'
            )}
          />
          {(['expense', 'income'] as const).map((t) => {
            const Icon = t === 'income' ? TrendingUp : TrendingDown;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setValue('type', t)}
                className={cn(
                  'relative flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold z-10 transition-colors duration-200 rounded-lg cursor-pointer',
                  type === t
                    ? 'text-white'
                    : 'text-gray-500 dark:text-sage-400 hover:text-gray-700 dark:hover:text-sage-300'
                )}
              >
                <Icon size={14} />
                {t === 'income' ? 'Gelir' : 'Gider'}
              </button>
            );
          })}
        </div>
        <input type="hidden" {...register('type')} />

        {/* Amount with inline ₺ */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-sage-200 uppercase tracking-wide">
            Tutar
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 dark:text-sage-500 pointer-events-none select-none">
              ₺
            </span>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              className={cn(
                'w-full rounded-xl border border-gray-200 dark:border-sage-700 bg-gray-50 dark:bg-sage-800/60',
                'pl-8 pr-3.5 py-2.5 text-sm text-gray-900 dark:text-sage-100 placeholder:text-gray-400 dark:placeholder:text-sage-600',
                'focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-400 dark:focus:border-sage-400',
                'hover:border-gray-300 dark:hover:border-sage-600 transition-all duration-150',
                errors.amount && 'border-red-400 dark:border-red-500 focus:ring-red-400/40 focus:border-red-400'
              )}
              {...register('amount')}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.amount.message}</p>
          )}
        </div>

        {/* Category + Date in 2-col grid */}
        <div className="grid grid-cols-2 gap-3">
          <Select label="Kategori" error={errors.categoryId?.message} {...register('categoryId')}>
            <option value="">Seçin...</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </Select>
          <Input
            label="Tarih"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        <Input
          label="Açıklama (isteğe bağlı)"
          type="text"
          placeholder="İşlem açıklaması..."
          {...register('description')}
        />

        {/* Payment method icon buttons */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-sage-200 uppercase tracking-wide">
            Ödeme Yöntemi
          </label>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.onChange(field.value === value ? undefined : value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-all duration-150 cursor-pointer',
                      field.value === value
                        ? 'border-sage-400 bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 shadow-sm'
                        : 'border-gray-200 dark:border-sage-700 bg-gray-50 dark:bg-sage-800/60 text-gray-500 dark:text-sage-400 hover:border-gray-300 dark:hover:border-sage-600 hover:text-gray-700 dark:hover:text-sage-300'
                    )}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Recurring toggle switch */}
        <div
          className={cn(
            'rounded-xl border transition-all duration-200 overflow-hidden',
            isRecurring
              ? 'border-sage-200 dark:border-sage-800/50 bg-sage-50/50 dark:bg-sage-950/20'
              : 'border-gray-100 dark:border-sage-800'
          )}
        >
          <Controller
            name="isRecurring"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    'relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50',
                    field.value ? 'bg-sage-400' : 'bg-gray-300 dark:bg-sage-700'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
                      field.value && 'translate-x-4'
                    )}
                  />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-sage-300">
                    Tekrarlayan işlem
                  </p>
                  {field.value && (
                    <p className="text-xs text-sage-500 dark:text-sage-400 mt-0.5">
                      Otomatik tekrarlanacak
                    </p>
                  )}
                </div>
                <RefreshCw
                  size={14}
                  className={cn(
                    'transition-colors duration-200',
                    field.value ? 'text-sage-400' : 'text-gray-400 dark:text-sage-600'
                  )}
                />
              </label>
            )}
          />
          {isRecurring && (
            <div className="px-4 pb-4 -mt-1">
              <Select label="Tekrar Periyodu" {...register('recurringPeriod')}>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
                <option value="yearly">Yıllık</option>
              </Select>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            İptal
          </Button>
          <LiquidButton
            type="submit"
            size="lg"
            className={cn(
              'flex-1 font-semibold',
              type === 'income'
                ? 'text-emerald-700 dark:text-emerald-200'
                : 'text-red-700 dark:text-red-200'
            )}
          >
            {transaction ? 'Güncelle' : 'Kaydet'}
          </LiquidButton>
        </div>
      </form>
    </Modal>
  );
}
