import React from "react";
import RequestRecovery from "../../components/RecoveryComponents/RequestRecovery";
import Resetpassword from "../../components/RecoveryComponents/Resetpassword";
import VerifyRecoveryCode from "../../components/RecoveryComponents/VerifyRecoveryCode";

export default function AccountRecovery() {
  return (
    <>
      <RequestRecovery />
      <Resetpassword />
      <VerifyRecoveryCode />
    </>
  );
}
