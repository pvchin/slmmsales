import React, { useState, useMemo } from 'react';
import currency from 'currency.js';
import { format } from 'date-fns';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  //ModalHeader,
  //ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import {
  purchaseState,
  purchasedetlsState,
  editPurchaseIdState,
  editPurchaseDetlsIdState,
} from '../data/atomdata';
import { formatPrice } from '../helpers/utils';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import CustomDataTable from '../helpers/CustomDataTable';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
//import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { usePurchases } from '../react-query/purchases/usePurchases';
import { useAddPurchase } from '../react-query/purchases/useAddPurchase';
import { useDeletePurchase } from '../react-query/purchases/useDeletePurchase';
import { useUpdatePurchase } from '../react-query/purchases/useUpdatePurchase';
import { usePurchasesDetls } from '../react-query/purchasesdetls/usePurchasesDetls';
import CustomReactTable from '../helpers/CustomReactTable';
import { branch } from '../utils/constants';
import PurchaseForm from './PurchaseForm';

const initial_purchase = {
  po_no: '',
  po_date: dayjs().format('YYYY-MM-DD'),
  po_type: 'Purchase',
  po_suppno: '',
  po_supp: '',
  po_add1: '',
  po_add2: '',
  po_add3: '',
  po_add4: '',
  po_term: '',
  po_invno: '',
  po_branch: branch,
  po_remark: '',
  po_post: '0',
  po_print: '',
  po_subtotal: 0,
  po_disc: 0,
  po_nettotal: 0,
  po_layout: 'Item',
  po_postdate: dayjs().format('YYYY-MM-DD'),
  po_glcode: '',
  po_dodate: dayjs().format('YYYY-MM-DD'),
  po_invdate: dayjs().format('YYYY-MM-DD'),
  po_recdate: dayjs().format('YYYY-MM-DD'),
  po_sono: '',
  po_createdby: '',
  po_updby: '',
  po_createddate: dayjs().format('YYYY-MM-DD'),
  po_createdtime: '',
  po_upddate: dayjs().format('YYYY-MM-DD'),
  po_updtime: '',
};

const PurchasesTable = () => {
  const navigate = useNavigate();
  const { purchases, setPOSuppno } = usePurchases();
  const addPurchase = useAddPurchase();
  const deletePurchase = useDeletePurchase();
  const updatePurchase = useUpdatePurchase();
  const { purchasesdetls, setPONo } = usePurchasesDetls();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [invoice, setInvoice] = useRecoilState(purchaseState);
  const [invoicedetls, setInvoicedetls] = useRecoilState(purchasedetlsState);
  const [editInvoiceId, setEditInvoiceId] = useRecoilState(editPurchaseIdState);
  const [editInvoicedetlsId, setEditInvoicedetlsId] = useRecoilState(
    editPurchaseDetlsIdState
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isPOOpen,
    onOpen: onPOOpen,
    onClose: onPOClose,
  } = useDisclosure();

  const filteredData = purchases.filter(
    item =>
      item.po_no && item.po_no.toLowerCase().includes(filterText.toLowerCase())
  );

  const title = 'Purchases';

  const columns = useMemo(
    () => [
      {
        header: 'PO No',
        accessorKey: 'po_no',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'PO Date',
        accessorKey: 'po_date',
        //size: 200,
        /*  Cell: ({ cell }) => (
          <div>{format(new Date(cell.rcp_date), 'dd/MM/yyyy')}</div>
        ), */
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Invoice No',
        accessorFn: row => row.po_invno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Invoice Date',
        accessorFn: row => row.po_invdate,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'Type',
        accessorFn: row => row.po_type,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Layout',
        accessorFn: row => row.po_layout,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.po_nettotal,
        //size: 200,
        Cell: ({ cell }) =>
          cell.getValue()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'Supplier',
        accessorFn: row => row.po_supp,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Status',
        accessorFn: row => {
          switch (row.po_post) {
            case '0':
              return <div>Open</div>;
            case '1':
              return <div>Posted</div>;
            case 'D':
              return <div>Deleted</div>;
            default:
              return null;
          }
        },
        size: 120,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    deletePurchase(state);
  };

  const handleAddPurchase = () => {
    setEditInvoiceId(
      prev => (prev = { id: '', batchno: '', layout: 'Item', status: 'add' })
    );
    setInvoice(prev => (prev = { ...initial_purchase }));
    setInvoicedetls(
      prev => (prev = purchasesdetls.filter(r => r.pl_pono === ''))
    );
    navigate('/purchaseinvoice');
  };

  const handleEditPurchase = row => {
    const { original } = row;
    const { po_id, po_no, po_layout } = original;
    setEditInvoiceId(
      prev =>
        (prev = { id: po_id, no: po_no, layout: po_layout, status: 'edit' })
    );
    setInvoice(prev => (prev = { ...prev, ...original }));
    setEditInvoicedetlsId(prev => (prev = { ...prev, id: po_id, no: po_no }));
    setInvoicedetls(prev => purchasesdetls.filter(r => r.pl_pono === po_no));
    navigate('/purchaseinvoice');
  };

  const handleDeletePurchase = row => {
    const { original } = row;
    setState(prev => (prev = { ...original }));
    onAlertDeleteOpen();
  };

  const add_Purchase = data => {
    addPurchase(data);
  };

  const update_Purchase = data => {
    updatePurchase(data);
    onPOClose();
  };

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderRadius={15}
        borderColor="teal.800"
        overflow="auto"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={purchases}
          initialState={{ sorting: [{ id: 'po_date', desc: true }] }}
          handleAdd={handleAddPurchase}
          handleEdit={handleEditPurchase}
          handleDelete={handleDeletePurchase}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isPOOpen}
        onClose={onPOClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <PurchaseForm
              state={state}
              setState={setState}
              add_Purchase={add_Purchase}
              update_Purchase={update_Purchase}
              statustype={statustype}
              onPOClose={onPOClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Purchase"
      >
        <Heading size="md">
          Are you sure you want to delete this purchase {state.po_no}{' '}
          {state.po_supplier} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default PurchasesTable;
