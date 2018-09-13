import URLSearchParams from 'url-search-params'

$(() => {
  const $username = $('#username')
  const $submit = $('#submit')
  const $tableBody = $('#results tbody')
  $submit.on('click', e => {
    $submit.prop('disabled', true)
    e.preventDefault()
    const username = $username.val()
    $.get(`/api/userLangs/${username}`)
      .done(addRowsToResultsTable($tableBody))
      .always(() => { $submit.prop('disabled', false) })
  })

  const searchParams = new URLSearchParams(window.location.search)
  const username = searchParams.get('username')
  if (username) {
    $username.val(username)
    $submit.focus()
    $submit.trigger('click')
  }
})

const addRowsToResultsTable = $tableBody => langs =>
  langs.forEach(addRowToResultsTable($tableBody))

const addRowToResultsTable = $tableBody => lang =>
  $tableBody.append($('<tr>', {
    html: [
      $('<td>', { html: lang.name }),
      $('<td>', { html: formatPercentage(lang.percentage) })
    ]
  }))

const formatPercentageOptions = {
  minimumIntegerDigits: 2,
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
}

const formatPercentage = percentage =>
  `${percentage.toLocaleString(undefined, formatPercentageOptions)}%`
