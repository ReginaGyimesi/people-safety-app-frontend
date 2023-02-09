import React, { createContext, useState } from "react";

// ScotContext: to query the context state
// ScotDispatchContext: to mutate the context state
const ScotContext = createContext<boolean>(false);
const ScotDispatchContext = createContext<any>(undefined);

// A "provider" is used to encapsulate only the
// components that needs the state in this context
function ScotProvider({ children }: { children: any }) {
  const [isScot, setScot] = useState(false);

  return (
    <ScotContext.Provider value={isScot}>
      <ScotDispatchContext.Provider value={setScot}>
        {children}
      </ScotDispatchContext.Provider>
    </ScotContext.Provider>
  );
}

export { ScotProvider, ScotContext, ScotDispatchContext };
