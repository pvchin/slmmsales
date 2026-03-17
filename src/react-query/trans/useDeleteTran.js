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

async function deleteTran(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation DeleteTran($t_id: ID) {
        deleteTran(t_id: $t_id) {
          t_id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useDeleteTran(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => deleteTran(data),
    onSuccess: () => {
      queryClient.invalidateQueries('trans');
      Toast({
        title: 'Transaction being deleted!',
        status: 'warning',
        customId: 'transDel',
      });
    },
    onError: () => {
      Toast({
        title:
          'Transaction Delete Error! Please check your internet connection!',
        status: 'warning',
        customId: 'transDelErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('trans');
    },
  });

  return mutate;
}
