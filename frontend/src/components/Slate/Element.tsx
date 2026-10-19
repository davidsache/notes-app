export const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote': 
      return <blockquote style={style} className="italic font-medium leading-relaxed text-sm sm:text-base md:text-lg my-2 pl-3 border-l-4 border-slate-400" {...attributes}>"{children}"</blockquote>;
    case 'bulleted-list': 
      return <ul style={style} className="list-disc pl-4 sm:pl-5 text-sm sm:text-base my-1" {...attributes}>{children}</ul>;
    case 'heading-one': 
      return <h1 style={style} className="text-2xl sm:text-3xl md:text-4xl font-bold my-2 break-words" {...attributes}>{children}</h1>;
    case 'heading-two': 
      return <h2 style={style} className="text-xl sm:text-2xl md:text-3xl font-bold my-1.5 break-words" {...attributes}>{children}</h2>;
    case 'list-item': 
      return <li style={style} className="text-sm sm:text-base my-0.5 break-words" {...attributes}>{children}</li>;
    case 'numbered-list': 
      return <ol style={style} className="list-decimal pl-4 sm:pl-5 text-sm sm:text-base my-1" {...attributes}>{children}</ol>;
    default: 
      return <p style={style} className="text-sm sm:text-base leading-relaxed break-words" {...attributes}>{children}</p>;
  }
};