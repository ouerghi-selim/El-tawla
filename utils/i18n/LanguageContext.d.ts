import { ReactNode } from 'react';

export interface LanguageContextType {
  currentLanguage: string;
  isRTL: boolean;
  changeLanguage: (language: string) => Promise<void>;
}

export function LanguageProvider(props: { children: ReactNode }): JSX.Element;
export function useLanguage(): LanguageContextType;

declare const LanguageContext: React.Context<LanguageContextType | undefined>;
export default LanguageContext;