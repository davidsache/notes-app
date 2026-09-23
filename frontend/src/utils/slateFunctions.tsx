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

export const deserializeFromJson = (jsonString: string): Descendant[] => {
  try {
    const parsed = JSON.parse(jsonString);

    if (Array.isArray(parsed) && parsed.length > 0) 
      return parsed;
  }
  catch (error) {
    console.error('Invalid JSON string provided:', error);
  }

  return [{ type: 'paragraph', children: [{ text: '' }] }];
}