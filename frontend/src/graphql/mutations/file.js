import { gql } from "@apollo/client";

export const DELETE_CONTACT_MUTATION = gql`
  mutation DeletContact($file: String) {
    deleteContact(id: $id)
  }
`;
export const DOWNLOAD_FILE = gql`
  mutation DownloadFile($id: ID!) {
    downloadFile(id: $id) {
      url
    }
  }
`;
export const GENERATED_PAYMENT_FILE_IN_EXECUTROR_ORDER = gql`
  mutation GeneratedPaymentFileInExecutorOrder(
    $executorOrderId: ID!
    $paymentModeKey: String!
  ) {
    generatedPaymentFileInExecutorOrder(
      executorOrderId: $executorOrderId
      paymentModeKey: $paymentModeKey
    )
  }
`;
