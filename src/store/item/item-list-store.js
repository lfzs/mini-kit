import { List } from '@store'
import { fly } from '@util'

export default new class extends List {
  fetchApi = params => fly.get('items', params)
}
