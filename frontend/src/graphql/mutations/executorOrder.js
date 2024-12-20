import { gql } from "@apollo/client";

export const ALLOW_NEXT_PAYMENT_EXECUTOR_CONTRACT = gql`
  mutation AllowNextPaymentExecutorContract($orderId: ID!) {
    allowNextPaymentExecutorContract(orderId: $orderId) {
      id
      number
      date_generate
      date_order
      date_attachment
      signed_file_id

      original_file_id
      is_possible_mainpayment
      is_possible_postpayment
      is_possible_prepayment
      is_project_prepayment
      is_all_tasks_payment
    }
  }
`;
