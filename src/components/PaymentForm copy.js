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
  Icon,
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
import {
  //AiFillEdit,
  //AiFillDelete,
  //AiOutlinePlus,
  //AiOutlineSearch,
  AiOutlineForm,
  AiOutlineArrowLeft,
} from 'react-icons/ai';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  LockIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import { TiArrowBack } from 'react-icons/ti';
import { useRecoilState } from 'recoil';
import {
  paymentState,
  paymentdetlsState,
  editPaymentIdState,
  editPaymentDetlsIdState,
} from '../data/atomdata';
//import { usePurchases } from '../react-query/purchases/usePurchases';
import { useAddPayment } from '../react-query/payments/useAddPayment';
import { useUpdatePayment } from '../react-query/payments/useUpdatePayment';
//import { useDeletePurchase } from '../react-query/purchases/useDeletePurchase';
import { usePaymentDetls } from '../react-query/paymentsdetls/useAddPaymentDetls';
import { useAddPaymentDetls } from '../react-query/paymentsdetls/useAddPaymentDetls';
import { useDeletePaymentDetls } from '../react-query/paymentsdetls/useDeletePaymentDetls';
import { useSuppliers } from '../react-query/suppliers/useSuppliers';
import { useDocumentNo } from '../react-query/documentno/useDocumentNo';
import { useUpdateDocumentno } from '../react-query/documentno/useUpdateDocumentNo';
import { usePayable } from '../react-query/payable/usePayable';
import { useUpdatePayable } from '../react-query/payable/useUpdatePayable';
import SupplierSearchTable from './SupplierSearchTable';
import PaymentDetlsTable from './PaymentDetlsTable';
import PaymentDetlsForm from './PaymentDetlsForm';
import PaymentDetlsTableNew from './PaymentDetlsTableNew';
import { useGroups } from '../react-query/groups/useGroups';
import GroupForm from './GroupForm';

const initial_batchdetls = {
  payd_id: '',
  payd_no: '',
  payd_invno: '',
  payd_invdate: null,
  payd_pono: '',
  payd_podate: null,
  payd_invamt: 0,
  payd_last_bal: 0,
  payd_disc: 0,
  payd_amt: 0,
  payd_apid: 0,
  payd_recdate: null,
  payd_branch: '',
  payd_paydate: null,
};

const initial_group = {
  group_desp: '',
  group_category: '',
};

const PaymentForm = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { documentno } = useDocumentNo();
  const updateDocumentno = useUpdateDocumentno();
  const { suppliers } = useSuppliers();
  const { payable, setAPSuppno } = usePayable();
  const addPayment = useAddPayment();
  const updatePayment = useUpdatePayment();
  const addPaymentDetls = useAddPaymentDetls();
  const deletePaymentDetls = useDeletePaymentDetls();
  const updatePayable = useUpdatePayable();

  const [singlebatchdetlsstate, setSingleBatchDetlsState] = useState();
  const [statustype, setStatusType] = useState('');
  const [isCalc, setIsCalc] = useState(false);

  //const [filterText, setFilterText] = React.useState('');
  const [doctype, setDocType] = useState('Purchase');
  const [batch, setBatch] = useRecoilState(paymentState);
  const [batchdetls, setBatchdetls] = useRecoilState(paymentdetlsState);
  const [newbatchdetls, setNewBatchdetls] = useState([])
  const [editBatchId, setEditBatchId] = useRecoilState(editPaymentIdState);
  const [editBatchdetlsId, setEditBatchdetlsId] = useRecoilState(
    editPaymentDetlsIdState
  );
  const { groups } = useGroups();
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');
  const [doclayout, setDocLayout] = useState(editBatchId.layout);
  const [totamt, setTotAmt] = useState(batch.po_subtotal);
  const [totdisc, setTotDisc] = useState(batch.po_disc);
  const [lock, setLock] = useState(batch.po_post);
  const [groupstate, setGroupState] = useState('');
  const [suppno, setSuppno] = useState('');

  // if (suppno.length > 0) {
  //   setBatchdetls(prev => prev = {...payable})
  // } else {
  //   setBatchdetls(initial_batchdetls)
  // }

  console.log('batch', batch);
  console.log('batch detls', batchdetls);
  console.log('edit batch', editBatchId);
  //console.log('doc', documentno);
  console.log('new batchdetls', newbatchdetls)

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
    isOpen: isBatchDetlsAddOpen,
    onOpen: onBatchDetlsAddOpen,
    onClose: onBatchDetlsAddClose,
  } = useDisclosure();

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const {
    isOpen: isGroupOpen,
    onOpen: onGroupOpen,
    onClose: onGroupClose,
  } = useDisclosure();

  const {
    po_no,
    po_date,
    po_type,
    po_suppno,
    po_supp,
    po_term,
    po_invno,
    po_branch,
    po_remark,
    po_post,
    po_print,
    po_subtotal,
    po_disc,
    po_nettotal,
    po_layout,
    po_postdate,
    po_glcode,
    po_dodate,
    po_invdate,
    po_recdate,
    po_sono,
    po_createdby,
    po_updby,
    po_createddate,
    po_createdtime,
    po_upddate,
    po_updtime,
  } = batch;

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

  const columns_ap = [
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
      id: 10,
      name: 'Branch',
      selector: row => row.ap_branch,
      sortable: true,
      filterable: true,
      width: '100px',
    },
  ];
  const add_Batch = data => {
    console.log('add batch', data);
    const { po_no } = data;
    addPayment({ ...data });
    // delete old details
    //deleteSamplesBatchDetls({ sbd_batchno: sb_batchno });
    //add details
    batchdetls.forEach(rec => {
      const { pl_id, ...fields } = rec;
      addPaymentDetls({ ...fields, pl_pono: po_no });
    });
  };

  const update_Batch = data => {
    console.log('edit batch', data);
    const { po_no } = data;
    updatePayment(data);
    // delete old details
    deletePaymentDetls({ pl_pono: po_no });
    //add details
    batchdetls.forEach(rec => {
      const { pl_id, ...fields } = rec;
      addPaymentDetls({ ...fields });
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
    const { s_suppno, s_supp } = data;
    setAPSuppno(prev => (prev = s_suppno));
    setSuppno(prev => s_suppno);
    setBatch(
      prev => (prev = { ...batch, po_suppno: s_suppno, po_supp: s_supp })
    );
    setValue('pay_suppno', s_suppno);
    setValue('pay_supp', s_supp);
    
  };

  const update_ap = () => {
    console.log('ap here', suppno, payable);

    payable
      .filter(r => r.ap_suppno === suppno)
      .forEach(rec => {
        const newData = {
          ...initial_batchdetls,
          payd_id: '',
          payd_no: '',
          payd_invno: rec.pay_invno,
          payd_invdate: rec.pay_invdate,
          payd_pono: rec.ap_pono,
          payd_podate: rec.ap_podate,
          payd_invamt: rec.ap_nettotal,
          payd_last_bal: rec.ap_balance,
          payd_disc: 0,
          payd_amt: 0,
        };

        setNewBatchdetls(
          prev =>
            (prev = {
              ...batchdetls,
              ...newData,
            })
        );
        console.log('ap new data', newData);
      });
  };

  const handleSearchSupp = data => {
    const result = suppliers.filter(r => r.s_suppno === data);
    update_SuppDetls(...result);
  };

  const handlePost = () => {
    var doctype = '';
    const data = getValues();
    const newData = { ...data, po_post: '1' };
    onSubmit(newData);

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
      const { doc_invoice, doc_abbre } = documentno[0] || 0;
      const docno = doc_invoice;
      const newno = docno + 1;
      const newstrno = (10000000 + newno).toString().substring(1);
      const year = dayjs().year().toString().substring(2);
      const newdocno = 'POH' + year + newstrno + doc_abbre;
      const newdata = { ...values, po_no: newdocno };
      updateDocumentno({ ...documentno[0], doc_invoice: newno });
      add_Batch(newdata);
    }

    //console.log('addpurchase', statustype, newstrno, newdata);
    navigate(-1);
  };

  const handleExit = () => {
    navigate(-1);
  };

  const handleEditBatchDetls = data => {
    setStatusType(prev => (prev = 'edit'));
    setSingleBatchDetlsState(data);
    onBatchDetlsOpen(true);
  };

  const handleDeleteBatchDetls = data => {
    const { pl_id } = data;
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
    onBatchDetlsOpen(true);
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

  const handleAddGroup = grouptype => {
    setGrouptype(grouptype);
    setGroupStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setGroupState(data);
    onGroupOpen();
  };

  useEffect(() => {
    handleCalc();
    setIsCalc(false);
  }, [isCalc, totamt, totdisc]);

  // useEffect(() => {
  //   update_ap();
  // }, [suppno]);

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
              <GridItem colSpan={7}>
                <Center>
                  <Heading size="lg">Payment Voucher Form</Heading>
                </Center>
              </GridItem>
              <GridItem colSpan={1}>
                {lock === '1' && <LockIcon boxSize={8} color="red" />}
              </GridItem>
              <GridItem colSpan={2}>
                <Flex>
                  <HStack mr={5}>
                    <ButtonGroup>
                      <Button
                        leftIcon={<AiOutlineForm />}
                        colorScheme="teal"
                        //type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={editBatchId.status === 'edit'}
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
                      {/* <Button
                        leftIcon={<ExternalLinkIcon />}
                        colorScheme="teal"
                        onClick={handlePost}
                        disabled={editBatchId.status === 'add'}
                      >
                        Post
                      </Button> */}
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
                        name="pay_suppno"
                        //defaultValue={invoice.sls_custno || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Supplier No
                            </Text>
                            <Input
                              name="pay_suppno"
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
                      name="pay_supplier"
                      //defaultValue={invoice.sls_cust || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Supplier
                          </Text>
                          <Input
                            name="pay_supplier"
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
                      name="pay_remark"
                      //defaultValue={invoice.sls_remark || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Remark
                          </Text>
                          <Input
                            name="pay_remark"
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
              </Grid>
            </GridItem>
            <GridItem colSpan={6}>
              <Grid templateColumns={'repeat(6,1fr)'} columnGap={3}>
                <GridItem colSpan={2} mt={field_gap} w="100%">
                  <FormControl>
                    <Controller
                      control={control}
                      name="pay_no"
                      //defaultValue={invoice.sls_no || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Payment Voucher No
                          </Text>
                          <Input
                            name="pay_no"
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
                      name="pay_date"
                      //defaultValue={invoice.sls_date}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Payment Date
                          </Text>

                          <Input
                            name="pay_date"
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
                      name="pay_refno"
                      //defaultValue={invoice.sls_smno || ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Reference No
                          </Text>
                          <Input
                            name="pay_refno"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="reference no"
                            minWidth="100"
                          />
                        </VStack>
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <HStack>
                    <FormControl>
                      <Controller
                        control={control}
                        name="pay_bank"
                        //defaultValue={invoice.oei_type || ''}
                        render={({ field: { onChange, value, ref } }) => (
                          <VStack align="left">
                            <Text as="b" fontSize="sm" textAlign="left">
                              Bank
                            </Text>
                            <Select
                              name="pay_bank"
                              value={value || ''}
                              width="full"
                              onChange={onChange}
                              borderColor="gray.400"
                              //textTransform="capitalize"
                              ref={ref}
                              //placeholder="category"
                            >
                              <option value="">None</option>
                              {groups &&
                                groups
                                  .filter(r => r.group_category === 'Bank')
                                  .map(rec => {
                                    return (
                                      <option
                                        key={rec.group_id}
                                        value={rec.group_desp}
                                      >
                                        {rec.group_desp}
                                      </option>
                                    );
                                  })}
                            </Select>
                          </VStack>
                        )}
                      />
                    </FormControl>
                    <Box pt={7}>
                      <IconButton
                        onClick={() => handleAddGroup('Bank')}
                        icon={<AddIcon />}
                        size="md"
                        colorScheme="teal"
                      />
                    </Box>
                  </HStack>
                </GridItem>
                <GridItem colSpan={2} mt={field_gap}>
                  <FormControl>
                    <Controller
                      control={control}
                      name="pay_nettotal"
                      //defaultValue={invoice.sls_oref ? invoice.sls_oref : ''}
                      render={({ field: { onChange, value, ref } }) => (
                        <VStack align="left">
                          <Text as="b" fontSize="sm" textAlign="left">
                            Total Amount
                          </Text>
                          <Input
                            name="pay_nettotal"
                            value={value || ''}
                            type="number"
                            align="right"
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="total amount"
                            minWidth="100"
                          />
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
            {editBatchId.status === 'edit' && (
              <GridItem colSpan={12}>
                <PaymentDetlsTable
                  batchdetlsstate={batchdetls}
                  setBatchDetlsState={setBatchdetls}
                  handleAddBatchDetls={handleAddBatchDetls}
                  handleEditBatchDetls={handleEditBatchDetls}
                  handleDeleteBatchDetls={handleDeleteBatchDetls}
                />
              </GridItem>
            )}
            {editBatchId.status === 'add' && (
              <GridItem colSpan={12}>
                <PaymentDetlsTableNew
                  batchdetlsstate={newbatchdetls}
                  setBatchDetlsState={setNewBatchdetls}
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
        isOpen={isBatchDetlsAddOpen}
        onClose={onBatchDetlsAddClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <PaymentDetlsForm
              state={singlebatchdetlsstate}
              setState={setSingleBatchDetlsState}
              add_Item={add_BatchDetls}
              update_Item={update_BatchDetls}
              statustype={statustype}
              onItemClose={onBatchDetlsAddClose}
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
        isOpen={isBatchDetlsOpen}
        onClose={onBatchDetlsClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <PaymentDetlsForm
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
      <Modal
        closeOnOverlayClick={false}
        isOpen={isGroupOpen}
        onClose={onGroupClose}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            {/* <ScaleFade initialScale={0.9} in={isGroupOpen}> */}
            <GroupForm
              state={groupstate}
              setState={setGroupState}
              statustype={groupstatustype}
              onGroupClose={onGroupClose}
              grouptype={grouptype}
            />
            {/* </ScaleFade> */}
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

export default PaymentForm;
