import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import CustomReactTable from '../helpers/CustomReactTable';
import { useRecoilState } from 'recoil';
import {
  purchaseState,
  purchasedetlsState,
  editPurchaseIdState,
  editPurchaseDetlsIdState,
} from '../data/atomdata';
import { usePurchasesDetls } from '../react-query/purchasesdetls/usePurchasesDetls';

const PurchaseDetlsTable = ({
  batchdetlsstate,
  setBatchDetlsState,
  handleAddBatchDetls,
  handleDeleteBatchDetls,
  handleEditBatchDetls,
}) => {
  //const navigate = useNavigate();
  //const { samplesbatchdetls, setBatchDetlsId } = useSamplesBatchDetls();
  //const [batchdetls, setBatchDetls] = useState();
  //const [state, setState] = useState({});
  //const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = useState('');
  const [editBatchId, setEditBatchId] = useRecoilState(editPurchaseIdState);
  // const [singleSampleBatch, setSingleSampleBatch] = useRecoilState(
  //   singleSampleBatchState
  // );
  // const [singleSampleBatchDetls, setSingleSampleBatchDetls] = useRecoilState(
  //   singleSampleBatchDetlsState
  // );

  const filteredData = batchdetlsstate.filter(
    item =>
      item.pl_desp &&
      item.pl_desp.toLowerCase().includes(filterText.toLowerCase())
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

  const title = 'Purchases Details';

  const columns = useMemo(
    () => [
      {
        header: 'Item No',
        accessorFn: row => row.pl_itemno || '',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Description',
        accessorFn: row => row.pl_desp || '',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Packing',
        accessorFn: row => row.pl_packing || '',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Qty',
        accessorFn: row => row.pl_qty || 0,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Unit',
        accessorFn: row => row.pl_unit || '',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Unit Cost',
        accessorFn: row => row.pl_netucost || 0,
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
        header: 'Amount',
        accessorFn: row => row.pl_excost || 0,
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
        header: 'Remark',
        accessorFn: row => row.pl_remark || '',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const other_columns = useMemo(
    () => [
      {
        header: 'Description',
        accessorFn: row => row.pl_desp || '',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.pl_excost || 0,
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
    ],
    []
  );

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={10}
        overflow="auto"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={batchdetlsstate}
          handleAdd={handleAddBatchDetls}
          handleEdit={handleEditBatchDetls}
          handleDelete={handleDeleteBatchDetls}
        />
      </Box>
    </Flex>
  );
};

export default PurchaseDetlsTable;
