(define-public (get-name)
  (ok "hello, world")
)

(define-read-only (get-tuple)
  { a: u1, b: true }
)

(define-public (get-tuple-pub)
  (ok { a: u1, b: true })
)

(define-read-only (get-tuple-resp)
  (ok { a: u1, b: true, c: { d: 1 } })
)

(define-read-only (get-buff) 0xaaaa)