import * as R from 'ramda';

const filterLangGroups = (includeForkedRepos, includeNonOwnedRepos) =>
  R.pipe(
    R.map(R.filter(lang =>
      (includeForkedRepos || !lang.repoIsFork) &&
      (includeNonOwnedRepos || lang.repoIsOwned))),
    R.filter(R.compose(R.not, R.isEmpty))
  )

const filterRepos = (includeForkedRepos, includeNonOwnedRepos) =>
  R.filter(repo => (
    (includeForkedRepos || !repo.isFork) &&
    (includeNonOwnedRepos || repo.isOwned)))

const sumLangGroup = langGroup => ({
  ...langGroup[0],
  size: R.sum(R.pluck('size', langGroup))
})

const calculateGrandTotal = langs =>
  R.sum(R.pluck('size', langs))

const includeGrandTotal = langs => ({
  grandTotal: calculateGrandTotal(langs),
  langs
})

const includePercentages = ({ grandTotal, langs }) => R.map(lang => ({
  ...lang,
  percentage: lang.size * 100 / grandTotal
}), langs)

const compareLang = (lang1, lang2) =>
  lang2.percentage - lang1.percentage

export const filterResults = (results, includeForkedRepos = false, includeNonOwnedRepos = false) => {
  const pipe = R.pipe(
    filterLangGroups(includeForkedRepos, includeNonOwnedRepos),
    R.map(sumLangGroup),
    includeGrandTotal,
    includePercentages,
    R.sort(compareLang)
  )
  return pipe(results.success.langGroups)
}
