import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getCustomers() {
  const { allCustomers } = await graphQLClient.request(gql`
    query {
      allCustomers {
        c_custid
        c_custno
        c_cust
        c_add1
        c_add2
        c_add3
        c_add4
        c_phone
        c_fax
        c_email
        c_crlimit
        c_terms
        c_contact
        c_post
        c_isbranch
        c_glcode
        c_branch
        c_isposmember
        c_area
      }
    }
  `);
  return allCustomers;
}

export function useCustomers() {
  const [custId, setCustId] = useState('');

  const fallback = [];
  const { data: customers = fallback } = useQuery({
    queryKey: [queryKeys.customers, custId],
    queryFn: () => getCustomers(),
  });

  return { customers, setCustId };
}
