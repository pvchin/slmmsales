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

async function getPayable() {
  const { allPayableByBranch } = await graphQLClient.request(
    gql`
      query getPayable($branch: String) {
        allPayableByBranch(branch: $branch) {
          ap_id
          ap_pono
          ap_podate
          ap_invno
          ap_invdate
          ap_recdate
          ap_suppno
          ap_supplier
          ap_type
          ap_subtotal_amt
          ap_nettotal_amt
          ap_disc_amt
          ap_disc_taken
          ap_dc
          ap_acc
          ap_paid
          ap_balance
          ap_branch
          ap_glcode
          ap_paid_disc
        }
      }
    `,
    { branch }
  );
  return allPayableByBranch;
}

async function getPayableBySuppno(suppno) {
  const { allPayableBySuppno } = await graphQLClient.request(
    gql`
      query getPayable($suppno: String, $branch: String) {
        allPayableBySuppno(suppno: $suppno, branch: $branch) {
          ap_id
          ap_pono
          ap_podate
          ap_invno
          ap_invdate
          ap_recdate
          ap_suppno
          ap_supplier
          ap_type
          ap_subtotal_amt
          ap_nettotal_amt
          ap_disc_amt
          ap_disc_taken
          ap_dc
          ap_acc
          ap_paid
          ap_balance
          ap_branch
          ap_glcode
          ap_paid_disc
        }
      }
    `,
    { suppno, branch }
  );
  return allPayableBySuppno;
}

export function usePayable() {
  const [apsuppno, setAPSuppno] = useState('');

  const fallback = [];
  const { data: payable = fallback } = useQuery({
    queryKey: [queryKeys.payable, apsuppno],
    queryFn: () => (apsuppno ? getPayableBySuppno(apsuppno) : getPayable()),
  });

  return { payable, setAPSuppno };
}
