interface ErrorProps {
  error: string;
  darkerText: boolean;
}

export const ErrorText: React.FC<ErrorProps> = ({ error, darkerText }) => {
  return (
    <p className={`${darkerText ? 'text-red-800' : 'text-red-600'} text-shadow-xs/30 font-bold`}>
      {error}
    </p>  
  );
}