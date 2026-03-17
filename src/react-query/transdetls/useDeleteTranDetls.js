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

async function deleteTranDetls(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTranDetls($tl_tranno: String, $tl_branch: String) {
        deleteTranDetls(tl_tranno: $tl_tranno, tl_branch: $tl_branch) {
          tl_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteTranDetls(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTranDetls(data),
    onSuccess: () => {
      Toast({
        title: 'Transaction Details being deleted!',
        status: 'warning',
        customId: 'trandetlsDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Transaction Details Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'trandetlsDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('transdetls');
    },
  });

  return mutate;
}
