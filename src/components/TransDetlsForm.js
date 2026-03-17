import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatPrice } from '../helpers/utils';
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
import { NumberInput } from '@mantine/core';
import { useItems } from '../react-query/items/useItems';
import ItemSearchTable from './ItemSearchTable';

const TranDetlsForm = ({
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
  const [qty, setQty] = useState(state.tl_qty);
  const [ucost, setUCost] = useState(state.tl_netucost);

  //console.log('batchdetls state', state);
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
    //console.log('status', statustype);
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

  const update_ItemDetls = data => {
    console.log('upditem', data);
    const { item_no, item_desp, item_packing, item_unit, item_ucost_pc } = data;
    setValue('tl_itemno', item_no);
    setValue('tl_desp', item_desp);
    setValue('tl_packing', item_packing);
    setValue('tl_unit', item_unit);
    setValue('tl_ucost', item_ucost_pc);
    setValue('tl_netucost', item_ucost_pc);
    setQty(prev => (prev = 0));
    setUCost(prev => (prev = item_ucost_pc));
  };

  const update_extamount = data => {
    console.log('calc amt', data, state.tl_netucost, state.tl_qty);
  };

  const handleItemSearch = () => {
    onSearchOpen();
  };

  useEffect(() => {
    const amt = Math.round(qty * ucost, 2);
    setValue('tl_excost', amt);
    console.log('recalc', amt, qty, ucost);
  }, [qty, ucost]);

  return (
    <Flex
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="0"
        spacing="10"
        //alignItems="flex-start"
      >
        <VStack pt={1} spacing="3" alignItems="center">
          <Heading size="lg">Details Form</Heading>
        </VStack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            templateColumns="9"
            templateRows="7"
            columnGap={3}
            rowGap={3}
            px={5}
            py={2}
            w={{ base: 'auto', md: 'full' }}
            border="1px solid teal"
            borderRadius="20"
            backgroundColor="teal.50"
          >
            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="tl_itemno"
                    defaultValue={state.tl_itemno}
                    render={({ field: { onChange, value, ref } }) => (
                      <InputGroup>
                        <HStack w="100%" py={1}>
                          <InputLeftAddon
                            children="Item No"
                            minWidth={field_width}
                          />
                          <Input
                            name="tl_itemno"
                            value={value || ''}
                            width="full"
                            onChange={onChange}
                            borderColor="gray.400"
                            //textTransform="capitalize"
                            ref={ref}
                            placeholder="item no"
                            minWidth="100"
                          />
                        </HStack>
                      </InputGroup>
                    )}
                  />
                </FormControl>
                <Box pt={0}>
                  <IconButton
                    onClick={() => handleItemSearch()}
                    icon={<AiOutlineSearch />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_desp"
                  defaultValue={state.tl_desp}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Description"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_desp"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item description"
                          minWidth="200"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem>
            {/*  <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_packing"
                  defaultValue={state.tl_packing}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Packing"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_packing"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="item packing"
                          minWidth="500"
                        />
                      </HStack>
                    </InputGroup>
                  )}
                />
              </FormControl>
            </GridItem> */}
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="tl_qty"
                  defaultValue={state.tl_qty}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon children="Qty" minWidth={field_width} />
                        <NumberInput
                          name="tl_qty"
                          value={value || 0}
                          width="full"
                          precision={2}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          formatter={value =>
                            !Number.isNaN(parseFloat(value))
                              ? ` ${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ','
                                )
                              : ' '
                          }
                          onChange={e => {
                            onChange(e);
                            setQty(prev => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="qty"
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
                  name="tl_unit"
                  defaultValue={state.tl_unit}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Unit"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_unit"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="unit"
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
                  name="tl_netucost"
                  defaultValue={state.tl_netucost}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Unit Price"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_netucost"
                          value={value || 0}
                          //type="number"
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
                            onChange(e);
                            setUCost(prev => (prev = e));
                          }}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="unit cost"
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
                  name="tl_excost"
                  defaultValue={state.tl_excost}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Amount"
                          minWidth={field_width}
                        />
                        <NumberInput
                          name="tl_excost"
                          value={value || 0}
                          //type="number"
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
                          onChange={e => onChange(e)}
                          //borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          //placeholder="amount"
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
                  name="tl_remark"
                  defaultValue={state.tl_remark}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Remark"
                          minWidth={field_width}
                        />
                        <Input
                          name="tl_remark"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="remark"
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
                Submit
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
      <Modal
        closeOnOverlayClick={false}
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <ItemSearchTable
              state={state}
              setState={setState}
              //add_Item={add_InvDetls}
              update_Item={update_ItemDetls}
              statustype={statustype}
              //setStatusType={setStatusType}
              onItemSearchClose={onSearchClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
export default TranDetlsForm;
