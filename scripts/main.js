/* global $, applist, location */

// STORE REFERENCES TO HTML ELEMENTS
var $body = $(document.body)
var $showNewAppFormButton = $('#new-app-btn')
var $newAppForm = $('#form-new-app')
var $updateAppForm = $('#form-update-app')
var $cancelNewAppFormButton = $('#cancel-create')
var $appList = $('#app-list')
var $goBackButton = $('#go-back-btn')
var $startAppButton = $('#start-button')
var $stopAppButton = $('#stop-button')
var $deleteButton = $('#delete-button')
var $editButton = $('#edit-button')
var $cancelButton = $('#cancelButton')

// INIT APP
$(document).ready(handleRoute)
$(window).on('hashchange', handleRoute)

// EVENT HANDLERS
$showNewAppFormButton.on('click', function () {
  setRoute('new')
})

$newAppForm.on('submit', function (event) {
  event.preventDefault()

  // create app array for exisiting apps
  var app = {
    name: $('#empty-text').val()
  }
  if (app.name) {
    applist.add(app)

      .then(function (app) {
        setRoute(app.id)
      })
  }
})

$cancelNewAppFormButton.on('click', function () {
  setRoute('')
})

$appList.on('click', 'li', function (event) {
  var li = event.currentTarget
  var id = $(li).data('id')
  setRoute(id)
})

$goBackButton.on('click', function () {
  setRoute('')
})
$editButton.on('click', function (event) {
  var id = $('#name-app').data('id')
  setRoute(id + '/edit')
})

$updateAppForm.on('submit', function (event) {
  event.preventDefault()

  var id = $('#edit-app-container').data('id')
  var newName = $('#rename-app').val()
  var app = {
    id: id,
    name: newName
  }
  if (newName) {
    applist.update(app)

      .then(function (app) {
        setRoute(id)
      })
  }
})

$cancelButton.on('click', function (event) {
  var id = $('#name-app').data('id')
  setRoute(id)
})

$deleteButton.on('click', function (event) {
  event.preventDefault()
  var id = $('#detail-app-container').data('id')
  applist.remove(id)
    .then(function (app) {
      setRoute('')
    })
})

// start button
$startAppButton.on('click', function () {
  var app = {
    id: $('#detail-app-container').data('id')
  }
  applist.start(app)

    .then(function (app) {
      $('#detail-app-container').attr('data-state', 'started')
    })
})

// stop button
$stopAppButton.on('click', function () {
  var app = {
    id: $('#detail-app-container').data('id')
  }
  applist.stop(app)

    .then(function (app) {
      $('#detail-app-container').attr('data-state', 'stopped')
    })
})

// HELPER METHODS
function setRoute (path) {
  location.hash = '#' + path
}

function handleRoute () {
  var path = location.hash.substr(1)

  if (path === '') {
    console.log('route: dashboard')
    renderAppList()
    return
  }

  if (path === 'new') {
    console.log('route: new app form')
    renderNewAppForm()
    return
  }

  if (path.substr(-5) === '/edit') {
    var id = path.substr(0, path.length - 5)
    console.log(`route: app edit (id: ${id})`)
    renderEditAppForm(id)
    return
  }

  renderAppDetail(path)
}

function renderNewAppForm () {
  $body.attr('data-state', 'new-app')
  $('#empty-text').val('')
}

function renderAppDetail (id) {
  applist.find(id)

    .then(function (app) {
      $('#name-app').html(app.name)
      $('#detail-app-container').attr('data-state', app.state)
      $('#detail-app-container').data('id', app.id)
      $('#name-app').data('id', app.id)
      $('#folder').html('~Hoodie/' + app.name)
      $body.attr('data-state', 'app-detail')
    })
}
function renderAppList () {
  $body.attr('data-state', 'dashboard')
  $appList.empty()
  applist.findAll()

    .then(function (apps) {
      apps.forEach(function (app) {
        var html = `
      <li data-id="${app.id}" class="list-group-item"
      <button type="button" class="btn btn-lg btn-block">
      ${app.name || '-'}
      <i class="glyphicon glyphicon-play-circle pull-right"></i>
      </button>
      </li>
      `
        $appList.append(html)
      })
    })
}
function renderEditAppForm (id) {
  applist.find(id)

    .then(function (app) {
      $body.attr('data-state', 'edit-app')
      $('#rename-app').val(app.name)
      $('#edit-app-container').data('id', app.id)
    })
  $('#rename-app').val('')
}
