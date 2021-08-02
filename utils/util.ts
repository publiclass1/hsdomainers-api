import sj from 'superjson'

export function toJson(obj: any) {
  return sj.stringify(obj)
}
