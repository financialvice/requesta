import { db } from "@repo/db";
import { Stack } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { TextField } from "@/components/text-field";

type Step = "email" | "code";

export default function Login() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep("email");
    setEmail("");
    setCode("");
    setErrorMessage(null);
  }, []);

  const handleSendMagicCode = useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage("Enter your email.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await db.auth.sendMagicCode({ email: trimmed });
      setEmail(trimmed);
      setStep("code");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send code";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  const handleVerifyCode = useCallback(async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setErrorMessage("Enter the code we emailed you.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await db.auth.signInWithMagicCode({ email, code: trimmedCode });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to verify code";
      setErrorMessage(message);
      setCode("");
    } finally {
      setIsSubmitting(false);
    }
  }, [code, email]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Log in",
          headerShown: false,
          headerShadowVisible: false,
        }}
      />
      <Container>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            gap: 24,
            paddingHorizontal: 24,
          }}
        >
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: "600" }}>
              Welcome back
            </Text>
            <Text style={{ fontSize: 16, color: "#6B7280" }}>
              {step === "email"
                ? "Enter your email to receive a login code."
                : `Enter the code we sent to ${email}.`}
            </Text>
          </View>

          {step === "email" ? (
            <View style={{ gap: 16 }}>
              <TextField
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="you@example.com"
                value={email}
              />
              <Button
                disabled={isSubmitting}
                onPress={handleSendMagicCode}
                title={isSubmitting ? "Sending..." : "Send code"}
              />
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              <TextField
                accessibilityLabel="Login code"
                autoCapitalize="none"
                autoComplete="one-time-code"
                autoCorrect={false}
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={setCode}
                placeholder="123456"
                value={code}
              />
              <Button
                disabled={isSubmitting}
                onPress={handleVerifyCode}
                title={isSubmitting ? "Verifying..." : "Verify code"}
              />
              <Text
                onPress={reset}
                style={{ textAlign: "center", fontSize: 14, color: "#3B82F6" }}
              >
                Use a different email
              </Text>
            </View>
          )}

          {errorMessage ? (
            <Text style={{ color: "#EF4444", fontSize: 14 }}>
              {errorMessage}
            </Text>
          ) : null}
        </View>
      </Container>
    </>
  );
}
