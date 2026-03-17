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

async function updateTransadjust(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateTransadjust(
        $ta_id: ID
        $ta_batchno: String
        $ta_date: Date
        $ta_userid: String
        $ta_user: String
        $ta_remark: String
        $ta_post: String
        $ta_branch: String
        $ta_type: String
        $ta_subtotal: Float
        $ta_disc: Float
        $ta_nettotal: Float
        $ta_scno: String
        $ta_sc: String
      ) {
        updateTransadjust(
          ta_id: $ta_id
          ta_batchno: $ta_batchno
          ta_date: $ta_date
          ta_userid: $ta_userid
          ta_user: $ta_user
          ta_remark: $ta_remark
          ta_post: $ta_post
          ta_branch: $ta_branch
          ta_type: $ta_type
          ta_subtotal: $ta_subtotal
          ta_disc: $ta_disc
          ta_nettotal: $ta_nettotal
          ta_scno: $ta_scno
          ta_sc: $ta_sc
        ) {
          ta_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateTransadjust(data) {
  const queryClient = useQueryClient();
  //const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: data => updateTransadjust(data),
    onSuccess: () => {
      Toast({
        title: 'Adjust Transaction being updated!',
        status: 'success',
        customId: 'tranadjustUpd',
      });
    },
    onError: () => {
      Toast({
        title:
          'Adjust Transaction Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'transadjustUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transadjust');
    },
  });

  return mutate;
}
