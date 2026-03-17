import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatPrice } from '../helpers/utils';
import { AddIcon } from '@chakra-ui/icons'
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

import { useGroups } from '../react-query/groups/useGroups';
import GroupForm from './GroupForm';

const initial_cust = [
  {
    c_custno: '',
    c_cust: '',
    c_add1: '',
    c_add2: '',
    c_add3: '',
    c_add4: '',
    c_phone: '',
    c_fax: '',
    c_email: '',
    c_crlimit: 0,
    c_terms: 0,
    c_contact: '',
    c_post: '',
    c_isbranch: false,
    c_glcode: '',
    c_branch: '',
    c_isposmember: false,
    c_area: '',
  },
];

const initial_group = {
  group_desp: '',
  group_category: '',
};

const CustomerForm = ({
  state,
  setState,
  add_Cust,
  update_Cust,
  statustype,
  onCustClose,
}) => {
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
    const { groups } = useGroups();
  const [grouptype, setGrouptype] = useState('');
  const [groupstatustype, setGroupStatusType] = useState('');

  const {
    isOpen: isGroupOpen,
    onOpen: onGroupOpen,
    onClose: onGroupClose,
  } = useDisclosure();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting, id },
  } = useForm({
    defaultValues: {
      ...state,
    },
  });

  const onSubmit = values => {
    //console.log('status', statustype);
    //console.log('values', values);
    if (statustype === 'edit') {
      update_Cust(values);
    }
    if (statustype === 'add') {
      //console.log('values', values);
      add_Cust(values);
    }
    onCustClose();
  };

  const handleExit = () => {
    onCustClose();
  };

  const handleAddGroup = grouptype => {
    setGrouptype(grouptype);
    setGroupStatusType(prev => (prev = 'add'));
    const data = { ...initial_group };
    setState(data);
    onGroupOpen();
  };

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
        p="2"
        spacing="10"
        //alignItems="flex-start"
      >
        <VStack pt={2} spacing="3" alignItems="center">
          <Heading size="lg">Customer Form</Heading>
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
            border="1px solid teal"
            borderRadius="20"
            //backgroundColor="blue.50"
          >
            <GridItem colSpan={2} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_custno"
                  defaultValue={state.c_custno}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Customer No
                      </Text>
                      <Input
                        name="c_custno"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="customer no"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={7} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_cust"
                  defaultValue={state.c_cust}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Customer
                      </Text>
                      <Input
                        name="c_cust"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="customer name"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_add1"
                  defaultValue={state.c_add1}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      <Text as="b" fontSize="sm">
                        Address
                      </Text>
                      <Input
                        name="c_add1"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="address"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={0}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_add2"
                  defaultValue={state.c_add2}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      {/* <Text as="b" fontSize="sm">
                        Address
                      </Text> */}
                      <Input
                        name="c_add2"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="address"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={0}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_add3"
                  defaultValue={state.c_add3}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      {/* <Text as="b" fontSize="sm">
                        Address
                      </Text> */}
                      <Input
                        name="c_add3"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="address"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={9} mt={0}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_add4"
                  defaultValue={state.c_add4}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={0} align="left">
                      {/* <Text as="b" fontSize="sm">
                        Address
                      </Text> */}
                      <Input
                        name="c_add4"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="address"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_phone"
                  defaultValue={state.c_phone}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Tel No
                      </Text>
                      <Input
                        name="c_phone"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="tel no"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_fax"
                  defaultValue={state.c_fax}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Fax
                      </Text>
                      <Input
                        name="c_fax"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="fax"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_email"
                  defaultValue={state.c_email}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Email
                      </Text>
                      <Input
                        name="c_email"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="email"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="c_contact"
                  defaultValue={state.c_contact}
                  render={({ field: { onChange, value, ref } }) => (
                    <VStack w="100%" py={1} align="left">
                      <Text as="b" fontSize="sm">
                        Contact Person
                      </Text>
                      <Input
                        name="c_contact"
                        value={value || ''}
                        width="full"
                        onChange={onChange}
                        borderColor="gray.400"
                        //textTransform="capitalize"
                        ref={ref}
                        placeholder="contact person"
                      />
                    </VStack>
                  )}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="c_area"
                    defaultValue={state.c_area}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack w="100%" py={1} align="left">
                        <Text as="b" fontSize="sm">
                          Area
                        </Text>
                        <Select
                          name="c_area"
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
                              .filter(r => r.group_category === 'Area')
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
                    onClick={() => handleAddGroup('Area')}
                    icon={<AddIcon />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
            </GridItem>
            <GridItem colSpan={3} mt={field_gap}>
              <HStack>
                <FormControl>
                  <Controller
                    control={control}
                    name="c_terms"
                    defaultValue={state.c_terms}
                    render={({ field: { onChange, value, ref } }) => (
                      <VStack w="100%" py={1} align="left">
                        <Text as="b" fontSize="sm">
                          Credit Terms
                        </Text>
                        <Select
                          name="c_terms"
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
                              .filter(r => r.group_category === 'Credit Terms')
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
                    onClick={() => handleAddGroup('Credit Terms')}
                    icon={<AddIcon />}
                    size="md"
                    colorScheme="teal"
                  />
                </Box>
              </HStack>
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
        isOpen={isGroupOpen}
        onClose={onGroupClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Product Form</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <GroupForm
              state={state}
              setState={setState}
              statustype={groupstatustype}
              onGroupClose={onGroupClose}
              grouptype={grouptype}
            />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onProductClose}>
              Close
              </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default CustomerForm;
