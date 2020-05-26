import { g } from '@util'

export default function modal(options) {
  return (typeof options === 'string') ? g.p.showModal({ title: '提示', content: options }) : g.p.showModal({ title: '提示', ...options })
}
