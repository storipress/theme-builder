import type { Desk } from '../types'
import { expect, it } from 'vitest'
import { server } from '~/mocks/server'
import { doListArticlesToPage } from '../list-articles'

server.listen()

it('can list articles', async () => {
  const desks = [
    {
      id: '1',
      name: 'desk1',
      desks: [],
    },
    {
      id: '2',
      name: 'desk2',
      desks: [
        {
          id: '4',
        },
        {
          id: '5',
        },
      ],
    },
    {
      id: '3',
      name: 'desk3',
      desks: [
        {
          id: '6',
        },
      ],
    },
  ]
  const articles = await doListArticlesToPage(1, desks as Desk[])

  expect(articles).toMatchSnapshot()
  // mock article length * 2, because we will fetch featured article which may cause duplicate
  expect(articles).toHaveLength(20)
})
