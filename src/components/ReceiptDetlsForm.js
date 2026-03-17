import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatPrice } from '../helpers/utils';
import { round } from 'lodash';
import { FiSave } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { ImExit } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
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

import { useItems } from '../react-query/items/useItems';
import ItemSearchTable from './ItemSearchTable';

const ReceiptDetlsForm = ({
  state,
  setState,
  statustype,
  add_Item,
  update_Item,
  onItemClose,
}) => {
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const [disc, setDisc] = useState(state.payd_disc);
  const [bal, setBal] = useState(0);
  const [invamt, setInvamt] = useState(state.payd_last_bal);
  const [paidamt, setPaidAmt] = useState(state.payd_amt);
  const [iscalc, setIsCalc] = useState(true);

  console.log('batchdetls state', state);
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
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const onSubmit = values => {
    console.log('status', statustype);
    if (statustype === 'edit') {
      update_Item(values);
    }
    if (statustype === 'add') {
      add_Item(values);
    }
    onItemClose();
  };

  const handleExit = () => {
    onItemClose();
  };

  const handleCalc = () => {
    const netamt = round(invamt - disc, 2);
    const bal = round(netamt - paidamt, 2);
    //setValue('payd_amt', netamt)
    setBal(prev => (prev = bal));
    setValue('payd_due', bal);
  };

  // const update_extamount = data => {
  //   console.log('calc amt', data, state.pl_netucost, state.pl_qty);
  // };

  // const handleItemSearch = () => {
  //   onSearchOpen();
  // };

  useEffect(() => {
    handleCalc();
    setIsCalc(false);
  }, [iscalc, disc, paidamt]);

  useEffect(() => {
    handleCalc();
  }, []);

  return (
    <Flex
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="auto"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //alignItems="flex-start"
      >
        <VStack pt={2} spacing="3" alignItems="center">
          <Heading size="lg">Receipt Details Form</Heading>
        </VStack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            templateColumns="9"
            templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full', lg: 'full' }}
            border="1px solid blue"
            borderRadius="20"
            backgroundColor="blue.50"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="rcpd_invno"
                    defaultValue={state.rcpd_invno}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="Invoice No"
                            minWidth={field_width}
                          />
                          <Input
                            name="rcpd_invno"
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
                        </HStack>
                      </InputGroup>
                    )}
                  />
                </FormControl>
              </HStack>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="rcpd_invdate"
                  defaultValue={state.rcpd_invdate}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Invoice Date"
                          minWidth={field_width}
                        />
                        <Input
                          name="rcpd_invdate"
                          value={value || ''}
                          type="date"
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="invoice date"
                          minWidth="100"
                          readOnly
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
           
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="rcpd_invamt"
                  defaultValue={state.rcpd_invamt}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Invoice Amount"
                          minWidth={field_width}
                        />
                        <Input
                          name="rcpd_invamt"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="invoice amount"
                          minWidth="100"
                          readOnly
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="rcpd_last_bal"
                  defaultValue={state.rcpd_last_bal}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Balance Due"
                          minWidth={field_width}
                        />
                        <Input
                          name="rcpd_last_bal"
                          value={value || 0}
                          type="number"
                          width="full"
                          onChange={e => {
                            onChange(parseFloat(e.target.value));
                            // setUCost(
                            //   prev => (prev = parseFloat(e.target.value))
                            // );
                          }}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="balance due"
                          minWidth="100"
                          readOnly
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="rcpd_disc"
                  defaultValue={state.rcpd_disc}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Paid Discount"
                          minWidth={field_width}
                        />
                        <Input
                          name="rcpd_disc"
                          value={value || 0}
                          type="number"
                          width="full"
                          onChange={e => {
                            onChange(parseFloat(e.target.value));
                            setDisc(
                              prev => (prev = parseFloat(e.target.value))
                            );
                          }}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="paid discount"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="rcpd_amt"
                  defaultValue={state.rcpd_amt}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Paid Amount"
                          minWidth={field_width}
                        />
                        <Input
                          name="rcpd_amt"
                          value={value || 0}
                          type="number"
                          width="full"
                          onChange={e => {
                            onChange(parseFloat(e.target.value));
                            setPaidAmt(
                              prev => (prev = parseFloat(e.target.value))
                            );
                          }}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="paid amount"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="rcpd_due"
                  //defaultValue={state.payd_last_bal}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Outstandings"
                          minWidth={field_width}
                        />
                        <Input
                          name="rcpd_due"
                          value={value || 0}
                          type="number"
                          width="full"
                          onChange={e => {
                            onChange(parseFloat(e.target.value));
                            setPaidAmt(
                              prev => (prev = parseFloat(e.target.value))
                            );
                          }}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="outstanding balance"
                          minWidth="100"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
          </Grid>
          <Box>
            <Center>
              <Button
                mt={4}
                ml={4}
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Apply
              </Button>
              <Button
                mt={4}
                ml={10}
                colorScheme="teal"
                isLoading={isSubmitting}
                onClick={handleExit}
              >
                Close
              </Button>
            </Center>
          </Box>
        </form>
      </VStack>
    </Flex>
  );
};

export default ReceiptDetlsForm;
