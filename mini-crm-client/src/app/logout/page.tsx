"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
        });

        // small delay for UX smoothness
        setTimeout(() => {
          router.replace("/login"); // or "/"
        }, 800);
      } catch (err) {
        router.replace("/login");
      }
    };

    doLogout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-muted p-3">
            <LogOut className="h-6 w-6 text-muted-foreground" />
          </div>

          <CardTitle>Signing you out</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Please wait while we log you out...</span>
          </div>

          <p className="text-sm text-muted-foreground">
            You’ll be redirected automatically.
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.replace("/login")}
          >
            Go to login now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}