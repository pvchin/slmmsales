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
  paymentState,
  paymentdetlsState,
  editPaymentIdState,
  editPaymentDetlsIdState,
} from '../data/atomdata';
import { formatPrice } from '../helpers/utils';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import CustomDataTable from '../helpers/CustomDataTable';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
//import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { usePayments } from '../react-query/payments/usePayments';
import { useAddPayment } from '../react-query/payments/useAddPayment';
import { useUpdatePayment } from '../react-query/payments/useUpdatePayment';
import { useDeletePayment } from '../react-query/payments/useDeletePayment';
import { usePaymentsDetls } from '../react-query/paymentsdetls/usePaymentsDetls';
import CustomReactTable from '../helpers/CustomReactTable';
import { branch } from '../utils/constants';
import PaymentForm from './PaymentForm';

const initial_payment = {
  pay_no: '',
  pay_date: dayjs().format('YYYY-MM-DD'),
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
  pay_glname: '',
  pay_branch: branch,
};

const PaymentsTable = () => {
  const navigate = useNavigate();
  const { payments, setPaySuppno } = usePayments();
  const addPayment = useAddPayment();
  const deletePayment = useDeletePayment();
  const updatePayment = useUpdatePayment();
  const { paymentsdetls, setPayno } = usePaymentsDetls();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [invoice, setInvoice] = useRecoilState(paymentState);
  const [invoicedetls, setInvoicedetls] = useRecoilState(paymentdetlsState);
  const [editInvoiceId, setEditInvoiceId] = useRecoilState(editPaymentIdState);
  const [editInvoicedetlsId, setEditInvoicedetlsId] = useRecoilState(
    editPaymentDetlsIdState
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  const filteredData = payments.filter(
    item =>
      item.pay_no &&
      item.pay_no.toLowerCase().includes(filterText.toLowerCase())
  );

  const title = 'Payments';

  const columns = useMemo(
    () => [
      {
        header: 'Payment No',
        accessorFn: row => row.pay_no,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Payment Date',
        accessorFn: row => row.pay_date,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Supp No',
        accessorFn: row => row.pay_suppno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Supplier',
        accessorFn: row => row.pay_supplier,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.pay_nettotal,
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
        accessorFn: row => row.pay_supplier,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Status',
        accessorFn: row => {
          switch (row.pay_post) {
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
    deletePayment(state);
  };

  const handleAddPayment = () => {
    setEditInvoiceId(prev => (prev = { id: '', batchno: '', status: 'add' }));
    setInvoice(prev => (prev = { ...initial_payment }));
    setInvoicedetls(
      prev => (prev = paymentsdetls.filter(r => r.payd_no === ''))
    );
    navigate('/paymentform');
  };

  const handleEditPayment = row => {
    const { original } = row;
    const { pay_id, pay_no } = original;

    setPayno(prev => (prev = pay_no));
    setEditInvoiceId(
      prev => (prev = { id: pay_id, no: pay_no, status: 'edit' })
    );
    setInvoice(prev => (prev = { ...prev, ...original }));
    setEditInvoicedetlsId(prev => (prev = { ...prev, id: pay_id, no: pay_no }));
    setInvoicedetls(
      prev => (prev = paymentsdetls.filter(r => r.payd_no === pay_no))
    );

    navigate('/paymentform');
  };

  const handleDeletePayment = row => {
    const { original } = row;
    setState(prev => (prev = { ...original }));
    onAlertDeleteOpen();
  };

  const add_Payment = data => {
    addPayment(data);
  };

  const update_Payment = data => {
    updatePayment(data);
    onFormClose();
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
          data={payments}
          handleAdd={handleAddPayment}
          handleEdit={handleEditPayment}
          handleDelete={handleDeletePayment}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isFormOpen}
        onClose={onFormClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <PaymentForm
              state={state}
              setState={setState}
              add_Payment={add_Payment}
              update_Payment={update_Payment}
              statustype={statustype}
              onFormClose={onFormClose}
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
        title="Delete Payment"
      >
        <Heading size="md">
          Are you sure you want to delete this purchase {state.po_no}{' '}
          {state.po_supplier} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default PaymentsTable;
