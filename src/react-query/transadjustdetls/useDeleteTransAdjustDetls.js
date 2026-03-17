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

async function deleteTransadjustDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTranadjustDetls(
        $tad_batchno: String
        $tad_branch: String
      ) {
        deleteTransadjustDetls(
          tad_batchno: $tad_batchno
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

export function useDeleteTransAdjustDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTransadjustDetls(data),
    onSuccess: () => {
      queryClient.invalidateQueries('tranadjustdetls');
      Toast({
        title: 'Adjust Transaction details being deleted!',
        status: 'warning',
        customId: 'tranadjustdetlsDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Adjust Transaction Details Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'tranadjustdetlsDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transadjust');
    },
  });

  return mutate;
}
