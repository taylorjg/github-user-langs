import URLSearchParams from 'url-search-params'
const common = require('../common')

$(() => {
  const $username = $('#username')
  const $submit = $('#submit')
  const $reset = $('#reset')
  const $resultsPanel = $('#resultsPanel')
  const $tableBody = $('#results tbody')
  const $errorPanel = $('#errorPanel')
  const $errorMessage = $('#errorMessage')
  const $spinners = $('form img')

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
      .done(results => {
        if (results.failure) {
          const message = results.failure.errors[0].message
          showErrorPanel(message)
        } else {
          hideErrorPanel()
          const langs = common.filterResults(results)
          addRowsToResultsTable($tableBody, langs)
          showResultsPanel()
        }
      })
      .fail(showErrorPanelForXhr)
      .fail(hideResultsPanel)
      .always(hideSpinners)
      .always(enableSubmitButton)
      .always(() => $username.focus())
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
})

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
