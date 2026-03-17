import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterById } from './utils';

import axios from 'axios';
import { queryKeys } from '../constants';
import { branch } from '../../utils/constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getAllPurchases() {
  const { allPurchasesByBranch } = await graphQLClient.request(
    gql`
      query getPurchases($branch: String) {
        allPurchasesByBranch(branch: $branch) {
          po_id
          po_no
          po_date
          po_type
          po_suppno
          po_supp
          po_add1
          po_add2
          po_add3
          po_add4
          po_term
          po_invno
          po_branch
          po_remark
          po_post
          po_print
          po_subtotal
          po_disc
          po_nettotal
          po_layout
          po_postdate
          po_glcode
          po_dodate
          po_invdate
          po_recdate
          po_sono
          po_createdby
          po_updby
          po_createddate
          po_createdtime
          po_upddate
          po_updtime
        }
      }
    `,
    { branch }
  );
  return allPurchasesByBranch;
}

async function getPurchasesBySuppno(suppno) {
  const { allPurchasesBySuppno } = await graphQLClient.request(
    gql`
      query getPurchases($suppno: String, $branch: String) {
        allPurchasesBySuppno(suppno: $suppno, branch: $branch) {
          po_id
          po_no
          po_date
          po_type
          po_suppno
          po_supp
          po_add1
          po_add2
          po_add3
          po_add4
          po_term
          po_invno
          po_branch
          po_remark
          po_post
          po_print
          po_subtotal
          po_disc
          po_nettotal
          po_layout
          po_postdate
          po_glcode
          po_dodate
          po_invdate
          po_recdate
          po_sono
          po_createdby
          po_updby
          po_createddate
          po_createdtime
          po_upddate
          po_updtime
        }
      }
    `,
    { suppno, branch }
  );
  return allPurchasesBySuppno;
}

export function usePurchases() {
  const [posuppno, setPOSuppno] = useState('');

  const fallback = [];
  const { data: purchases = fallback } = useQuery({
    queryKey: [queryKeys.purchases, posuppno],
    queryFn: () =>
      posuppno ? getPurchasesBySuppno(posuppno) : getAllPurchases(),
  });

  return { purchases, setPOSuppno };
}
