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

async function getAllSalesDetls() {
  const { allSalesDetlsByBranch } = await graphQLClient.request(
    gql`
      query getSalesDetlsByBranch($branch: String) {
        allSalesDetlsByBranch(branch: $branch) {
          sld_id
          sld_no
          sld_itemno
          sld_desp
          sld_brand
          sld_packing
          sld_pfactor
          sld_unit
          sld_qty
          sld_price
          sld_total
          sld_acc
          sld_order
          sld_sitemno
          sld_branch
          sld_ucost
          sld_itemtype
          sld_error
        }
      }
    `,
    { branch }
  );
  return allSalesDetlsByBranch;
}

async function getSalesDetlsByInvno(invno) {
  const { allSalesDetlsByInvno } = await graphQLClient.request(
    gql`
      query getSalesDetlsByInvno($branch: String, $invno: String) {
        allSalesDetlsByInvno(branch: $branch, invno: $invno) {
          sld_id
          sld_no
          sld_itemno
          sld_desp
          sld_brand
          sld_packing
          sld_pfactor
          sld_unit
          sld_qty
          sld_price
          sld_total
          sld_acc
          sld_order
          sld_sitemno
          sld_branch
          sld_ucost
          sld_itemtype
          sld_error
        }
      }
    `,
    { branch, invno }
  );
  return allSalesDetlsByInvno;
}

export function useSalesDetls() {
  const [salesinvno, setSalesInvno] = useState('');

  const fallback = [];
  const { data: salesdetls = fallback } = useQuery({
    queryKey: [queryKeys.salesdetls, salesinvno],
    queryFn: () =>
      salesinvno ? getSalesDetlsByInvno(salesinvno) : getAllSalesDetls(),
  });

  return { salesdetls, setSalesInvno };
}
