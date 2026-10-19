export const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) 
    children = <strong className="font-bold">{children}</strong>;

  if (leaf.code) 
    children = <code className="px-1 py-0.5 text-xs sm:text-sm font-mono bg-slate-200/60 dark:bg-slate-700/60 rounded break-words">{children}</code>;
  
  if (leaf.italic) 
    children = <em className="italic">{children}</em>;
 
  if (leaf.underline) 
    children = <u className="underline">{children}</u>;

  return <span {...attributes}>{children}</span>;
};