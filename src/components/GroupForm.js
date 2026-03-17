import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatPrice } from '../helpers/utils';
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

import { useCustomers } from '../react-query/customers/useCustomers';
import { useGroups } from '../react-query/groups/useGroups';
import { useAddGroup } from '../react-query/groups/useAddGroup';
import { useUpdateGroup} from '../react-query/groups/useUpdateGroup'
// const initial_group = [
//   {
//     group_desp: '',
//     group_category: '',
//   },
// ];

const GroupForm = ({
  state,
  setState,
  statustype,
  onGroupClose,
  grouptype,
}) => {
  const navigate = useNavigate();
  const field_width = '150';
  const field_gap = '3';
  const { customers } = useCustomers();
  const addGroup = useAddGroup();
  //console.log('statustype', statustype);
  //console.log('Status', state);
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
    //console.log('values', values);
    if (statustype === 'edit') {
      update_Group(values);
    }
    if (statustype === 'add') {
      //console.log('values', values);
      add_Group(values);
    }
    onGroupClose();
  };

  const handleExit = () => {
    onGroupClose();
  };

  const add_Group = data => {
    addGroup(data);
  };

  const update_Group = data => {
    //updateGroup(data);
    onGroupClose();
  };

  useEffect(() => {
    setValue('group_category', grouptype);
  }, []);

  return (
    <Flex
      h={{ base: 'auto', md: 'auto' }}
      py={[0, 0, 0]}
      direction={{ base: 'column-reverse', md: 'row' }}
      //overflowY="scroll"
    >
      <VStack
        w={{ base: 'auto', md: 'full' }}
        h={{ base: 'auto', md: 'full' }}
        p="2"
        spacing="10"
        //alignItems="flex-start"
      >
        <VStack pt={2} spacing="3" alignItems="center">
          <Heading size="lg">{grouptype} Form</Heading>
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
            <GridItem colSpan={3} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="group_category"
                  defaultValue={state.group_category}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Category"
                          minWidth={field_width}
                        />
                        <Input
                          name="group_category"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="category"
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
                  name="group_desp"
                  defaultValue={state.group_desp}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Description"
                          minWidth={field_width}
                        />
                        <Input
                          name="group_desp"
                          value={value}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="description"
                          minWidth="200"
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
    </Flex>
  );
};

export default GroupForm;
