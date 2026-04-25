export function stripScriptTags(html: string) {
  if (!html) return "";
  // React does not execute <script> tags inserted via dangerouslySetInnerHTML.
  // Keeping them can trigger console warnings, so strip them.
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

