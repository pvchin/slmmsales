export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/',
    sublabel: false,
  },
  {
    label: 'Inventory',
    sublabel: true,
    children: [
      {
        label: 'Items',
        subLabel: '',
        href: '/items',
      },
      {
        label: 'Transactions',
        subLabel: '',
        href: '/trans',
      },
      {
        label: 'Adjustment',
        subLabel: '',
        href: '/transadjust',
      },
      {
        label: 'Items History',
        subLabel: '',
        href: 'itemhistory',
      },
    ],
  },
  {
    label: 'Receivable',
    sublabel: true,
    children: [
      {
        label: 'Customers',
        subLabel: '',
        href: '/customers',
      },
      {
        label: 'Invoices',
        subLabel: '',
        href: '/sales',
      },
      {
        label: 'Statement',
        subLabel: '',
        href: '/customerstatement',
      },
      {
        label: 'Receipts',
        subLabel: '',
        href: '/receipts',
      },
    ],
  },
  {
    label: 'Payable',
    sublabel: true,
    children: [
      {
        label: 'Suppliers',
        subLabel: '',
        href: '/suppliers',
      },
      {
        label: 'Purchases',
        subLabel: '',
        href: '/purchases',
      },
      {
        label: 'Statement',
        subLabel: '',
        href: '/supplierstatement',
      },
      {
        label: 'Payments',
        subLabel: '',
        href: '/payments',
      },
    ],
  },
  {
    label: 'Tables',
    sublabel: true,
    children: [
      {
        label: 'GL Accounts',
        subLabel: '',
        href: '/accounts',
      },
      {
        label: 'Category',
        subLabel: '',
        href: '/tables',
      },
      {
        label: 'Item Groups',
        subLabel: '',
        href: '/itemgroups',
      },
    ],
  },
  // {
  //   label: 'Settings',
  //   href: '/settings',
  //   sublabel: false,
  // },
];
