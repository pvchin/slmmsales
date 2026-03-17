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

async function updateUser(data) {
  const { itemdata } = await graphQLClient.request(
    gql`
      mutation UpdateUser(
        $id: ID
        $userid: String
        $name: String
        $email: String
        $level: String
        $password: String
        $joineddate: Date
        $lastlogindate: Date
      ) {
        updateUser(
          id: $id
          userid: $userid
          name: $name
          email: $email
          level: $level
          password: $password
          joineddate: $joineddate
          lastlogindate: $lastlogindate
        ) {
          id
        }
      }
    `,
    data
  );
  return itemdata;
}

export function useUpdateUser(data) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: data => updateUser(data),
    onSuccess: () => {
      Toast({
        title: 'User being updated!',
        status: 'success',
        customId: 'userUpd',
      });
    },
    onError: () => {
      Toast({
        title: 'User Update Error! Please check your internet connection!',
        status: 'warning',
        customId: 'userUpdErr',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries('users');
    },
  });
  return mutate;
}
