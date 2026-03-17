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
import CustomDataTable from '../helpers/CustomDataTable';
import { useRecoilState } from 'recoil';
import {
  salesState,
  salesdetlsState,
  editSalesIdState,
  editSalesDetlsIdState,
} from '../data/atomdata';
import { useSalesDetls } from '../react-query/salesdetls/useSalesDetls';
import CustomReactTable from '../helpers/CustomReactTable';

const SalesDetlsTable = ({
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

  //   const filteredData = batchdetlsstate.filter(
  //     item =>
  //       item.sld_desp &&
  //       item.sld_desp.toLowerCase().includes(filterText.toLowerCase())
  //   );

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

  const title = 'Sales Details';

  const columns = useMemo(
    () => [
      {
        header: 'Item No',
        accessorFn: row => row.sld_itemno,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Description',
        accessorFn: row => row.sld_desp,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Packing',
        accessorFn: row => row.sld_packing,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Qty',
        accessorFn: row => row.sld_qty || 0,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'Unit',
        accessorFn: row => row.sld_unit || '',
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Unit Cost',
        accessorFn: row => row.sld_price || 0,
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
        accessorFn: row => row.sld_total || 0,
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
      {/* <Modal
        closeOnOverlayClick={false}
        isOpen={isBatchDetlsOpen}
        onClose={onBatchDetlsClose}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
         <ModalCloseButton />
          <ModalBody>
            <SamplesBatchDetlsForm
              state={setSingleSampleBatchDetls}
              setState={setSingleSampleBatchDetls}
              add_BatchDetls={add_BatchDetls}
              update_BatchDetls={update_BatchDetls}
              statustype={statustype}
              onBatchDetlsClose={onBatchDetlsClose}
            />
          </ModalBody>

        
        </ModalContent>
      </Modal> */}
      {/* <AlertDialogBox
        onClose={onAlertDeleteClose}
        onConfirm={handleOnDeleteBatchDetlsConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Sample"
      >
        <Heading size="md">
          Are you sure you want to delete this samples batch{' '}
          {singleSampleBatchDetls.sbd_no} ?
        </Heading>
      </AlertDialogBox> */}
    </Flex>
  );
};

export default SalesDetlsTable;
