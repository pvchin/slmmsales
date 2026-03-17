import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
import { Toast } from '../../helpers/CustomToastify';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function addPurchaseDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddPurchaseDetls(
        $pl_pono: String
        $pl_type: String
        $pl_itemno: String
        $pl_desp: String
        $pl_brand: String
        $pl_packing: String
        $pl_pfactor: Float
        $pl_unit: String
        $pl_qty: Float
        $pl_ucost: Float
        $pl_netucost: Float
        $pl_disc: Float
        $pl_excost: Float
        $pl_remark: String
        $pl_order: Int
        $pl_branch: String
        $pl_uoldcost: Float
      ) {
        addPurchaseDetls(
          pl_pono: $pl_pono
          pl_type: $pl_type
          pl_itemno: $pl_itemno
          pl_desp: $pl_desp
          pl_brand: $pl_brand
          pl_packing: $pl_packing
          pl_pfactor: $pl_pfactor
          pl_unit: $pl_unit
          pl_qty: $pl_qty
          pl_ucost: $pl_ucost
          pl_netucost: $pl_netucost
          pl_disc: $pl_disc
          pl_excost: $pl_excost
          pl_remark: $pl_remark
          pl_order: $pl_order
          pl_branch: $pl_branch
          pl_uoldcost: $pl_uoldcost
        ) {
          pl_pono
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddPurchaseDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => addPurchaseDetls(data),
    onSuccess: () => {
      Toast({
        title: 'New Purchase Details being added!',
        status: 'success',
        customId: 'podetlAdd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Purchase Details Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'podetlAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('purchasesdetails');
    },
  });

  return mutate;
}
