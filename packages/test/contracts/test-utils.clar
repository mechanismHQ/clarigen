(define-read-only (get-block-height)
  block-height
)

(define-public (mine-block)
  (ok true)
)

(define-read-only (get-stx-balance (account principal))
  (stx-get-balance account)
)