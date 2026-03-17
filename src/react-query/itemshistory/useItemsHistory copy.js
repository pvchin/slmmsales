import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
//import { useQuery as useApolloQuery, useMutation } from "@apollo/react-hooks";
import { GraphQLClient, gql } from 'graphql-request';
//import { gql } from "@apollo/client";
//import { employees_url } from "../../utils/constants";
import { filterByItemId } from './utils';

import axios from 'axios';
import { queryKeys } from '../constants';

const API_URL = `http://localhost:4000/graphql`;
//const API_URL = `http://192.168.0.107:4000/graphql`;

const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function getItemsHistory() {
  const { allItemsHistory } = await graphQLClient.request(gql`
    query {
      allItemsHistory {
        it_id
        it_transno
        it_itemno
        it_transdate
        it_qty
        it_value
        it_disc
        it_netvalue
        it_extvalue
        it_pfactor
        it_transtype
        it_scno
        it_sc
        it_branch
        it_postdate
        it_remark
        it_desp
        it_packing
        it_transid
        it_transidsub
      }
    }
  `);
  return allItemsHistory;
}

export function useItemsHistory() {
  const [filter, setFilter] = useState('all');
  const [itemshistoryId, setItemshistoryId] = useState('');

  const selectFn = useCallback(
    unfiltered => filterByItemId(unfiltered, filter),
    [filter]
  );

  const fallback = [];
  const { data: itemshistory = fallback } = useQuery(
    [queryKeys.itemshistory],
    async () => {
      const { allItemsHistory } = await graphQLClient.request(gql`
        query {
          allItemsHistory {
            it_id
            it_transno
            it_itemno
            it_transdate
            it_qty
            it_value
            it_disc
            it_netvalue
            it_extvalue
            it_pfactor
            it_transtype
            it_scno
            it_sc
            it_branch
            it_postdate
            it_remark
            it_desp
            it_packing
            it_transid
            it_transidsub
          }
        }
      `);
      return allItemsHistory;
    },
    {
      select: filter !== 'all' ? selectFn : undefined,
    }
  );

  return { itemshistory, filter, setFilter, setItemshistoryId };
}
