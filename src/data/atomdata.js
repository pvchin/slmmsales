import { atom } from 'recoil';
import dayjs from 'dayjs';

export const searchCustState = atom({
  key: 'searchCust',
  default: {
    c_custno: '',
    c_cust: '',
    c_add1: '',
    c_add2: '',
    c_add3: '',
    c_add4: '',
    c_phone: '',
    c_email: '',
    c_fax: '',
    c_contact: '',
    c_area: '',
  },
});

export const searchitemState = atom({
  key: 'searchitem',
  default: {
    item_id: '',
    item_code: '',
    item_desp: '',
    item_packing: '',
    item_unit: '',
    item_category: '',
    item_brand: '',
    item_uprice_pc: 0,
  },
});

export const salesState = atom({
  key: 'sales',
  default: {
    sls_no: '',
    sls_date: '',
    sls_so: '',
    sls_remark: '',
    sls_term: 0,
    sls_duedate: '',
    sls_custno: '',
    sls_cust: '',
    sls_add1: '',
    sls_add2: '',
    sls_add3: '',
    sls_add4: '',
    sls_subtotal: 0,
    sls_disc: 0,
    sls_freight: 0,
    sls_total: 0,
    sls_post: '',
    sls_type: '',
    sls_shipfrom: '',
    sls_shipmenttype: '',
    sls_postdate: '',
    sls_layout: '',
    sls_glcode: '',
    sls_branch: '',
    sls_createdby: '',
    sls_updby: '',
    sls_createddate: '',
    sls_createdtime: '',
    sls_upddate: '',
    sls_updtime: '',
    sls_oref: '',
    sls_yref: '',
    sls_smno: '',
    sls_area: '',
  },
});

export const salesdetlsState = atom({
  key: 'salesdetls',
  default: {
    sld_id: '',
    sld_no: '',
    sld_type: '',
    sld_itemno: '',
    sld_desp: '',
    sld_brand: '',
    sld_packing: '',
    sld_pfactor: 0,
    sld_unit: '',
    sld_qty: 0,
    sld_price: 0,
    sld_total: 0,
    sld_acc: '',
    sld_order: 0,
    sld_sitemno: '',
    sld_branch: '',
    sld_ucost: 0,
    sld_itemtype: '',
    sld_error: false,
  },
});

export const editSalesIdState = atom({
  key: 'editSalesState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editSalesDetlsIdState = atom({
  key: 'editSalesDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const purchaseState = atom({
  key: 'purchase',
  default: {
    po_id: '',
    po_no: '',
    po_date: '',
    po_type: '',
    po_suppno: '',
    po_supp: '',
    po_add1: '',
    po_add2: '',
    po_add3: '',
    po_add4: '',
    po_term: '',
    po_invno: '',
    po_branch: '',
    po_remark: '',
    po_post: '',
    po_print: '',
    po_subtotal: 0,
    po_disc: 0,
    po_nettotal: 0,
    po_layout: '',
    po_postdate: '',
    po_glcode: '',
    po_dodate: '',
    po_invdate: '',
    po_recdate: '',
    po_sono: '',
    po_createdby: '',
    po_updby: '',
    po_createddate: '',
    po_createdtime: '',
    po_upddate: '',
    po_updtime: '',
  },
});

export const purchasedetlsState = atom({
  key: 'purchasedetls',
  default: {
    pl_id: '',
    pl_pono: '',
    pl_type: '',
    pl_itemno: '',
    pl_desp: '',
    pl_brand: '',
    pl_packing: '',
    pl_pfactor: 1,
    pl_unit: '',
    pl_qty: 0,
    pl_ucost: 0,
    pl_netucost: 0,
    pl_disc: 0,
    pl_excost: 0,
    pl_remark: '',
    pl_order: 0,
    pl_branch: '',
    pl_uoldcost: 0,
  },
});

export const editPurchaseIdState = atom({
  key: 'editPurchaseIdState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editPurchaseDetlsIdState = atom({
  key: 'editPurchaseDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const paymentState = atom({
  key: 'payment',
  default: {
    pay_id: '',
    pay_no: '',
    pay_date: null,
    pay_bank: '',
    pay_refno: '',
    pay_remark: '',
    pay_suppno: '',
    pay_supplier: '',
    pay_total: 0,
    pay_disc: 0,
    pay_nettotal: 0,
    pay_post: '0',
    pay_glcode: '',
    pay_branch: 'HQ',
  },
});

export const paymentdetlsState = atom({
  key: 'paymentdetls',
  default: {
    payd_id: '',
    payd_no: '',
    payd_invno: '',
    payd_invdate: null,
    payd_pono: '',
    payd_podate: null,
    payd_invamt: 0,
    payd_last_bal: 0,
    payd_disc: 0,
    payd_amt: 0,
    payd_apid: 0,
    payd_recdate: null,
    payd_branch: '',
    payd_paydate: null,
  },
});

export const editPaymentIdState = atom({
  key: 'editPaymentState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editPaymentDetlsIdState = atom({
  key: 'editPaymentDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const receiptState = atom({
  key: 'receipt',
  default: {
    rcp_id: '',
    rcp_no: '',
    rcp_date: null,
    rcp_bank: '',
    rcp_refno: '',
    rcp_remark: '',
    rcp_custno: '',
    rcp_customer: '',
    rcp_total: 0,
    rcp_disc: 0,
    rcp_nettotal: 0,
    rcp_post: '0',
    rcp_branch: 'HQ',
  },
});

export const receiptdetlsState = atom({
  key: 'receiptdetls',
  default: {
    rcpd_id: '',
    rcpd_no: '',
    rcpd_invno: '',
    rcpd_invdate: null,
    rcpd_invamt: 0,
    rcpd_last_bal: 0,
    rcpd_disc: 0,
    rcpd_amt: 0,
    rcpd_arid: 0,
    rcpd_branch: '',
    rcpd_recdate: null,
  },
});

export const editReceiptIdState = atom({
  key: 'editReceiptState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editReceiptDetlsIdState = atom({
  key: 'editReceiptDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const arStatementState = atom({
  key: 'arStatementState',
  default: {
    ar_custno: '',
    ar_cust: '',
    ar_add1: '',
    ar_add2: '',
    ar_add3: '',
    ar_add4: '',
  },
});

export const arStatementDetlsState = atom({
  key: 'arStatementDetlsState',
  default: {
    ar_invno: '',
    ar_invdate: '',
    ar_custno: '',
    ar_type: '',
    ar_total: 0,
    ar_paid_amt: 0,
    ar_balance: 0,
    ar_paid: false,
    ar_branch: '',
  },
});

export const itemState = atom({
  key: 'itemState',
  default: {
    item_no: '',
    item_group: '',
    item_desp: '',
    item_packing: '',
    item_category: '',
    item_unit: '',
    item_brand: '',
    item_dept: '',
    item_smcode: '',
    item_package: '',
    item_warehouse: false,
    item_type: '',
    item_nonstock: '',
    item_location: '',
    item_prtreptlabel: false,
    item_inactive: false,
    item_lock: false,
    item_branch: '',
    item_qoh_pc: 0,
    item_qoh_ctn: 0,
    item_ucost_pc: 0,
    item_ucost_ctn: 0,
    item_onorder_pc: 0,
    item_onorder_ctn: 0,
    item_uprice_pc: 0,
    item_uprice_ctn: 0,
    item_remark: '',
    item_pfactor: 1,
    item_outlet_pc: 0,
    item_outlet_ctn: 0,
    item_offeruprice: 0,
    item_cooluprice: 0,
    item_minlvlqty: 0,
    item_suppno: '',
    item_supplier: '',
    item_openqty: 0,
    item_openamt: 0,
    item_updated: null,
    item_lastsalesdate: null,
    item_lastpodate: null,
    item_lastpoqty: 0,
    item_lastsalesqty: 0,
    item_olducost: 0,
    item_memuprice: 0,
    item_allowposaddon: false,
  },
});
export const tranState = atom({
  key: 'transaction',
  default: {
    t_id: '',
    t_no: '',
    t_date: dayjs().format('YYYY-MM-DD'),
    t_type: '',
    t_docno: '',
    t_docdate: dayjs().format('YYYY-MM-DD'),
    t_scno: '',
    t_sc: '',
    t_add1: '',
    t_add2: '',
    t_add3: '',
    t_add4: '',
    t_term: '',
    t_branch: '',
    t_remark: '',
    t_post: '',
    t_print: '',
    t_subtotal: 0,
    t_disc: 0,
    t_nettotal: 0,
    t_layout: '',
    t_postdate: dayjs().format('YYYY-MM-DD'),
    t_glcode: '',
    t_recdate: dayjs().format('YYYY-MM-DD'),
    t_createdby: '',
    t_updby: '',
    t_createddate: dayjs().format('YYYY-MM-DD'),
    t_createdtime: '',
    t_upddate: dayjs().format('YYYY-MM-DD'),
    t_updtime: '',
  },
});

export const trandetlsState = atom({
  key: 'trandetls',
  default: {
    tl_id: '',
    tl_pono: '',
    tl_type: '',
    tl_itemno: '',
    tl_desp: '',
    tl_brand: '',
    tl_packing: '',
    tl_pfactor: 1,
    tl_unit: '',
    tl_qty: 0,
    tl_ucost: 0,
    tl_netucost: 0,
    tl_disc: 0,
    tl_excost: 0,
    tl_remark: '',
    tl_order: 0,
    tl_branch: '',
    tl_uoldcost: 0,
  },
});

export const editTranIdState = atom({
  key: 'editTranIdState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editTranDetlsIdState = atom({
  key: 'editTranDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});

export const tranadjustState = atom({
  key: 'tranadjustState',
  default: {
    ta_id: '',
    ta_batchno: '',
    ta_date: dayjs().format('YYYY-MM-DD'),
    ta_type: '',
    ta_userid: '',
    ta_user: '',
    ta_remark: '',
    ta_post: '',
    ta_branch: '',
  },
});

export const tranadjustdetlsState = atom({
  key: 'tranadjustdetls',
  default: {
    tad_id: '',
    tad_batchno: '',
    tad_itemno: '',
    tad_desp: '',
    tad_packing: '',
    tad_qtyonhand: 1,
    tad_qtycount: 0,
    tad_qtyadjust: 0,
    tad_branch: '',
  },
});

export const editTranadjustIdState = atom({
  key: 'editTranAdjustIdState',
  default: {
    id: '',
    no: '',
    status: '',
    layout: '',
  },
});

export const editTranadjustDetlsIdState = atom({
  key: 'editTranAdjustDetlsIdState',
  default: {
    id: '',
    no: '',
  },
});
