export const isSafari =
  navigator.vendor.match(/apple/i) && !/crios/i.test(navigator.userAgent) && !/fxios/i.test(navigator.userAgent)
