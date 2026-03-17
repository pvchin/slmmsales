import React, { useState, useEffect, useMemo } from 'react';
import currency from 'currency.js';
import { nanoid } from 'nanoid';
import _ from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useCustomToast } from '../helpers/useCustomToast';
import {
  IconArrowBackUp,
  IconLock,
  IconSearch,
  IconDoorExit,
  IconDeviceFloppy,
  IconPrinter,
  IconSend,
} from '@tabler/icons-react';
import { formatPrice } from '../helpers/utils';
//import { FiPrinter } from 'react-icons/fi';
//import { ImExit } from 'react-icons/im';
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
import { branch } from '../utils/constants';
import { AlertDialogBox } from '../helpers/AlertDialogBox';
import { LockIcon } from '@chakra-ui/icons';
import { useRecoilState } from 'recoil';
import {
  salesState,
  salesdetlsState,
  editSalesIdState,
  editSalesDetlsIdState,
} from '../data/atomdata';
//import { usePurchases } from '../react-query/purchases/usePurchases';
import { useAddSales } from '../react-query/sales/useAddSales';
import { useUpdateSales } from '../react-query/sales/useUpdateSales';
//import { useDeletePurchase } from '../react-query/purchases/useDeletePurchase';
//import { usePurchasesDetls } from '../react-query/purchasesDetls/usePurchasesDetls';
import { useAddSalesDetls } from '../react-query/salesdetls/useAddSalesDetls';
import { useDeleteSalesDetls } from '../react-query/salesdetls/useDeleteSalesDetls';
import { useCustomers } from '../react-query/customers/useCustomers';
import { useDocumentNo } from '../react-query/documentno/useDocumentNo';
import { useUpdateDocumentno } from '../react-query/documentno/useUpdateDocumentNo';
import { useAddReceivable } from '../react-query/receivable/useAddReceivable';
import { useAddItemsHistory } from '../react-query/itemshistory/useAddItemsHistory';
import { useItemsOnhand } from '../react-query/itemsonhand/useItemsOnhand';
import { useUpdateItemsOnhand } from '../react-query/itemsonhand/useUpdateItemsOnhand';
import CustomerSearchTable from './CustomerSearchTable';
import SalesDetlsForm from './SalesDetlsForm';
import SalesDetlsTable from './SalesDetlsTable';
import SalesDetlsServForm from './SalesDetlsServForm';
import SalesDetlsServTable from './SalesDetlsServTable';
import SalesPrint from './SalesPrint';

const initial_ar = {
  ar_invno: '',
  ar_date: null,
  ar_custno: '',
  ar_cust: '',
  ar_type: '',
  ar_subtotal: 0,
  ar_paid_amt: 0,
  ar_disc_amt: 0,
  ar_disc_taken: 0,
  ar_balance: 0,
  ar_total: 0,
  ar_branch: branch,
  ar_paid: false,
  ar_glcode: '',
  ar_paid_disc: 0,
};

const initial_batchdetls = {
  sld_id: '',
  sld_no: '',
  sld_itemno: '',
  sld_desp: '',
  sld_packing: '',
  sld_pfactor: 1,
  sld_qty: 0,
  sld_unit: '',
  sld_price: 0,
  sld_total: 0,
  sld_acc: '',
  sld_order: 0,
  sld_sitemno: '',
  sld_branch: branch,
  sld_ucost: 0,
  sld_itemtype: 'Item',
  sld_error: false,
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

const SalesForm = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { documentno } = useDocumentNo();
  const updateDocumentno = useUpdateDocumentno();
  const { customers } = useCustomers();
  const addSales = useAddSales();
  const updateSales = useUpdateSales();
  const addSalesDetls = useAddSalesDetls();
  const deleteSalesDetls = useDeleteSalesDetls();
  const addReceivable = useAddReceivable();
  const addItemsHistory = useAddItemsHistory();
  const { itemsonhand } = useItemsOnhand();
  const updateItemOnhand = useUpdateItemsOnhand();

  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState();
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(false);

  //const [filterText, setFilterText] = React.useState('');
  const [doctype, setDocType] = useState('Invoice');
  const [batch, setBatch] = useRecoilState(salesState);
  const [batchdetls, setBatchdetls] = useRecoilState(salesdetlsState);
  const [editBatchId, setEditBatchId] = useRecoilState(editSalesIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] = useRecoilState(
    editSalesDetlsIdState
  );
  const [doclayout, setDocLayout] = useState(editBatchId.layout);
  const [totamt, setTotAmt] = useState(batch.sls_total);
  const [totdisc, setTotDisc] = useState(batch.sls_disc);
  const [lock, setLock] = useState(batch.sls_post);

  console.log('batch', batch);
  console.log('batch detls', batchdetls);
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
      selector: row => row.sld_itemno,
      sortable: true,
      filterable: true,
      width: '150px',
    },
    {
      id: 5,
      name: 'Description',
      selector: row => row.sld_desp,
      //width: '150px',
      sortable: true,
    },
    {
      id: 6,
      name: 'Qty',
      selector: row => row.sld_qty,
      width: '150px',
      //sortable: true,
      right: true,
    },
    {
      id: 7,
      name: 'Unit',
      selector: row => row.sld_unit,
      width: '100px',
      //sortable: true,
    },
    {
      id: 8,
      name: 'Unit Price',
      selector: row => row.sld_price,
      width: '150px',
      //sortable: true,
      right: true,
      cell: row => <div>{currency(row.sld_price).format()}</div>,
    },
    {
      id: 9,
      name: 'Amount',
      selector: row => row.sld_total,
      width: '150px',
      //sortable: true,
      right: true,
      cell: row => <div>{currency(row.sld_total).format()}</div>,
    },
  ]; */

  const add_Batch = data => {
    console.log('add batch', data);
    const { sls_no } = data;
    addSales({ ...data });
    // delete old details
    //deleteSamplesBatchDetls({ sbd_batchno: sb_batchno });
    //add details
    batchdetls.forEach(rec => {
      const { pl_id, ...fields } = rec;
      addSalesDetls({ ...fields, sld_no: sls_no });
    });
  };

  const update_Batch = data => {
    console.log('edit batch', data);
    const { sls_no } = data;
    updateSales(data);
    // delete old details
    deleteSalesDetls({ sld_no: sls_no });
    //add details
    batchdetls.forEach(rec => {
      const { sld_id, ...fields } = rec;
      addSalesDetls({ ...fields });
    });
  };

  const handleCalc = () => {
    console.log('calc');
    const totalamt = batchdetls.reduce((acc, item) => {
      return acc + item.sld_total;
    }, 0);
    setValue('sls_subtotal', totalamt);
    setValue('sls_total', totalamt - totdisc);
  };

  const handleCustomerSearch = () => {
    onSearchOpen();
  };

  const update_CustDetls = data => {
    const { c_custno, c_cust, c_area, c_add1, c_add2, c_add3, c_add4 } = data;
    setBatch(
      prev =>
        (prev = {
          ...batch,
          sls_custno: c_custno,
          sls_cust: c_cust,
          sls_area: c_area,
          sls_add1: c_add1,
          sls_add2: c_add2,
          sls_add3: c_add3,
          sls_add4: c_add4,
        })
    );
    setValue('sls_custno', c_custno);
    setValue('sls_cust', c_cust);
  };

  const handlePost = () => {
    var artype = '',
      ittype = '';
    var qtyonhand = 0;
    var netprice = 0;
    const data = getValues();
    const newData = { ...data, sls_post: '1' };
    onSubmit(newData);
    switch (data.sls_type.toUpperCase()) {
      case 'INVOICE':
        artype = 'Invoice';
        ittype = 'Sales';
        break;
      case 'DEBIT NOTE':
        artype = 'Sales Debit Note';
        ittype = 'Sales';
        break;
      case 'CONTRA':
        artype = 'Invoice';
        ittype = 'Sales';
        break;
      case 'MISSING':
        artype = 'Invoice';
        ittype = 'Sales Missing';
        break;
      case 'DAMAGED':
        artype = 'Invoice';
        ittype = 'Sales Damaged';
        break;
      case 'RETURNS':
        artype = 'Credit Note';
        ittype = 'Sales Return';
        break;
      default:
        break;
    }
    const ar = {
      ...initial_ar,
      ar_invno: data.sls_no,
      ar_date: data.sls_date,
      ar_custno: data.sls_custno,
      ar_cust: data.sls_cust,
      ar_type: artype,
      ar_subtotal: data.sls_subtotal,
      ar_total: data.sls_total,
      ar_disc_amt: data.sls_disc,
      ar_balance: data.sls_total,
    };
    addReceivable(ar);
    if (data.sls_layout === 'Item' && batchdetls.length > 0) {
      batchdetls.forEach(rec => {
        // get itemonhand details
        const itemonhandrec = itemsonhand
          .filter(r => r.item_no === rec.sld_itemno)
          .map(item => {
            return { ...item };
          });
        const detlsdata = {
          ...initial_it,
          it_transno: data.sls_no,
          it_transdate: data.sls_date,
          it_transtype: ittype,
          it_scno: data.sls_custno,
          it_sc: data.sls_cust,
          it_itemno: rec.sld_itemno,
          it_qty: rec.sld_qty,
          it_value: rec.sld_price,
          it_netvalue: rec.sld_price,
          it_desp: rec.sld_desp,
          it_packing: rec.sld_packing,
          it_pfactor: rec.sld_pfactor,
          it_extvalue: rec.sld_total,
        };
        addItemsHistory(detlsdata);
        // update items onhand
        if (itemonhandrec.length > 0) {
          switch (data.sls_type.toUpperCase()) {
            case 'INVOICE':
              qtyonhand = itemonhandrec[0].item_qoh_pc - rec.sld_qty;

              break;
            case 'DEBIT NOTE':
              qtyonhand = itemonhandrec[0].item_qoh_pc + rec.sld_qty;
              break;
            case 'CONTRA':
              qtyonhand = itemonhandrec[0].item_qoh_pc - rec.sld_qty;
              break;
            case 'MISSING':
              qtyonhand = itemonhandrec[0].item_qoh_pc - rec.sld_qty;
              break;
            case 'DAMAGED':
              qtyonhand = itemonhandrec[0].item_qoh_pc - rec.sld_qty;
              break;
            case 'RETURNS':
              qtyonhand = itemonhandrec[0].item_qoh_pc + rec.sld_qty;
              break;
            default:
              break;
          }
        }
        const newData = {
          ...itemonhandrec[0],
          item_qoh_pc: qtyonhand,
        };
        console.log('post newdata', newData);
        updateItemOnhand(newData);
      });
    }
  };

  const onSubmit = values => {
    const { id, status } = editBatchId;
    if (status === 'edit') {
      console.log('edit here');
      const newData = { ...values, sls_id: id };
      update_Batch(newData);
    }
    if (status === 'add') {
      const { doc_invoice, doc_abbre } = documentno[0] || 0;
      const docno = doc_invoice;
      const newno = docno + 1;
      const newstrno = (10000000 + newno).toString().substring(1);
      const year = dayjs().year().toString().substring(2);
      const newdocno = 'INV' + year + newstrno + doc_abbre;
      const newdata = { ...values, sls_no: newdocno };
      updateDocumentno({ ...documentno[0], doc_invoice: newno });
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
    const { sld_id } = original;
    setEditBatchdetlsId(prev => (prev = { id: sld_id }));
    onAlertDeleteOpen();
  };

  const handleAddBatchDetls = () => {
    setStatusType(prev => (prev = 'add'));
    const data = {
      ...initial_batchdetls,
      sld_id: nanoid(),
      sld_branch: branch,
      sld_no: editBatchId.no,
      sld_itemtype: doctype,
      sld_layout: doclayout,
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
    const oldData = batchdetls.filter(r => r.sld_id !== data.sld_id);
    setBatchdetls([...oldData, dataUpdate]);
    setIsCalc(true);
  };

  const handleOnDelBatchDetlsConfirm = () => {
    //console.log("deldata", data)
    const { id } = editBatchdetlsId;
    const newData = batchdetls.filter(r => r.sld_id !== id);
    console.log('delete', newData);
    setBatchdetls([...newData]);
    setIsCalc(true);
  };

  const handlePrint = () => {
    navigate('/salesprint');
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
              {/*  <GridItem colSpan={1}></GridItem> */}
              <GridItem colSpan={6}>
                <Center>
                  <Heading size="lg">Sales Invoice Form</Heading>
                </Center>
              </GridItem>
              <GridItem colSpan={1}>
                {lock === '1' && <LockIcon boxSize={8} color="red" />}
              </GridItem>
              <GridItem colSpan={3}>
                <Flex>
                  <HStack mr={6}>
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
                        disabled={editBatchId.status === 'add' || lock === '1'}
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
                        name="sls_custno"
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Customer No
                            </Text>
                            <Input
                              name="sls_custno"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              placeholder="customer no"
                              minWidth="100"
                            />
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleCustomerSearch()}
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
                      name="sls_cust"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Customer
                          </Text>
                          <Input
                            name="sls_cust"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="customer"
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
                      name="sls_remark"
                      //defaultValue={invoice.sls_remark || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Remark
                          </Text>
                          <Input
                            name="sls_remark"
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
                      name="sls_subtotal"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Amount
                          </Text>
                          <Input
                            name="sls_subtotal"
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
                      name="sls_disc"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Disc
                          </Text>
                          <Input
                            name="sls_disc"
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
                      name="sls_total"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Nett Total Amount
                          </Text>
                          <Input
                            name="sls_total"
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
                      name="sls_no"
                      //defaultValue={invoice.sls_no || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Invoice No
                          </Text>
                          <Input
                            name="sls_no"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="invoice no"
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
                      name="sls_date"
                      //defaultValue={invoice.sls_date}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Invoice Date
                          </Text>

                          <Input
                            name="sls_date"
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
                      name="sls_type"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Type
                          </Text>
                          <Select
                            name="sls_type"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            //placeholder="category"
                          >
                            <option value="Invoice">Invoice</option>
                            <option value="Debit Note">Debit Note</option>
                            <option value="Missing">Missing</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Returns">Returns</option>
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
                      name="sls_oref"
                      //defaultValue={invoice.oei_type || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Our Reference No
                          </Text>
                          <Input
                            name="sls_oref"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="our reference no"
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
                      name="sls_yref"
                      //defaultValue={invoice.sls_oref ? invoice.sls_oref : ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Your Reference No
                          </Text>
                          <Input
                            name="sls_yref"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="your reference no"
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
                      name="sls_smno"
                      //defaultValue={invoice.oei_yref || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Salesman
                          </Text>
                          <Input
                            name="sls_smno"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="salesman"
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
                      name="sls_term"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Term
                          </Text>
                          <Input
                            name="sls_term"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="credit term"
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
                      name="sls_layout"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Layout
                          </Text>
                          <Select
                            name="sls_layout"
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

            <GridItem colSpan={12}>
              {doclayout === 'Service' && (
                <GridItem colSpan={12}>
                  <SalesDetlsServTable
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
                  <SalesDetlsTable
                    batchdetlsstate={batchdetls}
                    setBatchDetlsState={setBatchdetls}
                    handleAddBatchDetls={handleAddBatchDetls}
                    handleEditBatchDetls={handleEditBatchDetls}
                    handleDeleteBatchDetls={handleDeleteBatchDetls}
                  />
                </GridItem>
              )}
            </GridItem>
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
            <SalesDetlsForm
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
            <SalesDetlsServForm
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
            <CustomerSearchTable
              //state={state}
              //setState={setState}
              //add_Item={add_InvDetls}
              update_Item={update_CustDetls}
              statustype={statustype}
              setStatusType={setStatusType}
              onCustomerSearchClose={onSearchClose}
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

export default SalesForm;
