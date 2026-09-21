import { Node, type Descendant } from "slate";

export const extractSlateText = (content: string): string => {
  try {
    const nodes: Descendant[] = JSON.parse(content);

    if (Array.isArray(nodes)) {
      return nodes.map(n => Node.string(n)).join('\n');
    }
  }
  catch (error) {
    console.error('Failed to parse JSON string:', error);
  }

  return '';
};