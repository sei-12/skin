export function isHankaku(s: string){
  return /^[\x20-\x7e]*$/.test(s);
}