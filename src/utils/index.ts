export function num2col(num: number): string {
  return String.fromCharCode(64 + num)
}

export function getAppHeight() {
  return document.documentElement.clientHeight
}

export function getContextHeight() {
  return document.documentElement.clientHeight - 60
}
