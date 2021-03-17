;; application registry for applications  wishing to sell NFTs throug the marketplace
(define-data-var administrator principal 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW)
(define-map app-map ((index int)) ((owner (buff 80)) (app-contract-id (buff 100)) (storage-model int) (status int)))
(define-data-var app-counter int 0)

(define-constant not-found (err u100))
(define-constant illegal-storage (err u102))
(define-constant not-allowed (err u101))

;; -- writers --
(define-public (transfer-administrator (new-administrator principal))
    (begin
        (asserts! (is-eq (var-get administrator) contract-caller) not-allowed)
        (var-set administrator new-administrator)
        (ok true)))

;; Insert new app at current index
(define-public (register-app (owner (buff 80)) (app-contract-id (buff 100)) (storage-model int))
  (begin
    (if (is-storage-allowed storage-model)
      (begin
        ;; (map-insert app-map ((index (var-get app-counter))) ((owner owner) (app-contract-id app-contract-id) (storage-model storage-model) (status 0)))
        (var-set app-counter (+ (var-get app-counter) 1))
        (print (var-get app-counter))
        (ok (var-get app-counter))
      )
      illegal-storage
    )
  )
)

;; Make app live - set status to 1
(define-public (set-app-live (index int) (owner (buff 80)) (app-contract-id (buff 100)) (storage-model int))
  (begin
    (if (is-update-allowed)
    (begin
      (match (map-get? app-map {index: index})
        myProject 
        (ok (map-set app-map {index: index} ((owner owner) (app-contract-id app-contract-id) (storage-model storage-model) (status 1))))
        not-found
      )
    )
      not-allowed
    )
  )
)

;; -- read only --
;; Get app by index
(define-read-only (get-app (index int))
  (match (map-get? app-map ((index index)))
    myProject (ok myProject) not-found
  )
)
(define-read-only (get-app-counter)
  (ok (var-get app-counter))
)
;; Get current administrator
(define-read-only (get-administrator)
    (var-get administrator))

;; -- private --
(define-private (is-update-allowed)
  (is-eq (var-get administrator) contract-caller)
)
(define-private (is-storage-allowed (storage int))
  (<= storage 10)
)