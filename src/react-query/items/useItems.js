import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterByItemId } from './utils';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getItems() {
  const { allItems } = await graphQLClient.request(gql`
    query {
      allItems {
        item_id
        item_no
        item_group
        item_desp
        item_packing
        item_category
        item_unit
        item_brand
        item_dept
        item_qtyhand
        item_pfactor
        item_ucost_pc
        item_ucost_ctn
        item_uprice_pc
        item_uprice_ctn
        item_offerprice
        item_supplier
        item_bfqty
        item_bfamt
        item_minlvlqty
        item_last_puramt
        item_last_recqty
        item_lock
        item_remark
        item_lastucost
        item_smcode
        item_coolprice_pc
        item_package
        item_lastrecdate
        item_onopo
        item_onoqty
        item_warehouse
        item_type
        item_nonstock
        item_location
        item_prtreptlabel
      }
    }
  `);
  return allItems;
}

export function useItems() {
  const [itemId, setItemId] = useState('');

  const fallback = [];
  const { data: items = fallback } = useQuery({
    queryKey: [queryKeys.items, itemId],
    queryFn: () => getItems(),
  });

  return { items, setItemId };
}
