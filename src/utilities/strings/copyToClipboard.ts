type Text = string | null | undefined;
export const copyToClipboard = (text: Text, onCopy?: (text: Text) => void) => {
  if (!text) return null;

  if (global.isSecureContext) {
    if (global.navigator.clipboard?.writeText) {
      global.navigator.clipboard.writeText(text);
      onCopy?.(text);
    }
  }
};
