import React, { useState, useMemo } from 'react';

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
import { itemState } from '../data/atomdata';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import CustomDataTable from '../helpers/CustomDataTable';
import { useItems } from '../react-query/items/useItems';
import { useItemsMaster } from '../react-query/Itemsmaster/useItemMaster';
import { useAddItem } from '../react-query/items/useAddItem';
import { useUpdateItem } from '../react-query/items/useUpdateItem';
import { useDeleteItem } from '../react-query/items/useDeleteItem';
import { useItemsOnhand } from '../react-query/itemsonhand/useItemsOnhand';
import { useUpdateItemsOnhand } from '../react-query/itemsonhand/useUpdateItemsOnhand';
import { useAddItemsOnhand } from '../react-query/itemsonhand/useAddItemsOnhand';
import { branch } from '../utils/constants';
import CustomReactTable from '../helpers/CustomReactTable';
import ItemForm from './ItemForm';

const initial_item = [
  {
    item_no: '',
    item_desp: '',
    item_unit: '',
    item_packing: '',
    item_category: '',
    item_brand: '',
    item_location: '',
    item_dept: '',
    item_uprice_pc: 0,
  },
];

const initial_itemonhand = {
  item_no: '',
  item_branch: branch,
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
  item_inactive: false,
  item_olducost: 0,
  item_memuprice: 0,
  item_allowposaddon: false,
};

const initial_mitem = {
  item_id: '',
  item_onhandid: '',
  item_no: '',
  item_branch: branch,
  item_desp: '',
  item_unit: '',
  item_packing: '',
  item_category: '',
  item_brand: '',
  item_location: '',
  item_dept: '',
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
  item_inactive: false,
  item_olducost: 0,
  item_memuprice: 0,
  item_allowposaddon: false,
};
const ItemsTable = () => {
  const { items } = useItems();
  const { itemsmaster, setItemMasterNo } = useItemsMaster();
  const addItem = useAddItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const { itemsonhand } = useItemsOnhand();
  const addItemsOnhand = useAddItemsOnhand();
  const updateItemsOnhand = useUpdateItemsOnhand();
  const [state, setState] = useRecoilState(itemState);
  const [statustype, setStatusType] = useState('');
  const [filterText, setFilterText] = React.useState('');

  const {
    isOpen: isAlertDeleteOpen,
    onOpen: onAlertDeleteOpen,
    onClose: onAlertDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isItemOpen,
    onOpen: onItemOpen,
    onClose: onItemClose,
  } = useDisclosure();

  const title = 'Items';

  const columns = useMemo(
    () => [
      {
        header: 'Item No',
        accessorFn: row => row.item_no,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Description',
        accessorFn: row => row.item_desp,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Packing',
        accessorFn: row => row.item_packing,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'QOH',
        accessorFn: row => row.item_qoh_pc,
        size: 100,
        Cell: ({ cell }) => cell.getValue().toFixed(2),

        mantineTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        header: 'Unit',
        accessorFn: row => row.item_unit,
        size: 100,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'U/Price',
        accessorFn: row => row.item_uprice_pc,
        size: 100,
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
        header: 'U/Cost',
        accessorFn: row => row.item_ucost_pc,
        size: 100,
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
        header: 'Department',
        accessorFn: row => row.item_dept,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },

      {
        header: 'Brand',
        accessorFn: row => row.item_brand,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
      {
        header: 'Category',
        accessorFn: row => row.item_category,
        //size: 200,
        mantineTableBodyCellProps: {
          align: 'left',
        },
      },
    ],
    []
  );

  const handleOnDeleteConfirm = () => {
    deleteItem(state);
  };

  const handleAddItem = () => {
    setStatusType(prev => (prev = 'add'));
    const data = { ...initial_mitem };
    setState(data);
    onItemOpen(true);
  };

  const handleEditItem = row => {
    const { original } = row;
    console.log('edit', original);
    setStatusType(prev => (prev = 'edit'));
    setState(original);
    onItemOpen(true);
  };

  const handleDeleteItem = row => {
    const { original } = row;
    setState(prev => (prev = { ...original }));
    onAlertDeleteOpen();
  };

  const add_Item = data => {
    console.log('add', data);
    const itemdata = {
      ...initial_item,
      item_no: data.item_no,
      item_group: data.item_group,
      item_desp: data.item_desp,
      item_packing: data.item_packing,
      item_category: data.item_category,
      item_unit: data.item_unit,
      item_brand: data.item_brand,
      item_dept: data.item_dept,
      item_smcode: data.item_smcode,
      item_package: data.item_package,
      item_warehouse: data.item_warehouse,
      item_type: data.item_type,
      item_nonstock: data.item_nonstock,
      item_location: data.item_location,
      item_prtreptlabel: data.item_prtreptlabel,
      item_lock: data.item_lock,
      item_inactive: data.item_inactive,
    };
    const onhand = {
      ...initial_itemonhand,
      item_no: data.item_no,
      item_branch: branch,
      item_qoh_pc: data.item_qoh_pc,
      item_qoh_ctn: data.item_qoh_ctn,
      item_ucost_pc: data.item_ucost_pc,
      item_ucost_ctn: data.item_ucost_ctn,
      item_onorder_pc: data.item_onorder_pc,
      item_onorder_ctn: data.item_onorder_ctn,
      item_uprice_pc: data.item_uprice_pc,
      item_uprice_ctn: data.item_uprice_ctn,
      item_remark: data.item_remark,
      item_pfactor: data.item_pfactor,
      item_outlet_pc: data.item_outlet_pc,
      item_outlet_ctn: data.item_outlet_ctn,
      item_offeruprice: data.item_offeruprice,
      item_cooluprice: data.item_cooluprice,
      item_minlvlqty: data.item_minlvlqty,
      item_suppno: data.item_suppno,
      item_supplier: data.item_supplier,
      item_openqty: data.item_openqty,
      item_openamt: data.item_openamt,
      item_updated: data.item_updated,
      item_lastsalesdate: data.item_lastsalesdate,
      item_lastpodate: data.item_lastpodate,
      item_lastpoqty: data.item_lastpoqty,
      item_lastsalesqty: data.item_lastsalesqty,
      item_inactive: data.item_inactive,
      item_olducost: data.item_olducost,
      item_memuprice: data.item_memuprice,
      item_allowposaddon: data.item_allowposaddon,
    };

    addItem(itemdata);
    addItemsOnhand(onhand);
  };

  const update_Item = data => {
    console.log('update', data);
    const itemdata = {
      ...initial_item,
      item_id: data.item_id,
      item_no: data.item_no,
      item_group: data.item_group,
      item_desp: data.item_desp,
      item_packing: data.item_packing,
      item_category: data.item_category,
      item_unit: data.item_unit,
      item_brand: data.item_brand,
      item_dept: data.item_dept,
      item_smcode: data.item_smcode,
      item_package: data.item_package,
      item_warehouse: data.item_warehouse,
      item_type: data.item_type,
      item_nonstock: data.item_nonstock,
      item_location: data.item_location,
      item_prtreptlabel: data.item_prtreptlabel,
      item_lock: data.item_lock,
      item_inactive: data.item_inactive,
    };
    const onhand = {
      ...initial_itemonhand,
      item_id: data.item_onhandid,
      item_no: data.item_no,
      item_branch: branch,
      item_qoh_pc: data.item_qoh_pc,
      item_qoh_ctn: data.item_qoh_ctn,
      item_ucost_pc: data.item_ucost_pc,
      item_ucost_ctn: data.item_ucost_ctn,
      item_onorder_pc: data.item_onorder_pc,
      item_onorder_ctn: data.item_onorder_ctn,
      item_uprice_pc: data.item_uprice_pc,
      item_uprice_ctn: data.item_uprice_ctn,
      item_remark: data.item_remark,
      item_pfactor: data.item_pfactor,
      item_outlet_pc: data.item_outlet_pc,
      item_outlet_ctn: data.item_outlet_ctn,
      item_offeruprice: data.item_offeruprice,
      item_cooluprice: data.item_cooluprice,
      item_minlvlqty: data.item_minlvlqty,
      item_suppno: data.item_suppno,
      item_supplier: data.item_supplier,
      item_openqty: data.item_openqty,
      item_openamt: data.item_openamt,
      item_updated: data.item_updated,
      item_lastsalesdate: data.item_lastsalesdate,
      item_lastpodate: data.item_lastpodate,
      item_lastpoqty: data.item_lastpoqty,
      item_lastsalesqty: data.item_lastsalesqty,
      item_inactive: data.item_inactive,
      item_olducost: data.item_olducost,
      item_memuprice: data.item_memuprice,
      item_allowposaddon: data.item_allowposaddon,
    };
    updateItem(itemdata);
    updateItemsOnhand(onhand);
  };

  return (
    <Flex p={5}>
      <Box
        width="100%"
        borderWidth={1}
        borderColor="teal.800"
        borderRadius={15}
        overflow="auto"
      >
        <CustomReactTable
          title={title}
          columns={columns}
          data={itemsmaster}
          handleAdd={handleAddItem}
          handleEdit={handleEditItem}
          handleDelete={handleDeleteItem}
        />
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isItemOpen}
        onClose={onItemClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <ItemForm
              state={state}
              setState={setState}
              add_Item={add_Item}
              update_Item={update_Item}
              statustype={statustype}
              onItemClose={onItemClose}
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
        title="Delete Item"
      >
        <Heading size="md">
          Are you sure you want to delete this item {state.item_no}
          {''} {state.item_desp}
          {state.ic_desp} ?
        </Heading>
      </AlertDialogBox>
    </Flex>
  );
};

export default ItemsTable;
