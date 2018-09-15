const R = require('ramda')

const filterLangGroups = (allowForkedRepos, allowNonOwnedRepos) =>
  R.pipe(
    R.map(R.filter(lang =>
      (allowForkedRepos || !lang.repoIsFork) &&
      (allowNonOwnedRepos || lang.repoIsOwned))),
    R.filter(R.compose(R.not, R.isEmpty))
  )

const filterRepos = (allowForkedRepos, allowNonOwnedRepos) =>
  R.filter(repo => (
    (allowForkedRepos || !repo.isFork) &&
    (allowNonOwnedRepos || repo.isOwned)))

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

const filterResults = (results, allowForkedRepos = false, allowNonOwnedRepos = false) => {
  const pipe = R.pipe(
    filterLangGroups(allowForkedRepos, allowNonOwnedRepos),
    R.map(sumLangGroup),
    includeGrandTotal,
    includePercentages,
    R.sort(compareLang)
  )
  return pipe(results.success.langGroups)
}

const countRepos = (results, allowForkedRepos = false, allowNonOwnedRepos = false) =>
  filterRepos(allowForkedRepos, allowNonOwnedRepos)(results.success.repos).length

module.exports = {
  filterResults,
  countRepos
}
