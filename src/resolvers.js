import got from 'got'

const cards = async () => {
  const sets = ['set1', 'set2', 'set3', 'set4', 'set5', 'set6']
  const allCards = sets.map(set => got.get(`https://dd.b.pvp.net/latest/${set}/en_us/data/${set}-en_us.json`).json())
  return (await Promise.all(allCards)).flat()
}

export default {
  Query: {
    cards: cards,
  },
};
