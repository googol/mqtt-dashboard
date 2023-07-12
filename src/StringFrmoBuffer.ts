import { z } from 'zod'

export const StringFromBuffer = z.instanceof(Uint8Array).transform((buf) => {
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(buf)
})
