import URLSearchParams from 'url-search-params'
const common = require('../common')

$(() => {
  const $username = $('#username')
  const $submit = $('#submit')
  const $clear = $('#clear')
  const $tableBody = $('#results tbody')
  const $errorPanel = $('#errorPanel')
  const $errorMessage = $('#errorMessage')
  const $spinners = $('th img')

  const showErrorPanel = errorMessage => {
    $errorMessage.html(errorMessage)
    $errorPanel.removeClass('hidden').show()
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

  const enableSubmitButton = () =>
    $submit.prop('disabled', false)

  const disableSubmitButton = () =>
    $submit.prop('disabled', true)

  const showSpinners = () =>
    $spinners.show().removeClass('hidden')

  const hideSpinners = () =>
    $spinners.hide()

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
        }
      })
      .fail(showErrorPanelForXhr)
      .always(enableSubmitButton)
      .always(hideSpinners)
  })

  $clear.on('click', () => {
    $username.val('')
    $tableBody.empty()
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