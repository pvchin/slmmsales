import React, { useState, useEffect } from 'react';
import currency from 'currency.js';
import { nanoid } from 'nanoid';
import { Controller, useForm } from 'react-hook-form';
import { formatPrice } from '../helpers/utils';
import { FiSave } from 'react-icons/fi';
import { ImExit } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Wrap,
  WrapItem,
  useRadio,
  useRadioGroup,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import CustomDataTable from '../helpers/CustomDataTable';
import { branch } from '../utils/constants';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { LockIcon } from '@chakra-ui/icons';
import {
  IconArrowBackUp,
  IconPrinter,
  IconSearch,
  IconDeviceFloppy,
  IconDoorExit,
  IconPlus,
  IconSend,
} from '@tabler/icons-react';
//import { TiArrowBack, TiPrinter } from 'react-icons/ti';
import { useRecoilState } from 'recoil';
import {
  purchaseState,
  purchasedetlsState,
  editPurchaseIdState,
  editPurchaseDetlsIdState,
} from '../data/atomdata';
//import { usePurchases } from '../react-query/purchases/usePurchases';
import { useAddPurchase } from '../react-query/purchases/useAddPurchase';
import { useUpdatePurchase } from '../react-query/purchases/useUpdatePurchase';
//import { useDeletePurchase } from '../react-query/purchases/useDeletePurchase';
import { usePurchasesDetls } from '../react-query/purchasesdetls/usePurchasesDetls';
import { useAddPurchaseDetls } from '../react-query/purchasesdetls/useAddPurchaseDetls';
import { useDeletePurchaseDetls } from '../react-query/purchasesdetls/useDeletePurchaseDetls';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import { useDocumentNo } from '../react-query/documentno/useDocumentNo';
import { useUpdateDocumentno } from '../react-query/documentno/useUpdateDocumentNo';
import { useAddPayable } from '../react-query/payable/useAddPayable';
import { useAddItemsHistory } from '../react-query/itemshistory/useAddItemsHistory';
import { useItemsOnhand } from '../react-query/itemsonhand/useItemsOnhand';
import { useUpdateItemsOnhand } from '../react-query/itemsonhand/useUpdateItemsOnhand';
import SupplierSearchTable from './SupplierSearchTable';
import PurchaseDetlsForm from './PurchaseDetlsForm';
import PurchaseDetlsServForm from './PurchaseDetlsServForm';
import PurchaseDetlsTable from './PurchaseDetlsTable';
import PurchaseDetlsServTable from './PurchaseDetlsServTable';
import { Toast } from '../helpers/CustomToastify';

const initial_ap = {
  ap_pono: '',
  ap_podate: null,
  ap_invno: '',
  ap_invdate: null,
  ap_recdate: null,
  ap_suppno: '',
  ap_supplier: '',
  ap_type: '',
  ap_subtotal_amt: 0,
  ap_nettotal_amt: 0,
  ap_paid_amt: 0,
  ap_disc_amt: 0,
  ap_disc_taken: 0,
  ap_dc: '',
  ap_acc: '',
  ap_disc_acc: '',
  ap_paid: false,
  ap_balance: 0,
  ap_branch: branch,
  ap_glcode: '',
  ap_paid_disc: 0,
};

const initial_batchdetls = {
  pl_rowid: '',
  pl_pono: '',
  pl_type: 'Item',
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
  pl_branch: branch,
  pl_uoldcost: 0,
};

const initial_it = {
  it_transno: '',
  it_itemno: '',
  it_transdate: null,
  it_qty: 0,
  it_value: 0,
  it_disc: 0,
  it_netvalue: 0,
  it_extvalue: 0,
  it_pfactor: 1,
  it_transtype: '',
  it_scno: '',
  it_sc: '',
  it_branch: branch,
  it_postdate: null,
  it_remark: '',
  it_desp: '',
  it_packing: '',
  it_transid: 0,
  it_transidsub: 0,
};

const PurchaseForm = () => {
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { documentno } = useDocumentNo();
  const updateDocumentno = useUpdateDocumentno();
  const { suppliers } = useSuppliers();
  const addPurchase = useAddPurchase();
  const updatePurchase = useUpdatePurchase();
  const addPurchaseDetls = useAddPurchaseDetls();
  const deletePurchaseDetls = useDeletePurchaseDetls();
  const addPayable = useAddPayable();
  const addItemsHistory = useAddItemsHistory();
  const { itemsonhand } = useItemsOnhand();
  const updateItemOnhand = useUpdateItemsOnhand();

  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState();
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(false);

  //const [filterText, setFilterText] = React.useState('');
  const [doctype, setDocType] = useState('Purchase');
  const [batch, setBatch] = useRecoilState(purchaseState);
  const [batchdetls, setBatchdetls] = useRecoilState(purchasedetlsState);
  const [editBatchId, setEditBatchId] = useRecoilState(editPurchaseIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] = useRecoilState(
    editPurchaseDetlsIdState
  );
  const [doclayout, setDocLayout] = useState(editBatchId.layout);
  const [poinvno, setPOInvno] = useState(batch.po_invno);
  const [totamt, setTotAmt] = useState(batch.po_subtotal);
  const [totdisc, setTotDisc] = useState(batch.po_disc);
  const [lock, setLock] = useState(batch.po_post);

  //console.log('batch', batch);
  //console.log('batch detls', batchdetls);
  //console.log('edit batch', editBatchId);
  //console.log('doc', documentno);

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

  const {
    isOpen: isBatchDetlsServOpen,
    onOpen: onBatchDetlsServOpen,
    onClose: onBatchDetlsServClose,
  } = useDisclosure();

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...batch,
    },
  });

  /* const columns = [
    {
      id: 1,
      key: 'editaction',
      text: 'Action',
      sortable: false,
      width: '60px',
      cell: record => {
        return (
          <>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              onClick={() => {
                handleEditBatchDetls(record);
              }}
            ></IconButton>
          </>
        );
      },
    },
    {
      id: 2,
      key: 'deleteaction',
      text: 'Action',
      width: '60px',
      sortable: false,
      cell: record => {
        return (
          <>
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              onClick={() => {
                handleDeleteBatchDetls(record);
              }}
            />
          </>
        );
      },
    },
    // {
    //   id: 3,
    //   name: 'No',
    //   selector: row => row.index,
    //   sortable: true,
    //   filterable: true,
    //   width: '50px',
    // },
    {
      id: 4,
      name: 'Item No',
      selector: row => row.pl_itemno,
      sortable: true,
      filterable: true,
      width: '150px',
    },
    {
      id: 5,
      name: 'Description',
      selector: row => row.pl_desp,
      //width: '150px',
      sortable: true,
    },
    {
      id: 6,
      name: 'Qty',
      selector: row => row.pl_qty,
      width: '150px',
      //sortable: true,
      right: true,
    },
    {
      id: 7,
      name: 'Unit',
      selector: row => row.pl_unit,
      width: '100px',
      //sortable: true,
    },
    {
      id: 8,
      name: 'Unit Price',
      selector: row => row.pl_excost,
      width: '150px',
      //sortable: true,
      right: true,
      cell: row => <div>{currency(row.pl_excost).format()}</div>,
    },
    {
      id: 9,
      name: 'Amount',
      selector: row => row.pl_excost,
      width: '150px',
      //sortable: true,
      right: true,
      cell: row => <div>{currency(row.pl_excost).format()}</div>,
    },
  ]; */

  const add_Batch = data => {
    console.log('add batch', data);
    const { po_no } = data;
    addPurchase({ ...data });
    // delete old details
    //deleteSamplesBatchDetls({ sbd_batchno: sb_batchno });
    //add details
    batchdetls.forEach(rec => {
      const { pl_id, ...fields } = rec;
      addPurchaseDetls({ ...fields, pl_pono: po_no });
    });
  };

  const update_Batch = data => {
    console.log('edit batch', data);
    const { po_no } = data;
    updatePurchase(data);
    // delete old details
    deletePurchaseDetls({ pl_pono: po_no });
    //add details
    batchdetls.forEach(rec => {
      const { pl_id, ...fields } = rec;
      addPurchaseDetls({ ...fields });
    });
  };

  const handleCalc = () => {
    console.log('calc');
    const totalamt = batchdetls.reduce((acc, item) => {
      return acc + item.pl_excost;
    }, 0);
    setValue('po_subtotal', totalamt);
    setValue('po_nettotal', totalamt - totdisc);
  };

  const handleSupplierSearch = () => {
    onSearchOpen();
  };

  const update_SuppDetls = data => {
    console.log('suppdata', data);
    const { s_suppno, s_supp, s_add1, s_add2, s_add3, s_add4 } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          po_suppno: s_suppno,
          po_supp: s_supp,
          po_add1: s_add1,
          po_add2: s_add2,
          po_add3: s_add3,
          po_add4: s_add4,
        })
    );
    setValue('po_suppno', s_suppno);
    setValue('po_supp', s_supp);
    setValue('po_add1', s_add1);
    setValue('po_add2', s_add2);
    setValue('po_add3', s_add3);
    setValue('po_add4', s_add4);
  };

  const handleSearchSupp = data => {
    const result = suppliers.filter(r => r.s_suppno === data);
    update_SuppDetls(...result);
  };

  const handlePost = () => {
    var doctype = '';
    var qtyonhand = 0;
    var netcost = 0;
    var olducost = 0;
    var suppno = '';
    var supp = '';
    const data = getValues();
    const newData = { ...data, po_post: '1' };
    onSubmit(newData);

    const ap = {
      ...initial_ap,
      ap_pono: data.po_no,
      ap_podate: data.po_date,
      ap_invno: data.po_invno,
      ap_invdate: data.po_invdate,
      ap_suppno: data.po_suppno,
      ap_supplier: data.po_supp,
      ap_type: data.po_type,
      ap_subtotal_amt: data.po_subtotal,
      ap_nettotal_amt: data.po_nettotal,
      ap_disc_amt: data.po_disc,
      ap_balance: data.po_nettotal,
    };
    addPayable(ap);

    switch (data.po_type) {
      case 'Purchase':
        doctype = 'Purchase';
        break;
      case 'Credit Note':
        doctype = 'PO Credit Note';
        break;
      case 'Debit Note':
        doctype = 'PO Debit Note';
        break;
      default:
        break;
    }
    if (data.po_layout === 'Item' && batchdetls.length > 0) {
      batchdetls.forEach(rec => {
        // get itemonhand details
        const itemonhandrec = itemsonhand
          .filter(r => r.item_no === rec.pl_itemno)
          .map(item => {
            return { ...item };
          });
        const detlsdata = {
          ...initial_it,
          it_transno: data.po_no,
          it_transdate: data.po_date,
          it_transtype: doctype,
          it_scno: data.po_suppno,
          it_sc: data.po_supp,
          it_itemno: rec.pl_itemno,
          it_qty: rec.pl_qty,
          it_value: rec.pl_ucost,
          it_disc: rec.pl_disc,
          it_netvalue: rec.pl_netucost,
          it_desp: rec.pl_desp,
          it_packing: rec.pl_packing,
          it_pfactor: rec.pl_pfactor,
          it_extvalue: rec.pl_excost,
          it_remark: rec.pl_remark,
        };
        addItemsHistory(detlsdata);
        //update item onhand
        console.log('post', itemonhandrec);
        if (itemonhandrec.length > 0) {
          switch (data.po_type) {
            case 'Purchase':
              qtyonhand = itemonhandrec[0].item_qoh_pc + rec.pl_qty;
              olducost = itemonhandrec[0].item_ucost_pc;
              suppno = data.po_suppno;
              supp = data.po_supplier;
              break;
            case 'Credit Note':
              qtyonhand = itemonhandrec[0].item_qoh_pc - rec.pl_qty;
              olducost = itemonhandrec[0].item_olducost;
              suppno = itemonhandrec[0].item_suppno;
              supp = itemonhandrec[0].item_supplier;

              break;
            case 'Debit Note':
              qtyonhand = itemonhandrec[0].item_qoh_pc + rec.pl_qty;
              olducost = itemonhandrec[0].item_olducost;
              suppno = itemonhandrec[0].item_suppno;
              supp = itemonhandrec[0].item_supplier;
              break;
            default:
              break;
          }
          const newData = {
            ...itemonhandrec[0],
            item_qoh_pc: qtyonhand,
            item_olducost: olducost,
            item_suppno: suppno,
            item_supplier: supp,
          };

          console.log('post newdata', newData);
          updateItemOnhand(newData);
        }
      });
    }
  };

  const onSubmit = values => {
    const { id, status } = editBatchId;
    console.log('status value', status);
    if (status === 'edit') {
      console.log('edit here');
      const newData = { ...values, po_id: id };
      update_Batch(newData);
    }
    if (status === 'add') {
      const { doc_purchase, doc_abbre } = documentno[0] || 0;
      const docno = doc_purchase;
      const newno = docno + 1;
      const newstrno = (10000000 + newno).toString().substring(1);
      const year = dayjs().year().toString().substring(2);
      const newdocno = 'POH' + year + newstrno + doc_abbre;
      const newdata = { ...values, po_no: newdocno };
      updateDocumentno({ ...documentno[0], doc_purchase: newno });
      add_Batch(newdata);
    }

    //console.log('addpurchase', statustype, newstrno, newdata);
    navigate(-1);
  };

  const handleExit = () => {
    navigate(-1);
  };

  const handleEditBatchDetls = row => {
    const { original } = row;
    setStatusType(prev => (prev = 'edit'));
    setSingleBatchDetlsState(original);
    if (doclayout === 'Service') {
      onBatchDetlsServOpen(true);
    } else {
      onBatchDetlsOpen(true);
    }
  };

  const handleDeleteBatchDetls = row => {
    const { original } = row;
    const { pl_id } = original;
    setEditBatchdetlsId(prev => (prev = { id: pl_id }));
    onAlertDeleteOpen();
  };

  const handleAddBatchDetls = () => {
    setStatusType(prev => (prev = 'add'));
    const data = {
      ...initial_batchdetls,
      pl_id: nanoid(),
      pl_branch: branch,
      pl_pono: editBatchId.no,
      pl_type: doctype,
    };
    setSingleBatchDetlsState(data);
    if (doclayout === 'Service') {
      onBatchDetlsServOpen(true);
    } else {
      onBatchDetlsOpen(true);
    }
  };

  const add_BatchDetls = data => {
    const dataUpdate = { ...data };
    console.log('adddata', dataUpdate);
    const oldData = batchdetls;
    const newData = [...oldData, dataUpdate];
    //   console.log('newdata', newData);
    setBatchdetls(newData);
    setIsCalc(true);
  };

  const update_BatchDetls = data => {
    const dataUpdate = { ...data };
    console.log('editdata', dataUpdate);
    const oldData = batchdetls.filter(r => r.pl_id !== data.pl_id);
    setBatchdetls([...oldData, dataUpdate]);
    setIsCalc(true);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    //console.log("deldata", data)
    const { id } = editBatchdetlsId;
    const newData = batchdetls.filter(r => r.pl_id !== id);
    console.log('delete', newData);
    setBatchdetls([...newData]);
    setIsCalc(true);
  };

  const handlePrint = () => {
    navigate('/purchaseprint');
  };

  useEffect(() => {
    handleCalc();
    setIsCalc(false);
  }, [isCalc, totamt, totdisc]);

  return (
    <Box
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //align="left"
        //alignItems="flex-start"
      >
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <form>
          <HStack py={2} spacing="3">
            <Grid templateColumns={'repeat(12,1fr)'} columnGap={3}>
              <GridItem colSpan={1}>
                <Button
                  leftIcon={<IconArrowBackUp size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                >
                  Back
                </Button>
              </GridItem>
              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={5}>
                <Center>
                  <Heading size="lg">Purchase Invoice Form</Heading>
                </Center>
              </GridItem>
              <GridItem colSpan={1}>
                {lock === '1' && <LockIcon boxSize={8} color="red" />}
              </GridItem>
              <GridItem colSpan={4}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup spacing={5}>
                      <Button
                        leftIcon={<IconDeviceFloppy />}
                        colorScheme="teal"
                        //type="submit"
                        onClick={handleSubmit(onSubmit)}
                      >
                        Submit
                      </Button>
                      <Button
                        leftIcon={<IconDoorExit />}
                        colorScheme="teal"
                        onClick={handleExit}
                      >
                        Exit
                      </Button>
                      <Button
                        leftIcon={<IconPrinter />}
                        colorScheme="teal"
                        onClick={handlePrint}
                        //disabled={editBatchId.status === 'add' || lock === '1'}
                      >
                        Print
                      </Button>
                      <Button
                        leftIcon={<IconSend />}
                        colorScheme="teal"
                        onClick={handlePost}
                        disabled={
                          editBatchId.status === 'add' || poinvno.length === 0
                        }
                      >
                        Post
                      </Button>
                    </ButtonGroup>
                  </HStack>
                </Flex>
              </GridItem>
            </Grid>
          </HStack>

          <Grid
            templateColumns={'repeat(12,1fr)'}
            //templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid teal"
            borderRadius="20"
            backgroundColor="blue.50"
          >
            <GridItem colSpan={6}>
              <Grid templateColumns={'repeat(6,1fr)'} columnGap={3}>
                <GridItem colSpan={2} mt={field_gap}>
                  <HStack>
                    <FormControl>
                      <Controller
                        control={control}
                        name="po_suppno"
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Supplier No
                            </Text>
                            <Input
                              name="po_suppno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="supplier no"
                              minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleSupplierSearch()}
                        icon={<IconSearch />}
                        size="md"
                        colorScheme="teal"
                      />
                    </Box>
                  </HStack>
                </GridItem>
                <GridItem colSpan={4} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_supp"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Supplier
                          </Text>
                          <Input
                            name="po_supp"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="supplier"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={6} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_remark"
                      //defaultValue={invoice.sls_remark || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Remark
                          </Text>
                          <Input
                            name="po_remark"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="remark"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_subtotal"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Amount
                          </Text>
                          <Input
                            name="po_subtotal"
                            value={value || 0}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="sub total amount"
                            minWidth="100"
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_disc"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Disc
                          </Text>
                          <Input
                            name="po_disc"
                            value={value || 0}
                            width="full"
                            onChange={e => {
                              onChange(parseFloat(e.target.value));
                              setTotDisc(
                                prev => (prev = parseFloat(e.target.value))
                              );
                            }}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="total discount"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_nettotal"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Nett Total Amount
                          </Text>
                          <Input
                            name="po_nettotal"
                            value={value || 0}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="total amount"
                            minWidth="100"
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={6}>
              <Grid templateColumns={'repeat(6,1fr)'} columnGap={3}>
                <GridItem colSpan={2} mt={field_gap} w="100%">
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_no"
                      //defaultValue={invoice.sls_no || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            PO No
                          </Text>
                          <Input
                            name="po_no"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="po no"
                            minWidth="100"
                            readOnly
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_date"
                      //defaultValue={invoice.sls_date}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            PO Date
                          </Text>

                          <Input
                            name="po_date"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="po date"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_type"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Type
                          </Text>
                          <Select
                            name="po_type"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="category"
                          >
                            <option value="Purchase">Purchase</option>
                            <option value="Purchase Returns">
                              Purchase Returns
                            </option>
                            <option value="Credit Note">Credit Note</option>
                            <option value="Debit Note">Debit Note</option>
                          </Select>
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_invno"
                      //defaultValue={invoice.oei_type || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Invoice No
                          </Text>
                          <Input
                            name="po_invno"
                            value={value || ''}
                            width="full"
                            onChange={e => {
                              onChange(e.target.value);
                              setPOInvno(e.target.value);
                            }}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="invoice no"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_invdate"
                      //defaultValue={invoice.sls_oref ? invoice.sls_oref : ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Invoice Date
                          </Text>
                          <Input
                            name="po_invdate"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="invoice date"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_recdate"
                      //defaultValue={invoice.oei_yref || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Received Date
                          </Text>
                          <Input
                            name="po_recdate"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="received date"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_term"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Term
                          </Text>
                          <Input
                            name="po_term"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="term"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="po_layout"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Layout
                          </Text>
                          <Select
                            name="po_layout"
                            value={value || ''}
                            width="full"
                            pointerEvents={
                              editBatchId.status === 'edit' ? 'none' : 'all'
                            }
                            onChange={e => {
                              onChange(e.target.value);
                              setEditBatchId(
                                prev =>
                                  (prev = { ...prev, layout: e.target.value })
                              );
                              setDocLayout(prev => (prev = e.target.value));
                            }}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="category"
                          >
                            <option value="Item">Item</option>
                            <option value="Service">Service</option>
                          </Select>
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={12} w={'100%'}>
              <Divider borderWidth={1} borderColor="teal" />
            </GridItem>

            {doclayout === 'Service' && (
              <GridItem colSpan={12}>
                <PurchaseDetlsServTable
                  batchdetlsstate={batchdetls}
                  setBatchDetlsState={setBatchdetls}
                  handleAddBatchDetls={handleAddBatchDetls}
                  handleEditBatchDetls={handleEditBatchDetls}
                  handleDeleteBatchDetls={handleDeleteBatchDetls}
                />
              </GridItem>
            )}

            {doclayout !== 'Service' && (
              <GridItem colSpan={12}>
                <PurchaseDetlsTable
                  batchdetlsstate={batchdetls}
                  setBatchDetlsState={setBatchdetls}
                  handleAddBatchDetls={handleAddBatchDetls}
                  handleEditBatchDetls={handleEditBatchDetls}
                  handleDeleteBatchDetls={handleDeleteBatchDetls}
                />
              </GridItem>
            )}
            <GridItem colSpan={12} w={'100%'}>
              <Divider borderWidth={1} borderColor="teal" />
            </GridItem>
          </Grid>
        </form>
      </VStack>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isBatchDetlsOpen}
        onClose={onBatchDetlsClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <PurchaseDetlsForm
              state={singlebatchdetlsstate}
              setState={setSingleBatchDetlsState}
              add_Item={add_BatchDetls}
              update_Item={update_BatchDetls}
              statustype={statustype}
              onItemClose={onBatchDetlsClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isBatchDetlsServOpen}
        onClose={onBatchDetlsServClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <PurchaseDetlsServForm
              state={singlebatchdetlsstate}
              setState={setSingleBatchDetlsState}
              add_Item={add_BatchDetls}
              update_Item={update_BatchDetls}
              statustype={statustype}
              onItemClose={onBatchDetlsServClose}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <SupplierSearchTable
              //state={state}
              //setState={setState}
              //add_Item={add_InvDetls}
              update_Item={update_SuppDetls}
              statustype={statustype}
              setStatusType={setStatusType}
              onSupplierSearchClose={onSearchClose}
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
        onConfirm={handleOnDelBatchDetlsConfirm}
        isOpen={isAlertDeleteOpen}
        title="Delete Item"
      >
        <Heading size="md">Are you sure you want to delete this item?</Heading>
      </AlertDialogBox>
    </Box>
  );
};

export default PurchaseForm;
