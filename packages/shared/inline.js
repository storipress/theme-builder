const rudderanalytics = (window.rudderanalytics = [])

const writeKey = process.env.RUDDER_WRITE_KEY
const planeUrl = process.env.RUDDER_PLANE_URL

const methods = [
  'load',
  'page',
  'track',
  'identify',
  'alias',
  'group',
  'ready',
  'reset',
  'getAnonymousId',
  'setAnonymousId',
]

for (const method of methods) {
  rudderanalytics[method] = (...args) => {
    rudderanalytics.push([method, ...args])
  }
}
rudderanalytics.load(writeKey, planeUrl)
rudderanalytics.page()

const INTERCOM_ID = process.env.INTERCOM_APP_ID

const w = window
const ic = w.Intercom
if (typeof ic === 'function') {
  ic('reattach_activator')
  ic('update', w.intercomSettings)
} else {
  const d = document
  const i = function () {
    i.c(arguments)
  }
  i.q = []
  i.c = function (args) {
    i.q.push(args)
  }
  w.Intercom = i
  const l = function () {
    const s = d.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = `https://widget.intercom.io/widget/${INTERCOM_ID}`
    const x = d.querySelectorAll('script')[0]
    x.parentNode.insertBefore(s, x)
  }
  if (document.readyState === 'complete') {
    l()
  } else {
    w.addEventListener('load', l, false)
  }
}
