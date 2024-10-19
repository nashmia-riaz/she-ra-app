function trimString(str, match){
    if(!str) return str;
    const index = str.indexOf(match);
    return index !== -1 ? str.substring(0, index+match.length) : str;
}

const references = {
    baseURL: '/she-ra-app'
  };
  
function CleanupWikiText(wikiText){
  if (!wikiText) return '';

  // Remove wiki-style links [[Link|DisplayedText]] -> DisplayedText
  const withoutLinks = wikiText.replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1');

  // Convert bold '''text''' to <strong>text</strong>
  const withBold = withoutLinks.replace(/'''(.*?)'''/g, '<strong>$1</strong>');

  // Convert italic ''text'' to <em>text</em>
  const withItalic = withBold.replace(/''(.*?)''/g, '<em>$1</em>');

  // Remove any remaining templates like {{Template}} or {{Template|Param}}
  const withoutTemplates = withItalic.replace(/\{\{[^}]+\}\}/g, '');

  // Replace headers = Heading = with simple <h1>, <h2>, etc.
  const withHeaders = withoutTemplates
    .replace(/^={1}(.*?)={1}$/gm, '<h1>$1</h1>')  // H1
    .replace(/^=={1}(.*?)=={1}$/gm, '<h2>$1</h2>')  // H2
    .replace(/^==={1}(.*?)==={1}$/gm, '<h3>$1</h3>')  // H3
    .replace(/^===={1}(.*?)===={1}$/gm, '<h4>$1</h4>')  // H4
    .replace(/^====={1}(.*?)====={1}$/gm, '<h5>$1</h5>');  // H5

  // Optional: remove extra whitespace and newlines
  const cleanedText = withHeaders.trim().replace(/\n\s*\n/g, '\n');

  return cleanedText;
}

const removeHtmlTags = (element)=>{
  const anchorTags = element.querySelectorAll('a');
  anchorTags.forEach((a)=>{
      const parent = a.parentNode;
      parent.replaceChild(document.createTextNode(a.textContent), a);
  });

  return element;
}

const trimBrackets = (element) => {
  element.childNodes.forEach((node) => {
    // If the node is a text node, modify its content
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = node.textContent.replace(/\[.*?\]/g, '');
    }
    // If the node has child nodes, recursively process them
    else if (node.nodeType === Node.ELEMENT_NODE) {
      trimBrackets(node); // Recursively process child elements
    }
  });

  return element;
};

export default {trimString, references, CleanupWikiText, removeHtmlTags, trimBrackets };