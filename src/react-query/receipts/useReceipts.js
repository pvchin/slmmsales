import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';
import { branch } from '../../utils/constants';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllReceipts() {
  const { allReceiptsByBranch } = await graphQLClient.request(
    gql`
      query getReceipts($branch: String) {
        allReceiptsByBranch(branch: $branch) {
          rcp_id
          rcp_no
          rcp_date
          rcp_bank
          rcp_refno
          rcp_remark
          rcp_custno
          rcp_customer
          rcp_total
          rcp_disc
          rcp_nettotal
          rcp_post
          rcp_branch
        }
      }
    `,
    { branch }
  );
  return allReceiptsByBranch;
}

async function getReceiptsByCustno(custno) {
  const { allReceiptsByCustno } = await graphQLClient.request(
    gql`
      query getReceipts($custno: String, $branch: String) {
        allReceiptsByCustno(custno: $custno, branch: $branch) {
          rcp_id
          rcp_no
          rcp_date
          rcp_bank
          rcp_refno
          rcp_remark
          rcp_custno
          rcp_customer
          rcp_total
          rcp_disc
          rcp_nettotal
          rcp_post
          rcp_branch
        }
      }
    `,
    { custno, branch }
  );
  return allReceiptsByCustno;
}

export function useReceipts() {
  const [rcpcustno, setRcpCustno] = useState('');

  const fallback = [];
  const { data: receipts = fallback } = useQuery({
    queryKey: [queryKeys.receipts, rcpcustno],
    queryFn: () =>
      rcpcustno ? getReceiptsByCustno(rcpcustno) : getAllReceipts(),
  });

  return { receipts, setRcpCustno };
}
