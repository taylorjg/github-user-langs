import URLSearchParams from 'url-search-params'
const common = require('../common')

$(() => {
  const $username = $('#username')
  const $submit = $('#submit')
  const $reset = $('#reset')
  const $resultsPanel = $('#resultsPanel')
  const $repoCount = $('#repoCount')
  const $includeForkedRepos = $('#includeForkedRepos')
  const $includeNonOwnedRepos = $('#includeNonOwnedRepos')
  const $url = $('#url')
  const $avatar = $('#avatar')
  const $name = $('#name')
  const $login = $('#login')
  const $company = $('#company')
  const $location = $('#location')
  const $email = $('#email')
  const $websiteUrl = $('#websiteUrl')
  const $tableBody = $('#results tbody')
  const $errorPanel = $('#errorPanel')
  const $errorMessage = $('#errorMessage')
  const $spinners = $('form img')

  let includeForkedRepos = false
  let includeNonOwnedRepos = false
  let results = null

  const showErrorPanel = errorMessage => {
    $errorMessage.html(errorMessage)
    $errorPanel.show().removeClass('hidden')
  }

  const showErrorPanelForXhr = xhr => {
    const baseMessage = 'An error occurred proxying a call to the GitHub GraphQL API'
    const errorMessage = xhr && xhr.status && xhr.statusText
      ? `${baseMessage} (${xhr.status} ${xhr.statusText}).`
      : `${baseMessage}.`
    showErrorPanel(errorMessage)
  }

  const hideErrorPanel = () =>
    $errorPanel.hide()

  const showResultsPanel = () =>
    $resultsPanel.show().removeClass('hidden')

  const hideResultsPanel = () =>
    $resultsPanel.hide()

  const showSpinners = () =>
    $spinners.show().removeClass('hidden')

  const hideSpinners = () =>
    $spinners.hide()

  const enableSubmitButton = () =>
    $submit.prop('disabled', false)

  const disableSubmitButton = () =>
    $submit.prop('disabled', true)

  $submit.on('click', e => {
    e.preventDefault()
    disableSubmitButton()
    showSpinners()
    const username = $username.val()
    $.get(`/api/userLangs/${username}`)
      .done(_results => {
        if (_results.failure) {
          const message = _results.failure.errors[0].message
          showErrorPanel(message)
        } else {
          results = _results
          showResults()
          hideErrorPanel()
        }
      })
      .fail(showErrorPanelForXhr)
      .fail(hideResultsPanel)
      .always(hideSpinners)
      .always(enableSubmitButton)
  })

  $reset.on('click', () => {
    hideResultsPanel()
    $username.val('')
    $username.focus()
  })

  $('button', $errorPanel).on('click', hideErrorPanel)

  const searchParams = new URLSearchParams(window.location.search)
  const username = searchParams.get('username')
  if (username) {
    $username.val(username)
    $submit.focus()
    $submit.trigger('click')
  }

  $includeForkedRepos.prop('checked', includeForkedRepos)
  $includeNonOwnedRepos.prop('checked', includeNonOwnedRepos)

  $includeForkedRepos.on('click', e => {
    includeForkedRepos = e.target.checked
    showResults()
  })
  $includeNonOwnedRepos.on('click', e => {
    includeNonOwnedRepos = e.target.checked
    showResults()
  })

  const showResults = () => {
    const langs = common.filterResults(results, includeForkedRepos, includeNonOwnedRepos)
    const repoCount = common.countRepos(results, includeForkedRepos, includeNonOwnedRepos)
    addRowsToResultsTable($tableBody, langs)
    $repoCount.html(repoCount)

    const user = results.success.user

    $url.attr('href', user.url)
    $avatar.attr('src', user.avatarUrl)

    $name
      .html(user.name)
      .closest('li')
      .toggle(!!user.name)

    $login
      .html(user.login)
      .closest('li')
      .toggle(!!user.login)

    const $companyContent = user.company && user.company.startsWith('@')
      ? $('<a>', {
        href: `https://github.com/${user.company.substring(1)}`,
        html: user.company
      })
      : user.company
    $company
      .html($companyContent)
      .closest('li')
      .toggle(!!user.company)

    $location
      .html(user.location)
      .closest('li')
      .toggle(!!user.location)

    $email
      .attr('href', `mailto:${user.email}`)
      .html(user.email)
      .closest('li')
      .toggle(!!user.email)

    $websiteUrl
      .attr('href', user.websiteUrl)
      .html(user.websiteUrl)
      .closest('li')
      .toggle(!!user.websiteUrl)

    showResultsPanel()
  }
  const addRowsToResultsTable = ($tableBody, langs) => {
    $tableBody.empty()
    langs.forEach(addRowToResultsTable($tableBody))
  }

  const addRowToResultsTable = $tableBody => lang =>
    $tableBody.append(
      $('<tr>', {
        html: [
          $('<td>', { html: columnContents1(lang) }),
          $('<td>', { html: columnContents2(lang) }),
          $('<td>', { html: columnContents3(lang) })
        ]
      }))

  const columnContents1 = lang =>
    lang.name

  const columnContents2 = lang =>
    formatPercentage(lang.percentage)

  const columnContents3 = lang =>
    $('<div>', { html: lang.name })
      .css('width', `${lang.percentage}%`)
      .css('background-color', lang.color || '#ccc')

  const formatPercentageOptions = {
    minimumIntegerDigits: 2,
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }

  const formatPercentage = percentage =>
    `${percentage.toLocaleString(undefined, formatPercentageOptions)}%`
})
