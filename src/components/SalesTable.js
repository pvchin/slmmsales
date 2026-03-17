import React, { useState, useMemo } from 'react';
import currency from 'currency.js';
import { format } from 'date-fns';
import dayjs from 'dayjs';
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
  salesState,
  salesdetlsState,
  editSalesIdState,
  editSalesDetlsIdState,
} from '../data/atomdata';
import { formatPrice } from '../helpers/utils';
import { useNavigate } from 'react-router-dom';
import CustomDataTable from '../helpers/CustomDataTable';
import { branch } from '../utils/constants';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
//import { AiFillEdit, AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useSales } from '../react-query/sales/useSales';
import { useAddSales } from '../react-query/sales/useAddSales';
import { useDeleteSales } from '../react-query/sales/useDeleteSales';
import { useUpdateSales } from '../react-query/sales/useUpdateSales';
import { useSalesDetls } from '../react-query/salesdetls/useSalesDetls';
import CustomReactTable from '../helpers/CustomReactTable';
import SalesForm from './SalesForm';

const initial_sales = {
  sls_no: '',
  sls_date: dayjs().format('YYYY-MM-DD'),
  sls_so: '',
  sls_remark: '',
  sls_term: '',
  sls_duedate: null,
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
  sls_post: '0',
  sls_type: 'INVOICE',
  sls_shipfrom: '',
  sls_shipmenttype: '',
  sls_postdate: null,
  sls_layout: 'Item',
  sls_glcode: '',
  sls_branch: branch,
  sls_createdby: '',
  sls_updby: '',
  sls_createddate: dayjs().format('YYYY-MM-DD'),
  sls_createdtime: '',
  sls_upddate: null,
  sls_updtime: '',
  sls_oref: '',
  sls_yref: '',
  sls_smno: '',
  sls_area: '',
};

const SalesTable = () => {
  const navigate = useNavigate();
  const { sales, setSalesCustno } = useSales();
  const addSales = useAddSales();
  const deleteSales = useDeleteSales();
  const updateSales = useUpdateSales();
  const { salesdetls, setSalesInvNo } = useSalesDetls();
  const [state, setState] = useState({});
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');
  const [invoice, setInvoice] = useRecoilState(salesState);
  const [invoicedetls, setInvoicedetls] = useRecoilState(salesdetlsState);
  const [editInvoiceId, setEditInvoiceId] = useRecoilState(editSalesIdState);
  const [editInvoicedetlsId, setEditInvoicedetlsId] = useRecoilState(
    editSalesDetlsIdState
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isSalesOpen,
    onOpen: onSalesOpen,
    onClose: onSalesClose,
  } = useDisclosure();

  const filteredData = sales.filter(
    item =>
      item.sls_no &&
      item.sls_no.toLowerCase().includes(filterText.toLowerCase())
  );

  const title = 'Sales';

  const columns = useMemo(
    () => [
      {
        header: 'Invoice No',
        accessorFn: row => row.sls_no,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Doc Date',
        accessorFn: row => row.sls_date,
        //size: 200,
        /*   Cell: ({ cell }) =>
          dayjs(cell.getValue().toLocaleDateString()).format('DD-MMM-YYYY'), */
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Type',
        accessorFn: row => row.sls_type,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Layout',
        accessorFn: row => row.sls_layout,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.sls_total,
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
        header: 'Customer',
        accessorFn: row => row.sls_cust,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Salesman',
        accessorFn: row => row.sls_smno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Area',
        accessorFn: row => row.sls_area,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Status',
        accessorFn: row => {
          switch (row.sls_post) {
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
    deleteSales(state);
  };

  const handleAddSales = () => {
    setEditInvoiceId(
      prev => (prev = { id: '', batchno: '', layout: '', status: 'add' })
    );
    setInvoice(prev => (prev = { ...initial_sales }));
    setInvoicedetls(prev => (prev = salesdetls.filter(r => r.sld_no === '')));
    navigate('/salesinvoice');
  };

  const handleEditSales = row => {
    const { original } = row;
    const { sls_id, sls_no, sls_layout } = original;
    setEditInvoiceId(
      prev =>
        (prev = { id: sls_id, no: sls_no, layout: sls_layout, status: 'edit' })
    );
    setInvoice(prev => (prev = { ...prev, ...original }));
    setEditInvoicedetlsId(prev => (prev = { ...prev, id: sls_id, no: sls_no }));
    setInvoicedetls(prev => salesdetls.filter(r => r.sld_no === sls_no));
    navigate('/salesinvoice');
  };

  const handleDeleteSales = row => {
    const { original } = row;
    setState(prev => (prev = { ...original }));
    onAlertDeleteOpen();
  };

  const add_Sales = data => {
    addSales(data);
  };

  const update_Sales = data => {
    updateSales(data);
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
          data={sales}
          //initialState={initialReactTableState}
          handleAdd={handleAddSales}
          handleEdit={handleEditSales}
          handleDelete={handleDeleteSales}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSalesOpen}
        onClose={onSalesClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <SalesForm
              state={state}
              setState={setState}
              add_Sales={add_Sales}
              update_Sales={update_Sales}
              statustype={statustype}
              onSalesClose={onSalesClose}
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
        title="Delete Sales"
      >
        <Heading size="md">
          Are you sure you want to delete this sales {state.oei_invno}{' '}
          {state.oei_cust} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default SalesTable;
