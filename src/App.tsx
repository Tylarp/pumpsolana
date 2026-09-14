import { useState } from 'react';
import { AppShell } from '@/components/AppShell';

export default function App() {
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | null>(null);

  return (
    <AppShell
      selectedTokenAddress={selectedTokenAddress}
      onSelectToken={setSelectedTokenAddress}
    />
  );
}
