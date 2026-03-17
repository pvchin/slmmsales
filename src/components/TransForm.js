import React, { useState, useEffect } from 'react';
import currency from 'currency.js';
import { nanoid } from 'nanoid';
import { Controller, useForm } from 'react-hook-form';
import { useCustomToast } from '../helpers/useCustomToast';
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
  //Container,
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
  //Modal,
  //ModalOverlay,
  //ModalContent,
  //ModalHeader,
  //ModalFooter,
  //ModalBody,
  //ModalCloseButton,
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
import { NumberInput, Modal } from '@mantine/core';
import { branch } from '../utils/constants';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  LockIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import { TiArrowBack, TiPrinter } from 'react-icons/ti';
import { useRecoilState } from 'recoil';
import {
  tranState,
  trandetlsState,
  editTranIdState,
  editTranDetlsIdState,
} from '../data/atomdata';
//import { usePurchases } from '../react-query/purchases/usePurchases';
import { useAddTran } from '../react-query/trans/useAddTran';
import { useUpdateTran } from '../react-query/trans/useUpdateTran';
//import { useDeletePurchase } from '../react-query/purchases/useDeletePurchase';
import { useTransDetls } from '../react-query/transdetls/useTranDetls';
import { useAddTranDetls } from '../react-query/transdetls/useAddTranDetls';
import { useDeleteTranDetls } from '../react-query/transdetls/useDeleteTranDetls';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import { useDocumentNo } from '../react-query/documentno/useDocumentNo';
import { useUpdateDocumentno } from '../react-query/documentno/useUpdateDocumentNo';
//import { useAddPayable } from '../react-query/payable/useAddPayable';
import { useAddItemsHistory } from '../react-query/itemshistory/useAddItemsHistory';
import { useItemsOnhand } from '../react-query/itemsonhand/useItemsOnhand';
import { useUpdateItemsOnhand } from '../react-query/itemsonhand/useUpdateItemsOnhand';
import SupplierSearchTable from './SupplierSearchTable';
import CustomerSearchTable from './CustomerSearchTable';
import TranDetlsForm from './TransDetlsForm';
//import TranDetlsServForm from './PurchaseDetlsServForm';
import TranDetlsTable from './TransDetlsTable';
//import PurchaseDetlsServTable from './PurchaseDetlsServTable';

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
  tl_rowid: '',
  tl_tranno: '',
  tl_type: 'Item',
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
  tl_branch: branch,
  tl_uoldcost: 0,
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

const TransForm = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { documentno } = useDocumentNo();
  const updateDocumentno = useUpdateDocumentno();
  const { suppliers } = useSuppliers();
  const addTran = useAddTran();
  const updateTran = useUpdateTran();
  const addTranDetls = useAddTranDetls();
  const deleteTranDetls = useDeleteTranDetls();
  //const addPayable = useAddPayable();
  const addItemsHistory = useAddItemsHistory();
  const { itemsonhand } = useItemsOnhand();
  const updateItemOnhand = useUpdateItemsOnhand();

  const { transdetls } = useTransDetls();
  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState();
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(false);

  //const [filterText, setFilterText] = React.useState('');
  const [doctype, setDocType] = useState('Purchase');
  const [batch, setBatch] = useRecoilState(tranState);
  const [batchdetls, setBatchdetls] = useRecoilState(trandetlsState);
  const [editBatchId, setEditBatchId] = useRecoilState(editTranIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] =
    useRecoilState(editTranDetlsIdState);
  const [doclayout, setDocLayout] = useState(editBatchId.layout);
  const [tranno, setTranno] = useState(batch.t_no);
  const [totamt, setTotAmt] = useState(batch.t_subtotal);
  const [totdisc, setTotDisc] = useState(batch.t_disc);
  const [lock, setLock] = useState(batch.t_post);

  console.log('batch', batch);
  console.log('batch detls', batchdetls);
  console.log('edit batch', editBatchId);
  console.log('doc', documentno);

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
    isOpen: isSuppSearchOpen,
    onOpen: onSuppSearchOpen,
    onClose: onSuppSearchClose,
  } = useDisclosure();

  const {
    isOpen: isCustSearchOpen,
    onOpen: onCustSearchOpen,
    onClose: onCustSearchClose,
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

  const add_Batch = data => {
    console.log('add batch', data);
    const { t_no } = data;
    addTran({ ...data });
    // delete old details
    //deleteSamplesBatchDetls({ sbd_batchno: sb_batchno });
    //add details
    batchdetls.forEach(rec => {
      const { tl_id, ...fields } = rec;
      addTranDetls({ ...fields, tl_tranno: t_no });
    });
  };

  const update_Batch = data => {
    console.log('edit batch data', data);
    const { t_no } = data;
    // delete old details
    deleteTranDetls({ tl_tranno: t_no, tl_branch: branch });
    //const detlsitems = transdetls.filter(r => r.tl_tranno === t_no);
    /* detlsitems.length > 0 &&
      detlsitems.forEach(rec => {
        deleteTranDetls({ tl_tranno: rec.tl_tranno });
      }); */

    // update header
    updateTran(data);
    //add details
    batchdetls.forEach(rec => {
      const { tl_id, ...fields } = rec;
      addTranDetls({ ...fields });
    });
  };

  const handleCalc = () => {
    console.log('calc');
    const totalamt = batchdetls.reduce((acc, item) => {
      return acc + item.tl_excost;
    }, 0);
    setValue('t_subtotal', totalamt);
    setValue('t_nettotal', totalamt - totdisc);
  };

  const handleSupplierSearch = () => {
    onSuppSearchOpen();
  };

  const update_SuppDetls = data => {
    const { s_suppno, s_supp, s_add1, s_add2, s_add3, s_add4 } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          t_scno: s_suppno,
          t_sc: s_supp,
          t_add1: s_add1,
          t_add2: s_add2,
          t_add3: s_add3,
          t_add4: s_add4,
        })
    );
    setValue('t_scno', s_suppno);
    setValue('t_sc', s_supp);
    setValue('t_add1', s_add1);
    setValue('t_add2', s_add2);
    setValue('t_add3', s_add3);
    setValue('t_add4', s_add4);
  };

  const handleSearchSupp = data => {
    const result = suppliers.filter(r => r.s_suppno === data);
    update_SuppDetls(...result);
  };

  const handleCustSearch = () => {
    onCustSearchOpen();
  };

  const update_CustDetls = data => {
    const { c_custno, c_cust, c_add1, c_add2, c_add3, c_add4 } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          t_scno: c_custno,
          t_sc: c_cust,
          t_add1: c_add1,
          t_add2: c_add2,
          t_add3: c_add3,
          t_add4: c_add4,
        })
    );
    setValue('t_scno', c_custno);
    setValue('t_sc', c_cust);
    setValue('t_add1', c_add1);
    setValue('t_add2', c_add2);
    setValue('t_add3', c_add3);
    setValue('t_add4', c_add4);
  };

  const handlePost = () => {
    var doctype = '';
    var qtyonhand = 0;
    var netcost = 0;
    var olducost = 0;
    var scno = '';
    var sc = '';
    const data = getValues();
    const newData = { ...data, t_post: '1' };
    onSubmit(newData);

    /*  const ap = {
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
    addPayable(ap); */

    if (data.t_layout === 'Item' && batchdetls.length > 0) {
      batchdetls.forEach(rec => {
        // get itemonhand details
        const itemonhandrec = itemsonhand
          .filter(r => r.item_no === rec.tl_itemno)
          .map(item => {
            return { ...item };
          });

        const detlsdata = {
          ...initial_it,
          it_transno: data.t_no,
          it_transdate: data.t_date,
          it_transtype: data.t_type,
          it_scno: data.t_scno,
          it_sc: data.t_sc,
          it_itemno: rec.tl_itemno,
          it_qty: rec.tl_qty,
          it_value: rec.tl_ucost,
          it_disc: rec.tl_disc,
          it_netvalue: rec.tl_netucost,
          it_desp: rec.tl_desp,
          it_packing: rec.tl_packing,
          it_pfactor: rec.tl_pfactor,
          it_extvalue: rec.tl_excost,
          it_remark: rec.tl_remark,
        };
        addItemsHistory(detlsdata);
        //update item onhand
        console.log('post', itemonhandrec);
        if (itemonhandrec.length > 0) {
          switch (data.t_type) {
            case 'Stock In':
              console.log('stock in');
              qtyonhand = itemonhandrec[0].item_qoh_pc + rec.tl_qty;
              olducost = itemonhandrec[0].item_ucost_pc;
              scno = data.t_scno;
              sc = data.t_sc;
              break;
            case 'Stock Out':
              qtyonhand = itemonhandrec[0].item_qoh_pc - rec.tl_qty;
              olducost = itemonhandrec[0].item_olducost;
              scno = itemonhandrec[0].item_suppno;
              sc = itemonhandrec[0].item_supplier;
              break;
            case 'Missing':
              qtyonhand = itemonhandrec[0].item_qoh_pc - rec.tl_qty;
              olducost = itemonhandrec[0].item_olducost;
              scno = itemonhandrec[0].item_suppno;
              sc = itemonhandrec[0].item_supplier;
              break;
            case 'Damaged':
              qtyonhand = itemonhandrec[0].item_qoh_pc - rec.tl_qty;
              olducost = itemonhandrec[0].item_olducost;
              scno = itemonhandrec[0].item_suppno;
              sc = itemonhandrec[0].item_supplier;
              break;
            case 'Adjustment':
              qtyonhand = itemonhandrec[0].item_qoh_pc + rec.tl_qty;
              olducost = itemonhandrec[0].item_olducost;
              scno = itemonhandrec[0].item_suppno;
              sc = itemonhandrec[0].item_supplier;
              break;
            default:
              break;
          }
          const newData = {
            ...itemonhandrec[0],
            item_qoh_pc: qtyonhand,
            item_olducost: olducost,
            item_suppno: scno,
            item_supplier: sc,
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
      const newData = { ...values, t_id: id };
      update_Batch(newData);
    }
    if (status === 'add') {
      const { doc_trans, doc_abbre } = documentno[0] || 0;
      let docno = doc_trans;
      let docabbre = '';

      const newno = docno + 1;
      const newstrno = (10000000 + newno).toString().substring(1);
      const year = dayjs().year().toString().substring(2);
      const newdocno = docabbre + year + newstrno + doc_abbre;
      const newdata = { ...values, t_no: newdocno };
      updateDocumentno({ ...documentno[0], doc_trans: newno });

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
    console.log('edit', original);
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
    const { tl_id } = original;
    setEditBatchdetlsId(prev => (prev = { id: tl_id }));
    onAlertDeleteOpen();
  };

  const handleAddBatchDetls = () => {
    setStatusType(prev => (prev = 'add'));
    const data = {
      ...initial_batchdetls,
      tl_id: nanoid(),
      tl_branch: branch,
      tl_tranno: editBatchId.no,
      tl_type: doctype,
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
    const oldData = batchdetls.filter(r => r.tl_id !== data.tl_id);
    setBatchdetls([...oldData, dataUpdate]);
    setIsCalc(true);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    //console.log("deldata", data)
    const { id } = editBatchdetlsId;
    const newData = batchdetls.filter(r => r.tl_id !== id);
    console.log('delete', newData);
    setBatchdetls([...newData]);
    setIsCalc(true);
  };

  const handlePrint = () => {
    navigate('/tranprint');
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
                  leftIcon={<TiArrowBack size={30} />}
                  onClick={() => navigate(-1)}
                  colorScheme="teal"
                >
                  Back
                </Button>
              </GridItem>
              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={6}>
                <Center>
                  <Heading size="lg">Transaction Form</Heading>
                </Center>
              </GridItem>
              <GridItem colSpan={1}>
                {lock === '1' && <LockIcon boxSize={8} color="red" />}
              </GridItem>
              <GridItem colSpan={3}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup>
                      <Button
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        //type="submit"
                        onClick={handleSubmit(onSubmit)}
                      >
                        Submit
                      </Button>
                      <Button
                        leftIcon={<ImExit />}
                        colorScheme="teal"
                        onClick={handleExit}
                      >
                        Exit
                      </Button>
                      <Button
                        leftIcon={<TiPrinter />}
                        colorScheme="teal"
                        onClick={handlePrint}
                        //disabled={editBatchId.status === 'add' || lock === '1'}
                      >
                        Print
                      </Button>
                      <Button
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        onClick={handlePost}
                        disabled={
                          editBatchId.status === 'add' || tranno.length === 0
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
                        name="t_scno"
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              From / To
                            </Text>
                            <Input
                              name="t_scno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="from / to"
                              //minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleSupplierSearch()}
                        icon={<SearchIcon />}
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
                      name="t_sc"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Name
                          </Text>
                          <Input
                            name="t_sc"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="name"
                            //minWidth="100"
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
                      name="t_remark"
                      //defaultValue={invoice.sls_remark || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Remark
                          </Text>
                          <Input
                            name="t_remark"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="remark"
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
                      name="t_subtotal"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Amount
                          </Text>
                          <NumberInput
                            name="t_subtotal"
                            value={value || 0}
                            width="full"
                            precision={2}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            formatter={value =>
                              !Number.isNaN(parseFloat(value))
                                ? `$ ${value}`.replace(
                                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                    ','
                                  )
                                : '$ '
                            }
                            onChange={onChange}
                            //borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="unit"
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
                      name="t_disc"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Disc
                          </Text>
                          <NumberInput
                            name="t_disc"
                            value={value || 0}
                            width="full"
                            precision={2}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            formatter={value =>
                              !Number.isNaN(parseFloat(value))
                                ? `$ ${value}`.replace(
                                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                    ','
                                  )
                                : '$ '
                            }
                            onChange={e => {
                              onChange(parseFloat(e.target.value));
                              setTotDisc(
                                prev => (prev = parseFloat(e.target.value))
                              );
                            }}
                            //borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="total discount"
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
                      name="t_nettotal"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Nett Total Amount
                          </Text>
                          <NumberInput
                            name="t_nettotal"
                            value={value || 0}
                            width="full"
                            precision={2}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            formatter={value =>
                              !Number.isNaN(parseFloat(value))
                                ? `$ ${value}`.replace(
                                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                    ','
                                  )
                                : '$ '
                            }
                            onChange={onChange}
                            //borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="total amount"
                            //minWidth="100"
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
                      name="t_no"
                      //defaultValue={invoice.sls_no || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Doc No
                          </Text>
                          <Input
                            name="t_no"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="doc no"
                            //="100"
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
                      name="t_date"
                      //defaultValue={invoice.sls_date}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Doc Date
                          </Text>

                          <Input
                            name="t_date"
                            value={value || ''}
                            type="date"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="doc date"
                            //minWidth="100"
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
                      name="t_type"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Doc Type
                          </Text>
                          <Select
                            name="t_type"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="category"
                          >
                            <option value="Stock In">Stock In</option>
                            <option value="Stock Out">Stock Out</option>
                            <option value="Missing">Missing</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Adjustment">Adjustment</option>
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
                      name="t_layout"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Layout
                          </Text>
                          <Select
                            name="t_layout"
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
            {/* 
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
            )} */}

            {doclayout !== 'Service' && (
              <GridItem colSpan={12}>
                <TranDetlsTable
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
      <Modal opened={isBatchDetlsOpen} onClose={onBatchDetlsClose} size="lg">
        <TranDetlsForm
          state={singlebatchdetlsstate}
          setState={setSingleBatchDetlsState}
          add_Item={add_BatchDetls}
          update_Item={update_BatchDetls}
          statustype={statustype}
          onItemClose={onBatchDetlsClose}
        />
      </Modal>
      <Modal opened={isSuppSearchOpen} onClose={onSuppSearchClose} size="4x1">
        <SupplierSearchTable
          update_Item={update_SuppDetls}
          statustype={statustype}
          setStatusType={setStatusType}
          onSupplierSearchClose={onSuppSearchClose}
        />
      </Modal>
      <Modal opened={isCustSearchOpen} onClose={onCustSearchClose} size="4x1">
        <CustomerSearchTable
          update_Item={update_SuppDetls}
          statustype={statustype}
          setStatusType={setStatusType}
          onSupplierSearchClose={onCustSearchClose}
        />
      </Modal>

      {/*  <Modal
        closeOnOverlayClick={false}
        isOpen={isBatchDetlsServOpen}
        onClose={onBatchDetlsServClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          
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

        </ModalContent>
      </Modal> */}

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

export default TransForm;
