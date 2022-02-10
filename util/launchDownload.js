export default function launchDownload(href, name) {
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', name);
  // if we ever want to open them in a new tab/window
  // link.setAttribute('target', '_blank');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
