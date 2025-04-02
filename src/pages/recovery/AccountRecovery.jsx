import React, { useState } from "react";
import RequestRecovery from "../../components/RecoveryComponents/RequestRecovery";
import VerifyRecoveryCode from "../../components/RecoveryComponents/VerifyRecoveryCode";
import ResetPassword from "../../components/RecoveryComponents/ResetPassword";

export default function AccountRecovery() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <div>
      {step === 1 && (
        <RequestRecovery
          onSuccess={(userEmail) => {
            setEmail(userEmail);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <VerifyRecoveryCode email={email} onVerified={() => setStep(3)} />
      )}
      {step === 3 && (
        <ResetPassword
          email={email}
          onResetSuccess={() => {
            // Optionally navigate to login page
            // navigate("/login");
            // Or simply reset the process:
            setStep(1);
          }}
        />
      )}
    </div>
  );
}
