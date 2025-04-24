import React, { useState } from "react";
import RequestRecovery from "../../components/RecoveryComponents/RequestRecovery";
import VerifyRecoveryCode from "../../components/RecoveryComponents/VerifyRecoveryCode";
import ResetPassword from "../../components/RecoveryComponents/ResetPassword";

/**
 * AccountRecovery component controls the multi-step flow for
 * account recovery: requesting a code, verifying it, and resetting password.
 */
export default function AccountRecovery() {
  // Step state: 1 = request email, 2 = verify code, 3 = reset password
  const [step, setStep] = useState(1);
  // Store user's email throughout the recovery steps
  const [email, setEmail] = useState("");

  return (
    <div>
      {/* Step 1: Request recovery code by email */}
      {step === 1 && (
        <RequestRecovery
          onSuccess={(userEmail) => {
            // Save the email and move to verification step
            setEmail(userEmail);
            setStep(2);
          }}
        />
      )}

      {/* Step 2: Verify the 6-digit code sent to the email */}
      {step === 2 && (
        <VerifyRecoveryCode
          email={email}
          onVerified={() => setStep(3)} // Move to reset step on success
        />
      )}

      {/* Step 3: Reset password for the verified email */}
      {step === 3 && (
        <ResetPassword
          email={email}
          onResetSuccess={() => {
            // After successful reset, optionally restart or navigate to login
            setStep(1);
          }}
        />
      )}
    </div>
  );
}
