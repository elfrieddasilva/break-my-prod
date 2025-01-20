"use client"

import { ProjectServiceMock } from '@/infra/implementations/project.service.mock';
import { ProjectService } from '@/infra/interface/project.service';
import React, { ReactNode, createContext, useContext } from 'react';

export interface AppContext {
  projectService: ProjectService;
}

const projectService = new ProjectServiceMock();

export const initialContext: AppContext = {
 projectService
};

interface DIProviderProps {
  children: ReactNode;
}

export const DIContext = createContext<AppContext>(initialContext);

const DIProvider: React.FC<DIProviderProps> = ({ children }) => (
  <DIContext.Provider value={initialContext}>{children}</DIContext.Provider>
);

function useDIContext() {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useDIContext must be used within an DIProvider');
  }
  return context;
}

function useProjectService() {
  return useDIContext().projectService;
}

export { useDIContext, DIProvider, useProjectService };
export default DIContext;
