(define-read-only (echo (val (string-ascii 33)))
  val
)

(define-read-only (echo-with-logs (val (string-ascii 33)))
  (begin
    (print val)
    val
  )
)

(define-read-only (ro-resp (return-err bool))
  (if return-err (err u100) (ok "asdf"))
)

(define-public (print-pub)
  (begin
    (print u32)
    (print { a: true })
    (print "hello")
    (ok true)
  )
)

(define-public (print-err)
  (begin
    (print u100)
    (err u210)
  )
)