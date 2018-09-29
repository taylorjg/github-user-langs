import { Component, ViewChild } from '@angular/core';
import { GithubService } from './services/github.service';
import { ResultsTableComponent } from './components/results-table/results-table.component';
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

const filterResults = (results, includeForkedRepos = false, includeNonOwnedRepos = false) => {
  const pipe = R.pipe(
    filterLangGroups(includeForkedRepos, includeNonOwnedRepos),
    R.map(sumLangGroup),
    includeGrandTotal,
    includePercentages,
    R.sort(compareLang)
  )
  return pipe(results.success.langGroups)
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    GithubService
  ]
})
export class AppComponent {

  @ViewChild(ResultsTableComponent) resultsTable: ResultsTableComponent;

  constructor(private gh: GithubService) { }

  onSubmit(username: string) {
    console.log(`[onSubmit] username: ${username}`)
    this.gh.getUserLangs(username).subscribe(
      results => {
        this.resultsTable.langs = filterResults(results)
      },
      error => {
        console.log(`ERROR: ${JSON.stringify(error, null, 2)}`)
      })
  }

  onReset() {
    console.log('[onReset]')
  }
}
