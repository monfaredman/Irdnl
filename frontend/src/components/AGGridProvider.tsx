'use client';

import { useEffect } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register AG Grid modules on the client side
if (typeof window !== 'undefined') {
  ModuleRegistry.registerModules([AllCommunityModule]);
}

export function AGGridProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure registration happens on client
    ModuleRegistry.registerModules([AllCommunityModule]);
  }, []);

  return <>{children}</>;
}
