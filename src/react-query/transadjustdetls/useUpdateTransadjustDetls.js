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

async function updateTransadjustDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateTransadjustDetls(
        $tad_id: ID
        $tad_batchno: String
        $tad_itemno: String
        $tad_desp: String
        $tad_packing: String
        $tad_qtyonhand: Float
        $tad_qtycount: Float
        $tad_qtyadjust: Float
        $tad_unit: String
        $tad_remark: String
        $tad_branch: String
      ) {
        updateTransadjustDetls(
          tad_id: $tad_id
          tad_batchno: $tad_batchno
          tad_itemno: $tad_itemno
          tad_desp: $tad_desp
          tad_packing: $tad_packing
          tad_qtyonhand: $tad_qtyonhand
          tad_qtycount: $tad_qtycount
          tad_qtyadjust: $tad_qtyadjust
          tad_unit: $tad_unit
          tad_remark: $tad_remark
          tad_branch: $tad_branch
        ) {
          tad_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateTransadjustDetls(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => updateTransadjustDetls(data),
    onSuccess: () => {
      Toast({
        title: 'Adjust Transaction Details being updated!',
        status: 'success',
        customId: 'tranadjustDetlsUpd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Adjust Transaction Details Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'transadjustDetlsUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transadjustdetls');
    },
  });

  return mutate;
}
