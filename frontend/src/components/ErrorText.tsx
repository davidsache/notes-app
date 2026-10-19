interface ErrorProps {
  error: string;
  darkerText: boolean;
}

export const ErrorText: React.FC<ErrorProps> = ({ error, darkerText }) => {
  return (
    <p className={`${darkerText ? 'text-red-800' : 'text-red-600'} text-shadow-xs/30 font-bold text-xs sm:text-sm md:text-base break-words`}>
      {error}
    </p>  
  );
}