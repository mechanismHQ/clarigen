;; This is a testing contract, used to test out
;; the claridoc package.

(define-map simple-map uint bool)

(define-public (set-in-map (key uint) (val bool))
  (ok (map-set simple-map key val))
)

(define-data-var num-var uint u0)

;; Set a num.
;;
;; This is comments.
(define-public (set-num (num uint))
  (ok (var-set num-var num))
)

(define-read-only (echo (val (string-ascii 33))) val)

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