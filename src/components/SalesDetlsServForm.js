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

const SalesDetlsServForm = ({
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
  //const [qty, setQty] = useState(state.pl_qty);
  //const [ucost, setUCost] = useState(state.pl_netucost);

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
          <Heading size="lg">Purchase Details Form</Heading>
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
            <GridItem colSpan={9} mt={field_gap}>
              <FormControl>
                <Controller
                  control={control}
                  name="sld_desp"
                  defaultValue={state.sld_desp}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Description"
                          minWidth={field_width}
                        />
                        <Input
                          name="sld_desp"
                          value={value || ''}
                          width="full"
                          onChange={onChange}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="service description"
                          minWidth="600"
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
                  name="sld_total"
                  defaultValue={state.sld_total}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputGroup>
                      <HStack w="100%" py={1}>
                        <InputLeftAddon
                          children="Amount"
                          minWidth={field_width}
                        />
                        <Input
                          name="sld_total"
                          value={value || 0}
                          type="number"
                          width="200"
                          onChange={e => onChange(parseFloat(e.target.value))}
                          borderColor="gray.400"
                          //textTransform="capitalize"
                          ref={ref}
                          placeholder="amount"
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
    </Flex>
  );
};
export default SalesDetlsServForm;
