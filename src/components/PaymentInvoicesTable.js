import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import currency from 'currency.js';
import {
  Box,
  Flex,
  Heading,
  Icon,
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
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import CustomDataTable from '../helpers/CustomDataTable';
import { useRecoilState } from 'recoil';
import {
  paymentState,
  paymentdetlsState,
  editPaymentIdState,
  editPaymentDetlsIdState,
} from '../data/atomdata';
import { usePaymentsDetls } from '../react-query/purchasesdetls/usePurchasesDetls';

const PaymentInvoicesTable = ({
  batchdetlsstate,
  setBatchDetlsState,
  handleAddBatchDetls,
  handleDeleteBatchDetls,
  handleEditBatchDetls,
  handleRowDoubleClick,
}) => {
  //const navigate = useNavigate();
  //const { samplesbatchdetls, setBatchDetlsId } = useSamplesBatchDetls();
  //const [batchdetls, setBatchDetls] = useState();
  //const [state, setState] = useState({});
  //const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = useState('');
  const [editBatchId, setEditBatchId] = useRecoilState(editPaymentIdState);
  
  // const [singleSampleBatch, setSingleSampleBatch] = useRecoilState(
  //   singleSampleBatchState
  // );
  // const [singleSampleBatchDetls, setSingleSampleBatchDetls] = useRecoilState(
  //   singleSampleBatchDetlsState
  // );

  console.log('editbatch', editBatchId);

  const filteredData = batchdetlsstate.filter(
    item =>
      !item.ap_paid &&
      item.ap_suppno &&
      item.ap_suppno.toLowerCase().includes(filterText.toLowerCase())
  );

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isBatchDetlsOpen,
    onOpen: onBatchDetlsOpen,
    onClose: onBatchDetlsClose,
  } = useDisclosure();

  const titles = 'Outstanding Invoices Table';

  const columns = [
    // {
    //   id: 1,
    //   key: 'addaction',
    //   text: 'Action',
    //   align: 'center',
    //   sortable: false,
    //   width: '60px',

    //   cell: record => {
    //     return (
    //       <>
    //         <IconButton
    //           size="sm"
    //           icon={<AiOutlinePlus />}
    //           onClick={() => {
    //             handleAddCust(record);
    //           }}
    //         ></IconButton>
    //       </>
    //     );
    //   },
    // },
    // {
    //   id: 2,
    //   key: 'editaction',
    //   text: 'Action',
    //   sortable: false,
    //   width: '60px',
    //   cell: record => {
    //     return (
    //       <>
    //         <IconButton
    //           icon={<AiFillEdit />}
    //           size="sm"
    //           onClick={() => {
    //             handleEditItem(record);
    //           }}
    //         ></IconButton>
    //       </>
    //     );
    //   },
    // },
    // {
    //   id: 3,
    //   key: 'deleteaction',
    //   text: 'Action',
    //   width: '60px',
    //   sortable: false,
    //   cell: record => {
    //     return (
    //       <>
    //         <IconButton
    //           icon={<AiFillDelete />}
    //           size="sm"
    //           onClick={() => {
    //             handleDeleteItem(record);
    //           }}
    //         />
    //       </>
    //     );
    //   },
    // },
    {
      id: 1,
      name: 'Invoice No',
      selector: row => row.ap_invno,
      sortable: true,
      filterable: true,
      width: '150px',
    },
    {
      id: 2,
      name: 'PO No',
      selector: row => row.ap_pono,
      sortable: true,
      filterable: true,
      width: '150px',
    },
    {
      id: 3,
      name: 'Inv Date',
      selector: row => row.ap_invdate,
      sortable: true,
      filterable: true,
      width: '120px',
    },
    {
      id: 4,
      name: 'PO Date',
      selector: row => row.ap_podate,
      sortable: true,
      filterable: true,
      width: '120px',
    },
    {
      id: 5,
      name: 'Type',
      selector: row => row.ap_type,
      sortable: true,
      filterable: true,
      width: '120px',
    },
    {
      id: 6,
      name: 'Supp No',
      selector: row => row.ap_suppno,
      sortable: true,
      filterable: true,
      width: '120px',
    },
    {
      id: 7,
      name: 'Supplier',
      selector: row => row.ap_supplier,
      minWidth: '150px',
      sortable: true,
      filterable: true,
      align: 'left',
      wrap: false,
      cell: row => (
        <div style={{ overflow: 'hidden', textAlign: 'left' }}>
          {row.ap_supplier}
        </div>
      ),
    },
    {
      id: 8,
      name: 'Amount',
      selector: row => row.ap_nettotal_amt,
      width: '120px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.ap_nettotal_amt).format()}</div>,
    },
    {
      id: 9,
      name: 'Bal Due',
      selector: row => row.ap_balance,
      width: '120px',
      sortable: true,
      right: true,
      cell: row => <div>{currency(row.ap_balance).format()}</div>,
    },
    {
      id: 10,
      name: 'Paid',
      selector: row => {
        return row.ap_paid ? (
          <Icon as={GrCheckboxSelected} w={6} h={6} />
        ) : (
          <Icon as={GrCheckbox} w={6} h={6} />
        );
      },
      sortable: true,
      filterable: true,
      width: '100px',
      align: 'center',
    },
    {
      id: 11,
      name: 'Branch',
      selector: row => row.ap_branch,
      sortable: true,
      filterable: true,
      width: '100px',
    },
  
  ];

  // const columns_others = [
  //   {
  //     id: 1,
  //     key: 'editaction',
  //     text: 'Action',
  //     sortable: false,
  //     width: '60px',
  //     cell: record => {
  //       return (
  //         <>
  //           <IconButton
  //             icon={<EditIcon />}
  //             size="sm"
  //             onClick={() => {
  //               handleEditBatchDetls(record);
  //             }}
  //           ></IconButton>
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     id: 2,
  //     key: 'deleteaction',
  //     text: 'Action',
  //     width: '60px',
  //     sortable: false,
  //     cell: record => {
  //       return (
  //         <>
  //           <IconButton
  //             icon={<DeleteIcon />}
  //             size="sm"
  //             onClick={() => {
  //               handleDeleteBatchDetls(record);
  //             }}
  //           />
  //         </>
  //       );
  //     },
  //   },

  //   {
  //     id: 5,
  //     name: 'Description',
  //     selector: row => row.pl_desp,
  //     //minWidth: '200px',
  //     sortable: true,
  //     filterable: true,
  //     align: 'left',
  //     wrap: false,
  //     cell: row => (
  //       <div style={{ overflow: 'hidden', textAlign: 'left' }}>
  //         {row.pl_desp}
  //       </div>
  //     ),
  //   },

  //   {
  //     id: 10,
  //     name: 'Amount',
  //     selector: row => row.pl_excost || 0,
  //     width: '200px',
  //     sortable: true,
  //     filterable: true,
  //   },
  // ];

  const handleSelectedRowChange = (data) => {
    console.log('row change', data)
  }

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={10}
        overflow="auto"
      >
        <CustomDataTable
          title={titles}
          columns={columns}
          filteredData={filteredData}
          handleAddRec={handleAddBatchDetls}
          filterText={filterText}
          setFilterText={setFilterText}
          filterbyname="filter by item description"
          defaultSortFieldId="5"
          defaultSortAsc={true}
          hideAddRec
          selectableRows={false}
          onSelectedRowsChange={handleSelectedRowChange}
          handleRowDoubleClick={handleRowDoubleClick}
        />
      </Box>
    </Flex>
  );
};

export default PaymentInvoicesTable;
