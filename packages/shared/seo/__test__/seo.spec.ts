import { resolveSEOFromRaw } from '../index'

describe('resolveSEOFromRaw', () => {
  it('resolve seo with sepcial character', () => {
    expect(
      resolveSEOFromRaw({
        name: 'EOTC',
        base: {
          title: 'Beijing 2022 Closing Ceremony Recap - 再见 Beijing, Ciao Milano Cortina!',
          description:
            'The Beijing 2022 Winter Olympic Games has come to an official end with the Closing Ceremony, with all eyes now on Milano Cortina 2026!',
        },
        seo: JSON.parse(
          '{"meta":{"title":null,"matched":false,"description":"The Beijing 2022 Winter Olympic Games has come to an official end with the Closing Ceremony, with all eyes now on Milano Cortina 2026!"},"slug":null}'
        ),

        defaultSlug: 'beijing-2022-closing-ceremony-recap-再见-beijing-ciao-milano-cortina-ha5u',
      })
    ).toMatchSnapshot()
  })
})
