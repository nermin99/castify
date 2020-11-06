var session = null

document.addEventListener('DOMContentLoaded', function () {
  var loadCastInterval = setInterval(function () {
    if (chrome.cast.isAvailable) {
      console.log('Cast has loaded.')
      clearInterval(loadCastInterval)
      initializeCastApi()
    } else {
      console.log('Unavailable')
    }
  }, 1000)
})

function initializeCastApi() {
  var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
  var sessionRequest = new chrome.cast.SessionRequest(applicationID)
  var apiConfig = new chrome.cast.ApiConfig(
    sessionRequest,
    sessionListener,
    receiverListener
  )
  chrome.cast.initialize(apiConfig, onInitSuccess, onInitError)
}

function sessionListener(e) {
  session = e
  console.log('New session')
  if (session.media.length != 0) {
    console.log('Found ' + session.media.length + ' sessions.')
  }
}

function receiverListener(e) {
  if (e === 'available') {
    console.log('Chromecast was found on the network.')
  } else {
    console.log('There are no Chromecasts available.')
  }
}

function onInitSuccess() {
  console.log('Initialization succeeded')
}

function onInitError() {
  console.log('Initialization failed')
}

document.querySelector('#cast-btn').addEventListener('click', function () {
  launchApp()
})

function launchApp() {
  console.log('Launching the Chromecast App...')
  chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError)
}

function onRequestSessionSuccess(e) {
  console.log('Successfully created session: ' + e.sessionId)
  session = e
}

function onLaunchError() {
  console.log('Error connecting to the Chromecast.')
}

function onRequestSessionSuccess(e) {
  console.log('Successfully created session: ' + e.sessionId)
  session = e
  loadMedia()
}

function loadMedia() {
  if (!session) {
    console.log('No session.')
    return
  }

  var mediaInfo = new chrome.cast.media.MediaInfo(
    // URL.createObjectURL('test.mp4')
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  )
  mediaInfo.contentType = 'video/mp4'

  var request = new chrome.cast.media.LoadRequest(mediaInfo)
  request.autoplay = true

  session.loadMedia(request, onLoadSuccess, onLoadError)
}

function onLoadSuccess() {
  console.log('Successfully loaded image.')
}

function onLoadError() {
  console.log('Failed to load image.')
}

// document.querySelector('#stop').addEventListener('click', function () {
//   stopApp()
// })

function stopApp() {
  session.stop(onStopAppSuccess, onStopAppError)
}

function onStopAppSuccess() {
  console.log('Successfully stopped app.')
}

function onStopAppError() {
  console.log('Error stopping app.')
}

// ---------------------------------------------------------
const fileForm = document.querySelector('#file-form')
const videoEl = document.querySelector('#video-player')
const videoSourceEl = document.querySelector('#video-source')

// fileForm.addEventListener('change', handleFile)

function handleFile(e) {
  const files = e.target.files
  const ourl = URL.createObjectURL(files[0])

  videoSourceEl.src = ourl
  videoEl.load()
}
