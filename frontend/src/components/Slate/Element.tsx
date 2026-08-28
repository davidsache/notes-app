export const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote': 
      return <blockquote style={style} className="italic font-medium leading-relaxed" {...attributes}>"{children}"</blockquote>;
    case 'bulleted-list': 
      return <ul style={style} className="list-disc pl-5" {...attributes}>{children}</ul>;
    case 'heading-one': 
      return <h1 style={style} className="text-4xl font-bold" {...attributes}>{children}</h1>;
    case 'heading-two': 
      return <h2 style={style} className="text-3xl font-bold" {...attributes}>{children}</h2>;
    case 'list-item': 
      return <li style={style} {...attributes}>{children}</li>;
    case 'numbered-list': 
      return <ol style={style} className="list-decimal pl-5" {...attributes}>{children}</ol>;
    default: 
      return <p style={style} {...attributes}>{children}</p>;
  }
};