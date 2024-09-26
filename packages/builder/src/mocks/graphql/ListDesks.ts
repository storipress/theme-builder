import { graphql, HttpResponse } from 'msw'
import { ListDesks } from '~/generated/graphql'

export const handler = graphql.query(ListDesks, () => {
  return HttpResponse.json({
    data: {
      desks: [
        {
          __typename: 'Desk',
          id: '1',
          name: 'desk-1',
          desks: [],
          slug: 'desk-1',
          order: 1,
          published_articles_count: 1,
        },
        {
          __typename: 'Desk',
          id: '2',
          name: 'desk-1',
          desks: [
            {
              id: '4',
            },
            {
              id: '5',
            },
          ],
          slug: 'desk-1',
          order: 1,
          published_articles_count: 1,
        },
        {
          __typename: 'Desk',
          id: '3',
          name: 'desk-1',
          desks: [
            {
              id: '6',
            },
          ],
          slug: 'desk-1',
          order: 1,
          published_articles_count: 1,
        },
      ],
    },
  })
})
