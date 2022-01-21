(define-map tuple-key-map { a: uint, b: bool } (string-ascii 10))

(define-map tuple-val-map uint { a: uint, b: bool })

(define-map simple-map uint bool)

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

(define-read-only (fn-with-for (for bool)) true)