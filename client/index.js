$(() => {
  const $username = $('#username')
  const $submit = $('#submit')
  const $tableBody = $('#results tbody')
  $submit.on('click', e => {
    e.preventDefault()
    const username = $username.val()
    $.get(`/api/userLangs/${username}`)
      .done(addRowsToResultsTable($tableBody))
  })
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
