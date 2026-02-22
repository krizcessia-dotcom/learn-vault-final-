"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { api } from "@/lib/api";

export function HeaderWithBalance() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (status === "authenticated") {
      api.wallet.get().then((r) => r.data && setBalance(r.data.balance));
    }
  }, [status]);

  return (
    <Header
      showUser={status === "authenticated"}
      lvPoints={balance}
      homeHref={status === "authenticated" ? "/dashboard" : undefined}
    />
  );
}
