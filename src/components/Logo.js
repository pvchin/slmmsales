import React from 'react';
import { Box, Text, Heading, HStack } from '@chakra-ui/react';

export default function Logo(props) {
  return (
    <Box {...props}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color="teal">
          LOGO
        </Text>
        <Heading size="md" color="teal">
          Inventory Management System
        </Heading>
      </HStack>
    </Box>
  );
}
