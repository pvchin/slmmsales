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

async function getAllReceivable() {
  const { allReceivableByBranch } = await graphQLClient.request(
    gql`
      query getReceivable($branch: String) {
        allReceivableByBranch(branch: $branch) {
          ar_id
          ar_invno
          ar_date
          ar_custno
          ar_cust
          ar_type
          ar_subtotal
          ar_paid
          ar_disc_amt
          ar_disc_taken
          ar_balance
          ar_total
          ar_branch
          ar_paid
          ar_glcode
          ar_paid_disc
          ar_paid_amt
        }
      }
    `,
    { branch }
  );
  return allReceivableByBranch;
}

async function getReceivableByCustno(custno) {
  const { allReceivableByCustno } = await graphQLClient.request(
    gql`
      query getReceivable($custno: String, $branch: String) {
        allReceivableByCustno(custno: $custno, branch: $branch) {
          ar_id
          ar_invno
          ar_date
          ar_custno
          ar_cust
          ar_type
          ar_subtotal
          ar_paid
          ar_disc_amt
          ar_disc_taken
          ar_balance
          ar_total
          ar_branch
          ar_paid
          ar_glcode
          ar_paid_disc
          ar_paid_amt
        }
      }
    `,
    { custno, branch }
  );
  return allReceivableByCustno;
}

export function useReceivable() {
  const [arcustno, setARCustno] = useState('');

  const fallback = [];
  const { data: receivable = fallback } = useQuery({
    queryKey: [queryKeys.receivable, arcustno],
    queryFn: () =>
      arcustno ? getReceivableByCustno(arcustno) : getAllReceivable(),
  });

  return { receivable, setARCustno };
}
