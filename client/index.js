import URLSearchParams from 'url-search-params'

$(() => {
  const $username = $('#username')
  const $submit = $('#submit')
  const $clear = $('#clear')
  const $tableBody = $('#results tbody')
  const $errorPanel = $('#errorPanel')
  const $errorMessage = $('#errorMessage')

  const showErrorPanel = errorMessage => {
    $errorMessage.html(errorMessage)
    $errorPanel.removeClass('hidden').show()
  }

  const showErrorPanelWithXhr = xhr => {
    const errorMessage = xhr && xhr.status && xhr.statusText
      ? `${xhr.status}: ${xhr.statusText}`
      : 'Something went wrong!'
    showErrorPanel(errorMessage)
  }

  const hideErrorPanel = () =>
    $errorPanel.hide()

  $('button', $errorPanel).on('click', hideErrorPanel)

  const enableSubmitButton = () => $submit.prop('disabled', false)
  const disableSubmitButton = () => $submit.prop('disabled', true)

  $submit.on('click', e => {
    e.preventDefault()
    disableSubmitButton()
    const username = $username.val()
    $.get(`/api/userLangs/${username}`)
      .done(results => {
        if (results.failure) {
          const message = results.failure.errors[0].message
          showErrorPanel(message)
        } else {
          hideErrorPanel()
          addRowsToResultsTable($tableBody, results.success)
        }
        $username.focus()
      })
      .fail(showErrorPanelWithXhr)
      .always(enableSubmitButton)
  })

  $clear.on('click', () => {
    $username.val('')
    $tableBody.empty()
  })

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
        $('<td>', {
          html: lang.name
        }),
        $('<td>', {
          html: formatPercentage(lang.percentage)
        }),
        $('<td>', {
          html: $('<div>', {
            style: `width: ${lang.percentage}%; background-color: ${lang.color};`,
            'class': 'language-color',
            html: '&nbsp;'
          })
        })
      ]
    }))

const formatPercentageOptions = {
  minimumIntegerDigits: 2,
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
}

const formatPercentage = percentage =>
  `${percentage.toLocaleString(undefined, formatPercentageOptions)}%`
