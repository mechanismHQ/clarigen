;; The counter contract maintains a single global counter
;; variable. Users can change the counter by calling
;; `increment` and `decrement`.

;; The variable used to hold the global counter.
(define-data-var counter uint u1)

;; Get the current counter
(define-read-only (get-counter)
  (var-get counter)
)

;; (define-constant test-buff (buff-to-uint-be 0xdeadbeef))
;; (define-constant buff-const 0xdeadbeef)
;; (define-constant ERR_TEST (err u123))

;; Increment the counter.
;; 
;; @returns the new value of the counter
;; 
;; @param step; The interval to increase the counter by
(define-public (increment (step uint))
  (let (
    (new-val (+ step (var-get counter)))
  ) 
  ;; #[allow(unchecked_data)]
  (var-set counter new-val)
  (print { object: "counter", action: "incremented", value: new-val })
  (ok new-val))
)

;; Decrement the counter
;; 
;; @param step; The interval to increase the counter by
(define-public (decrement (step uint))
  (let (
    (new-val (- (var-get counter) step))
  ) 
  ;; #[allow(unchecked_data)]
  (var-set counter new-val)
  (print { object: "counter", action: "decremented", value: new-val })
  (ok new-val))
)
