import sj from 'superjson'

export function toJson(obj: any) {
  return sj.stringify(obj)
}

export function toNumbers(obj: any) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
      obj[prop] = +obj[prop];
    }
  }
  return obj
}