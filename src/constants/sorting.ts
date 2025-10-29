export interface SortOptionDef {
  value: string
  labelKey: string
}

export interface SortGroup {
  key: string
  labelKey: string
  options: SortOptionDef[]
}

export const SORT_GROUPS: SortGroup[] = [
  {
    key: 'name',
    labelKey: 'sort.name',
    options: [
      { value: 'name_asc', labelKey: 'sort.nameAsc' },
      { value: 'name_desc', labelKey: 'sort.nameDesc' },
    ],
  },
  {
    key: 'next_payment',
    labelKey: 'sort.nextPayment',
    options: [
      { value: 'payment_old_new', labelKey: 'sort.paymentOldNew' },
      { value: 'payment_new_old', labelKey: 'sort.paymentNewOld' },
    ],
  },
  {
    key: 'subscription',
    labelKey: 'sort.subscription',
    options: [
      { value: 'sub_high_low', labelKey: 'sort.subHighLow' },
      { value: 'sub_low_high', labelKey: 'sort.subLowHigh' },
    ],
  },
]

export type { SortGroup as SortGroupType }

