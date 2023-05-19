export default function joinClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(" ");
}
