(define-data-var my-var uint u1)

(define-constant ERR_SOMETHING u2)

(define-map basic-map uint bool)

(define-map tuple-map { a: (string-ascii 10) } { b: uint })

(define-public (get-name)
  (ok "hello, world")
)

(define-read-only (get-number)
  u1
)