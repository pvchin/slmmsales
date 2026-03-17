import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { items_url } from '../../utils/constants';
//import { useCustomToast } from '../../helpers/useCustomToast';
import { GraphQLClient, gql } from 'graphql-request';
import { Toast } from '../../helpers/CustomToastify';

const API_URL = process.env.REACT_APP_API_URL;
//const API_URL = `http://localhost:4000/graphql`;
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

async function addTranDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation AddTranDetls(
        $tl_tranno: String
        $tl_type: String
        $tl_itemno: String
        $tl_desp: String
        $tl_brand: String
        $tl_packing: String
        $tl_pfactor: Float
        $tl_unit: String
        $tl_qty: Float
        $tl_ucost: Float
        $tl_netucost: Float
        $tl_disc: Float
        $tl_excost: Float
        $tl_remark: String
        $tl_order: Int
        $tl_branch: String
        $tl_uoldcost: Float
      ) {
        addTranDetls(
          tl_tranno: $tl_tranno
          tl_type: $tl_type
          tl_itemno: $tl_itemno
          tl_desp: $tl_desp
          tl_brand: $tl_brand
          tl_packing: $tl_packing
          tl_pfactor: $tl_pfactor
          tl_unit: $tl_unit
          tl_qty: $tl_qty
          tl_ucost: $tl_ucost
          tl_netucost: $tl_netucost
          tl_disc: $tl_disc
          tl_excost: $tl_excost
          tl_remark: $tl_remark
          tl_order: $tl_order
          tl_branch: $tl_branch
          tl_uoldcost: $tl_uoldcost
        ) {
          tl_tranno
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useAddTranDetls(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => addTranDetls(data),
    onSuccess: () => {
      Toast({
        title: 'New Transaction Details being added!',
        status: 'success',
        customId: 'trandetlsAdd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Transaction Details Add Error! Please check your internet connection!',
        status: 'warning',
        customId: 'trandetlsAddErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transdetls');
    },
  });

  return mutate;
}
