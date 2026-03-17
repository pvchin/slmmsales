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
  salesState,
  salesdetlsState,
  editSalesIdState,
  editSalesDetlsIdState,
} from '../data/atomdata';

const SalesDetlsServTable = ({
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
  const [editBatchId, setEditBatchId] = useRecoilState(editSalesIdState);
  // const [singleSampleBatch, setSingleSampleBatch] = useRecoilState(
  //   singleSampleBatchState
  // );
  // const [singleSampleBatchDetls, setSingleSampleBatchDetls] = useRecoilState(
  //   singleSampleBatchDetlsState
  // );

  console.log('editbatch', editBatchId);

  const filteredData = batchdetlsstate.filter(
    item =>
      item.sld_desp &&
      item.sld_desp.toLowerCase().includes(filterText.toLowerCase())
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

  const title = 'Sales Service Details';

  const columns = useMemo(
    () => [
      {
        header: 'Description',
        accessorFn: row => row.sld_desp,
        size: '800',
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Amount',
        accessorFn: row => row.sld_total || 0,
        size: '200',
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

export default SalesDetlsServTable;
