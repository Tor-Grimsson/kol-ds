/* record's eager glob calls, over the client's list: the library's text files whose path matches */
import { client } from '../folio/client'

export const glob = (re) => Object.fromEntries(Object.entries(client().list()).filter(([path]) => re.test(path)))
